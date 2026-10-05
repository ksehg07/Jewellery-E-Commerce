export interface RazorpayPrefill {
  name?: string;
  email?: string;
  contact?: string;
}

export interface RazorpaySuccessResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface RazorpayPaymentFailureResponse {
  error: {
    code: string;
    description: string;
    source: string;
    step: string;
    reason: string;
    metadata: {
      order_id: string;
      payment_id?: string;
    };
  };
}


export interface InitiateCheckoutOptions {
  cartItems: { productId: string; variantId?: string | null; quantity: number }[];
  shippingDetails: any;
  name?: string;
  description?: string;
  prefill?: RazorpayPrefill;
  notes?: Record<string, string>;
  onSuccess?: (verifyResult: {
    success: boolean;
    order_id: string;
    payment_id: string;
  }) => void;
  onError?: (error: Error | string) => void;
  onDismiss?: () => void;
}

/**
 * Dynamically loads the Razorpay Standard Checkout script if not already present.
 */
export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }

    if ((window as any).Razorpay) {
      resolve(true);
      return;
    }

    const existingScript = document.querySelector(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
    );
    if (existingScript) {
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }

      existingScript.addEventListener("load", () => resolve(true));
      existingScript.addEventListener("error", () => resolve(false));
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

/**
 * Initiates Razorpay Standard Web Checkout:
 * 1. Calls POST /api/create-order to create order in Razorpay
 * 2. Launches Razorpay modal with order_id and options
 * 3. On success, calls POST /api/verify-payment with razorpay_payment_id, razorpay_order_id, razorpay_signature
 * 4. Handles modal dismiss (cancellation) and payment failure events
 */
export async function initiateRazorpayCheckout({
  cartItems,
  shippingDetails,
  name = "Parth Jewellers",
  description = "Order Payment",
  prefill,
  notes,
  onSuccess,
  onError,
  onDismiss,
}: InitiateCheckoutOptions): Promise<void> {
  // Ensure Razorpay SDK script is loaded
  const isLoaded = await loadRazorpayScript();
  if (!isLoaded) {
    const err = new Error(
      "Razorpay SDK failed to load. Please check your internet connection."
    );
    onError?.(err);
    throw err;
  }

  const razorpayKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  if (!razorpayKeyId) {
    const err = new Error(
      "NEXT_PUBLIC_RAZORPAY_KEY_ID is not configured in environment variables."
    );
    onError?.(err);
    throw err;
  }

  // Step 1: Create Order via Backend API
  let createOrderResponse;
  try {
    const res = await fetch("/api/create-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cartItems,
        shippingDetails,
        notes,
      }),
    });

    createOrderResponse = await res.json();

    if (!res.ok) {
      throw new Error(
        createOrderResponse.error || "Failed to create Razorpay order"
      );
    }
  } catch (err: any) {
    onError?.(err);
    throw err;
  }

  const { order_id, amount: orderAmount, currency: orderCurrency } =
    createOrderResponse;

  // Step 2: Open Razorpay Checkout Modal
  return new Promise<void>((resolve, reject) => {
    let paymentCompleted = false;

    const options = {
      key: razorpayKeyId,
      amount: orderAmount,
      currency: orderCurrency || "INR",
      name,
      description,
      order_id,
      prefill: {
        name: prefill?.name || "",
        email: prefill?.email || "",
        contact: prefill?.contact || "",
      },
      notes: notes || {},
      theme: {
        color: "#c69214", // Accent gold matching Parth Jewellers theme
      },
      modal: {
        ondismiss: () => {
          if (!paymentCompleted) {
            onDismiss?.();
            resolve();
          }
        },
      },
      handler: async function (response: RazorpaySuccessResponse) {
        paymentCompleted = true;
        // Step 3: Verify Payment Signature via Backend API
        try {
          const verifyRes = await fetch("/api/verify-payment", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });

          const verifyData = await verifyRes.json();

          if (!verifyRes.ok || !verifyData.success) {
            const err = new Error(
              verifyData.error || "Payment signature verification failed."
            );
            onError?.(err);
            reject(err);
            return;
          }

          onSuccess?.(verifyData);
          resolve();
        } catch (err: any) {
          onError?.(err);
          reject(err);
        }
      },
    };

    const rzp = new (window as any).Razorpay(options);

    // Listen for payment failure
    rzp.on("payment.failed", function (failResponse: RazorpayPaymentFailureResponse) {
      const errorDescription =
        failResponse.error?.description ||
        failResponse.error?.reason ||
        "Payment failed. Please try again.";
      const err = new Error(errorDescription);
      onError?.(err);
      reject(err);
    });

    rzp.open();
  });
}

