"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  initiateRazorpayCheckout,
  RazorpayPrefill,
} from "@/lib/razorpay-client";
import { toast } from "sonner";

interface RazorpayButtonProps {
  cartItems: any[];
  shippingDetails: any;
  currency?: string;
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
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

export function RazorpayButton({
  cartItems,
  shippingDetails,
  name = "Parth Jewellers",
  description = "Order Payment",
  prefill,
  notes,
  onSuccess,
  onError,
  onDismiss,
  className,
  children,
  disabled = false,
}: RazorpayButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  async function handlePayment() {
    if (isLoading || disabled) return;



    setIsLoading(true);

    try {
      await initiateRazorpayCheckout({
        cartItems,
        shippingDetails,
        name,
        description,
        prefill,
        notes,
        onSuccess: (result) => {
          toast.success("Payment successful and verified!");
          onSuccess?.(result);
        },
        onError: (err) => {
          const message = typeof err === "string" ? err : err.message;
          toast.error(message || "Payment failed");
          onError?.(err);
        },
        onDismiss: () => {
          toast.info("Payment cancelled");
          onDismiss?.();
        },
      });
    } catch (err: any) {
      console.error("Checkout initiation error:", err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <Button
        type="button"
        size="lg"
        onClick={handlePayment}
        disabled={isLoading || disabled}
        className={className}
      >
        {isLoading ? "Processing Payment..." : children || "Pay with Razorpay"}
      </Button>
    </>
  );
}

