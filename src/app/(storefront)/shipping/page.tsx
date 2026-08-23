import { Container } from "@/components/layout/container";

export default function ShippingPage() {
  return (
    <Container className="py-16 sm:py-20">
      <div className="mx-auto max-w-4xl">
        <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
          Shipping Information
        </p>

        <h1 className="font-display text-4xl tracking-tight text-foreground sm:text-5xl">
          Delivery details for your order.
        </h1>

        <div className="mt-8 space-y-8 text-base leading-7 text-muted-foreground">
          <section className="border-b border-border pb-6">
            <h2 className="font-display text-2xl text-foreground">Order Processing</h2>
            <p className="mt-3">
              Orders are reviewed and prepared in the order they are received. Details
              will be confirmed by the store as part of its final policy.
            </p>
          </section>

          <section className="border-b border-border pb-6">
            <h2 className="font-display text-2xl text-foreground">Delivery Coverage</h2>
            <p className="mt-3">
              Delivery coverage and service availability will be confirmed by the store
              based on the destination and selected order details.
            </p>
          </section>

          <section className="border-b border-border pb-6">
            <h2 className="font-display text-2xl text-foreground">Shipping Charges</h2>
            <p className="mt-3">
              Shipping fees, if applicable, and any threshold-based offers will be
              confirmed by the store. Details will be confirmed by the store.
            </p>
          </section>

          <section className="border-b border-border pb-6">
            <h2 className="font-display text-2xl text-foreground">Order Tracking</h2>
            <p className="mt-3">
              Tracking information, where available, will be shared with the customer as
              soon as the order is dispatched. Details will be confirmed by the store.
            </p>
          </section>

          <section className="border-b border-border pb-6">
            <h2 className="font-display text-2xl text-foreground">Delivery Delays</h2>
            <p className="mt-3">
              While we aim to fulfil each order carefully, delays may occasionally occur
              due to dispatch schedules, carrier networks, or circumstances outside the
              store&apos;s control. Details will be confirmed by the store.
            </p>
          </section>
        </div>
      </div>
    </Container>
  );
}
