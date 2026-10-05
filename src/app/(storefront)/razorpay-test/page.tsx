"use client";

import { useState } from "react";
import { Container } from "@/components/layout/container";
import { RazorpayButton } from "@/components/storefront/checkout/razorpay-button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, ShieldCheck, AlertCircle } from "lucide-react";

export default function RazorpayTestPage() {
  const [amountRupees, setAmountRupees] = useState("100");
  const [customerName, setCustomerName] = useState("Kunal Sehgal");
  const [customerEmail, setCustomerEmail] = useState("kunal@example.com");
  const [customerPhone, setCustomerPhone] = useState("9876543210");
  const [verificationResult, setVerificationResult] = useState<{
    success: boolean;
    order_id: string;
    payment_id: string;
  } | null>(null);
  const [lastError, setLastError] = useState<string | null>(null);

  const amountNumber = parseFloat(amountRupees) || 0;
  const amountInPaise = Math.round(amountNumber * 100);

  return (
    <Container className="py-12 sm:py-20 max-w-2xl">
      <div className="text-center mb-8">
        <p className="text-xs font-medium tracking-[0.2em] text-accent uppercase">
          Integration Verification
        </p>
        <h1 className="mt-2 font-display text-4xl">Razorpay Standard Checkout Test</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Use this interactive test console to verify the 3-step Razorpay integration:
          Order Creation &rarr; Standard Checkout Modal &rarr; Server-Side Signature Verification.
        </p>
      </div>

      <Card className="border border-border">
        <CardHeader>
          <CardTitle className="text-xl">Test Payment Details</CardTitle>
          <CardDescription>
            Enter test parameters to launch Razorpay checkout modal
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1.5">
                Amount (INR ₹)
              </label>
              <Input
                type="number"
                min="1"
                step="1"
                value={amountRupees}
                onChange={(e) => {
                  setAmountRupees(e.target.value);
                  setVerificationResult(null);
                  setLastError(null);
                }}
                placeholder="100"
              />
              <span className="text-[11px] text-muted-foreground mt-1 block">
                = {amountInPaise} paise (min: 100 paise)
              </span>
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1.5">
                Customer Name
              </label>
              <Input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Full Name"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1.5">
                Customer Email
              </label>
              <Input
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="Email"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1.5">
                Customer Phone
              </label>
              <Input
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="Phone"
              />
            </div>
          </div>

          {lastError && (
            <div className="flex items-start gap-2.5 rounded-md border border-destructive/20 bg-destructive/10 p-3.5 text-sm text-destructive">
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Payment Error</p>
                <p className="text-xs mt-0.5">{lastError}</p>
              </div>
            </div>
          )}

          {verificationResult && (
            <div className="flex items-start gap-2.5 rounded-md border border-emerald-500/20 bg-emerald-500/10 p-4 text-emerald-700 dark:text-emerald-300">
              <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5 text-emerald-500" />
              <div className="space-y-1 text-xs">
                <p className="font-semibold text-sm">Payment Verified Successfully!</p>
                <p>
                  <strong>Order ID:</strong> {verificationResult.order_id}
                </p>
                <p>
                  <strong>Payment ID:</strong> {verificationResult.payment_id}
                </p>
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400">
                  HMAC-SHA256 signature was verified on the backend.
                </p>
              </div>
            </div>
          )}

          <div className="pt-2">
            <RazorpayButton
              cartItems={[{productId: "test-product-id", quantity: 1}]} 
              shippingDetails={{firstName: "Test", lastName: "User", email: "test@example.com", phone: "9999999999", addressLine1: "Test", city: "Test", state: "Test", postalCode: "000000", country: "India"}}
              name="Parth Jewellers Test"
              description={`Test payment of ₹${amountRupees}`}
              prefill={{
                name: customerName,
                email: customerEmail,
                contact: customerPhone,
              }}
              onSuccess={(result) => {
                setVerificationResult(result);
                setLastError(null);
              }}
              onError={(err) => {
                const msg = typeof err === "string" ? err : err.message;
                setLastError(msg);
              }}
              onDismiss={() => {
                setLastError("Payment modal was closed by user.");
              }}
              className="w-full text-base py-6 font-medium"
            >
              Pay ₹{amountRupees || "0"} with Razorpay
            </RazorpayButton>

            <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground mt-3">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              Uses Test Key: {process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "Configured"}
            </p>
          </div>
        </CardContent>
      </Card>
    </Container>
  );
}

