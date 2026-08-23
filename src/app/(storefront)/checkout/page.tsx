import { Container } from "@/components/layout/container";

import { CheckoutForm } from "@/components/storefront/checkout/checkout-form";
import { OrderSummary } from "@/components/storefront/checkout/order-summary";

export default function CheckoutPage() {
  return (
    <Container className="py-12 sm:py-20">
      <div className="mb-12">
        <p className="text-xs font-medium tracking-[0.2em] text-accent uppercase">
          Secure Checkout
        </p>

        <h1 className="mt-3 font-display text-5xl">
          Complete your order
        </h1>

        <p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground">
          Enter your details below to continue securely to payment.
        </p>
      </div>

      <div className="grid gap-12 lg:grid-cols-[1fr_400px]">
        <CheckoutForm />

        <OrderSummary />
      </div>
    </Container>
  );
}