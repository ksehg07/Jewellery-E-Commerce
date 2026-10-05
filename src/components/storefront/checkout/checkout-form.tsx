"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCartStore } from "@/features/cart/store";
import { initiateRazorpayCheckout } from "@/lib/razorpay-client";
import { toast } from "sonner";
import { CheckCircle2, ShieldCheck } from "lucide-react";
import { authClient } from "@/lib/auth/auth-client";

interface PaymentSuccessData {
  order_id: string;
  payment_id: string;
}

export function CheckoutForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [defaultValues, setDefaultValues] = useState<Record<string, string> | null>(null);
  const { data: session } = authClient.useSession();

  useEffect(() => {
    const saved = sessionStorage.getItem("checkoutFormData");
    if (saved) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setDefaultValues(JSON.parse(saved));
      } catch {
        setDefaultValues({});
      }
      sessionStorage.removeItem("checkoutFormData");
    } else {
      setDefaultValues({});
    }
  }, []);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState<PaymentSuccessData | null>(
    null
  );

  const subtotal = useCartStore((state) => state.getSubtotal());
  const cartItems = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);

    const formData = new FormData(event.currentTarget);
    const email = (formData.get("email") as string) || "";
    const phone = (formData.get("phone") as string) || "";
    const firstName = (formData.get("firstName") as string) || "";
    const lastName = (formData.get("lastName") as string) || "";
    const addressLine1 = (formData.get("addressLine1") as string) || "";
    const city = (formData.get("city") as string) || "";
    const state = (formData.get("state") as string) || "";
    const postalCode = (formData.get("postalCode") as string) || "";
    const addressLine2 = (formData.get("addressLine2") as string) || "";
    const country = (formData.get("country") as string) || "";
    const fullName = `${firstName} ${lastName}`.trim();

    if (!session) {
      const dataToSave = { email, phone, firstName, lastName, addressLine1, addressLine2, city, state, postalCode, country };
      sessionStorage.setItem("checkoutFormData", JSON.stringify(dataToSave));
      router.push("/login?callbackUrl=/checkout");
      return;
    }
    const shippingDetails = { email, phone, firstName, lastName, addressLine1, addressLine2, city, state, postalCode, country };




    setIsSubmitting(true);

    try {
      await initiateRazorpayCheckout({
        cartItems: cartItems.map(item => ({ productId: item.productId, variantId: item.variantId, quantity: item.quantity })),
        shippingDetails,
        name: "Parth Jewellers",
        description: "Jewellery Order Payment",
        prefill: {
          name: fullName,
          email,
          contact: phone,
        },
        notes: {
          shipping_address: `${addressLine1}, ${city}, ${state} - ${postalCode}`,
        },
        onSuccess: (result) => {
          setIsSubmitting(false);
          clearCart();
          setPaymentSuccess({
            order_id: result.order_id,
            payment_id: result.payment_id,
          });
          toast.success("Payment verified successfully!");
        },
        onError: (err) => {
          setIsSubmitting(false);
          const msg =
            typeof err === "string"
              ? err
              : err.message || "Payment processing failed";
          setErrorMessage(msg);
          toast.error(msg);
        },
        onDismiss: () => {
          setIsSubmitting(false);
          toast.info("Payment was cancelled.");
        },
      });
    } catch (err: any) {
      setIsSubmitting(false);
      const msg = err.message || "Unable to initiate payment";
      setErrorMessage(msg);
      toast.error(msg);
    }
  }

  if (paymentSuccess) {
    return (
      <div className="rounded-lg border border-border bg-card p-8 text-center space-y-6">
        <div className="flex justify-center">
          <CheckCircle2 className="h-16 w-16 text-emerald-500 animate-in fade-in zoom-in" />
        </div>
        <h2 className="font-display text-3xl font-medium">Payment Successful!</h2>
        <p className="text-muted-foreground max-w-md mx-auto text-sm leading-6">
          Thank you for your order with Parth Jewellers. Your payment has been
          verified and your order is now being processed.
        </p>
        <div className="bg-secondary/50 rounded-md p-4 max-w-md mx-auto text-left text-xs font-mono space-y-1">
          <div>
            <span className="text-muted-foreground">Order ID: </span>
            <span className="font-semibold text-foreground">
              {paymentSuccess.order_id}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">Payment ID: </span>
            <span className="font-semibold text-foreground">
              {paymentSuccess.payment_id}
            </span>
          </div>
        </div>
        <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild variant="outline">
            <Link href="/shop">Continue Shopping</Link>
          </Button>
          <Button asChild>
            <Link href="/account">View Orders</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (!defaultValues) {
    return (
      <div className="flex justify-center items-center py-20 text-muted-foreground">
        Loading checkout...
      </div>
    );
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-10">
        {errorMessage && (
          <div className="rounded-md border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
            {errorMessage}
          </div>
        )}

        {/* Contact Information */}
        <section>
          <h2 className="font-display text-2xl">Contact Information</h2>

          <div className="mt-6 grid gap-4">
            <Input
              type="email"
              name="email"
              placeholder="Email address"
              defaultValue={defaultValues.email || ""}
              required
            />

            <Input
              type="tel"
              name="phone"
              placeholder="Phone number (e.g. 9876543210)"
              defaultValue={defaultValues.phone || ""}
              required
            />
          </div>
        </section>

        {/* Shipping Address */}
        <section>
          <h2 className="font-display text-2xl">Shipping Address</h2>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Input
              name="firstName"
              placeholder="First name"
              defaultValue={defaultValues.firstName || ""}
              required
            />

            <Input
              name="lastName"
              placeholder="Last name"
              defaultValue={defaultValues.lastName || ""}
              required
            />

            <div className="sm:col-span-2">
              <Input
                name="addressLine1"
                placeholder="Address"
                defaultValue={defaultValues.addressLine1 || ""}
                required
              />
            </div>

            <div className="sm:col-span-2">
              <Input
                name="addressLine2"
                placeholder="Apartment, suite, etc. (optional)"
                defaultValue={defaultValues.addressLine2 || ""}
              />
            </div>

            <Input
              name="city"
              placeholder="City"
              defaultValue={defaultValues.city || ""}
              required
            />

            <Input
              name="state"
              placeholder="State"
              defaultValue={defaultValues.state || ""}
              required
            />

            <Input
              name="postalCode"
              placeholder="PIN code"
              defaultValue={defaultValues.postalCode || ""}
              required
            />

            <Input
              name="country"
              placeholder="Country"
              defaultValue={defaultValues.country || ""}
              required
            />
          </div>
        </section>

        <div className="space-y-3">
          <Button
            type="submit"
            size="lg"
            className="w-full text-base font-medium py-6"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              "Opening Razorpay Payment..."
            ) : (
              `Pay ${subtotal > 0 ? `₹${subtotal.toLocaleString("en-IN")}` : "₹1.00 (Test)"} with Razorpay`
            )}
          </Button>

          <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            100% Secure Payment powered by Razorpay Standard Checkout
          </p>
        </div>
      </form>
    </>
  );
}