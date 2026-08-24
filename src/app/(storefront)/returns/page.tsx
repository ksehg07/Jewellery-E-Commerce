import { Container } from "@/components/layout/container";

export default function ReturnsPage() {
  return (
    <Container className="py-16 sm:py-20">
      <div className="mx-auto max-w-4xl">
        <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
          Returns & Exchange
        </p>

        <h1 className="font-display text-4xl tracking-tight text-foreground sm:text-5xl">
          A clear and considerate returns process!
        </h1>

        <div className="mt-8 space-y-8 text-base leading-7 text-muted-foreground">
          <section className="border-b border-border pb-6">
            <h2 className="font-display text-2xl text-foreground">Eligibility</h2>
            <p className="mt-3">
              Return or exchange eligibility will be determined in line with the store&apos;s
              final policy and the condition of the item at the time it is returned.
              Detailed conditions will be confirmed by the store.
            </p>
          </section>

          <section className="border-b border-border pb-6">
            <h2 className="font-display text-2xl text-foreground">Return / Exchange Process</h2>
            <p className="mt-3">
              Customers may contact the store to initiate a return or exchange request.
              The specific steps, timelines, and required documentation will be confirmed
              by the store before any request is processed.
            </p>
          </section>

          <section className="border-b border-border pb-6">
            <h2 className="font-display text-2xl text-foreground">Condition of Items</h2>
            <p className="mt-3">
              Items must be returned in their original condition, as appropriate to the
              type of product and according to the store&apos;s final policy. Detailed factors
              will be confirmed by the store.
            </p>
          </section>

          <section className="border-b border-border pb-6">
            <h2 className="font-display text-2xl text-foreground">Refunds</h2>
            <p className="mt-3">
              Refund eligibility, method, and timing may vary depending on the product,
              order circumstances, and the final policy set by the store. Detailed terms
              will be confirmed by the store.
            </p>
          </section>

          <section className="border-b border-border pb-6">
            <h2 className="font-display text-2xl text-foreground">Non-Returnable Items</h2>
            <p className="mt-3">
              Certain items may be non-returnable or subject to additional conditions,
              depending on the nature of the purchase and the final policy applied by the
              store. Details will be confirmed by the store.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-foreground">Damaged or Incorrect Orders</h2>
            <p className="mt-3">
              If an item is damaged, incorrect, or otherwise not as expected, the store
              will review the matter and advise on the next steps. The final process and
              timelines will be confirmed by the store.
            </p>
          </section>
        </div>
      </div>
    </Container>
  );
}
