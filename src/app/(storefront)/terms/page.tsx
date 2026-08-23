import { Container } from "@/components/layout/container";

export default function TermsPage() {
  return (
    <Container className="py-16 sm:py-20">
      <div className="mx-auto max-w-4xl">
        <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
          Terms & Conditions
        </p>

        <h1 className="font-display text-4xl tracking-tight text-foreground sm:text-5xl">
          A draft storefront template.
        </h1>

        <div className="mt-8 space-y-8 text-base leading-7 text-muted-foreground">
          <section className="border-b border-border pb-6">
            <h2 className="font-display text-2xl text-foreground">Website Use</h2>
            <p className="mt-3">
              This website is intended for browsing and ordering information in a lawful and
              responsible manner. The store may restrict access or activity if it believes
              the website is being used in a way that is inappropriate or harmful.
            </p>
          </section>

          <section className="border-b border-border pb-6">
            <h2 className="font-display text-2xl text-foreground">Product Information</h2>
            <p className="mt-3">
              Product details, images, descriptions, and availability may be updated from
              time to time. The store reserves the right to amend information as necessary
              and to confirm final product specifications before purchase.
            </p>
          </section>

          <section className="border-b border-border pb-6">
            <h2 className="font-display text-2xl text-foreground">Pricing</h2>
            <p className="mt-3">
              Prices shown on the website are subject to change without notice and may be
              adjusted at the store&apos;s discretion. Final pricing will be confirmed at the
              time of order and payment.
            </p>
          </section>

          <section className="border-b border-border pb-6">
            <h2 className="font-display text-2xl text-foreground">Orders</h2>
            <p className="mt-3">
              The store may accept or decline any order at its discretion. Orders are
              subject to product availability, payment approval, and the final terms of the
              store&apos;s ordering process.
            </p>
          </section>

          <section className="border-b border-border pb-6">
            <h2 className="font-display text-2xl text-foreground">Payments</h2>
            <p className="mt-3">
              Payment methods, processing, and confirmation steps may vary based on the final
              checkout solution selected by the store. Final payment details will be
              confirmed before purchase completion.
            </p>
          </section>

          <section className="border-b border-border pb-6">
            <h2 className="font-display text-2xl text-foreground">Availability</h2>
            <p className="mt-3">
              Product availability may change without notice. If an item is unavailable after
              an order is placed, the store will follow its standard process for next steps
              and communication.
            </p>
          </section>

          <section className="border-b border-border pb-6">
            <h2 className="font-display text-2xl text-foreground">Cancellations</h2>
            <p className="mt-3">
              Cancellation requests may be accepted or rejected depending on the order stage,
              product type, and the store&apos;s final policy. Detailed terms will be confirmed
              by the store.
            </p>
          </section>

          <section className="border-b border-border pb-6">
            <h2 className="font-display text-2xl text-foreground">Intellectual Property</h2>
            <p className="mt-3">
              All content on this website, including text, imagery, branding, and design
              elements, may be protected by intellectual property rights and should not be
              reproduced without permission.
            </p>
          </section>

          <section className="border-b border-border pb-6">
            <h2 className="font-display text-2xl text-foreground">Limitation of Liability</h2>
            <p className="mt-3">
              The store may limit liability for certain losses, damages, or interruptions in
              line with applicable law and the final legal terms adopted by the business.
              Final wording should be reviewed by legal counsel before publication.
            </p>
          </section>

          <section className="border-b border-border pb-6">
            <h2 className="font-display text-2xl text-foreground">Changes to Terms</h2>
            <p className="mt-3">
              These terms may be updated at any time. Any revised version will be published
              on this website and will apply as determined by the store.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-foreground">Contact</h2>
            <p className="mt-3">
              For any questions about these terms, please contact the store using the
              contact details listed on the website.
            </p>
          </section>
        </div>
      </div>
    </Container>
  );
}
