import { Container } from "@/components/layout/container";

export default function PrivacyPolicyPage() {
  return (
    <Container className="py-16 sm:py-20">
      <div className="mx-auto max-w-4xl">
        <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
          Privacy Policy
        </p>

        <h1 className="font-display text-4xl tracking-tight text-foreground sm:text-5xl">
          Your privacy matters to us.
        </h1>

        <div className="mt-8 space-y-8 text-base leading-7 text-muted-foreground">
          <section className="border-b border-border pb-6">
            <h2 className="font-display text-2xl text-foreground">Information We Collect</h2>
            <p className="mt-3">
              We may collect information you provide directly, such as your name, contact
              details, order information, and any preferences or queries submitted through
              the website. Additional details may be collected as part of the store&apos;s
              final website and order processes.
            </p>
          </section>

          <section className="border-b border-border pb-6">
            <h2 className="font-display text-2xl text-foreground">How We Use Information</h2>
            <p className="mt-3">
              Information may be used to process orders, answer enquiries, improve the
              customer experience, communicate updates, and support business operations.
              Specific purposes may be confirmed by the store in its final policy.
            </p>
          </section>

          <section className="border-b border-border pb-6">
            <h2 className="font-display text-2xl text-foreground">Cookies and Website Technologies</h2>
            <p className="mt-3">
              The website may use cookies, analytics, and similar technologies to support
              functionality, understand usage patterns, and improve the shopping experience.
              Final cookie settings and tracking practices will be confirmed by the store.
            </p>
          </section>

          <section className="border-b border-border pb-6">
            <h2 className="font-display text-2xl text-foreground">Payment Information</h2>
            <p className="mt-3">
              Payment data may be handled through secure third-party payment providers in
              accordance with the store&apos;s chosen checkout process. The final detail of how
              payment information is processed will be confirmed by the store.
            </p>
          </section>

          <section className="border-b border-border pb-6">
            <h2 className="font-display text-2xl text-foreground">Third-Party Services</h2>
            <p className="mt-3">
              The store may use trusted third-party services for hosting, analytics,
              customer communication, or other business operations. These external providers
              may process information in accordance with their own privacy practices.
            </p>
          </section>

          <section className="border-b border-border pb-6">
            <h2 className="font-display text-2xl text-foreground">Data Security</h2>
            <p className="mt-3">
              Reasonable technical and organisational measures may be used to help protect
              personal information. Final security practices and responsibilities will be
              confirmed by the store.
            </p>
          </section>

          <section className="border-b border-border pb-6">
            <h2 className="font-display text-2xl text-foreground">Your Choices</h2>
            <p className="mt-3">
              You may have rights regarding your personal information depending on your
              jurisdiction and applicable law. The store will confirm any request process
              and required details as part of the final policy.
            </p>
          </section>

          <section className="border-b border-border pb-6">
            <h2 className="font-display text-2xl text-foreground">Changes to This Policy</h2>
            <p className="mt-3">
              This policy may be updated from time to time to reflect business changes,
              legal requirements, or improvements to the website. Any material updates will
              be communicated as appropriate by the store.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-foreground">Contact</h2>
            <p className="mt-3">
              If you have any questions about this Privacy Policy, please contact the store
              using the details available on the website&apos;s contact page. Final contact
              information will be confirmed by the store.
            </p>
          </section>
        </div>
      </div>
    </Container>
  );
}
