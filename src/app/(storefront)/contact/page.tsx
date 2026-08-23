import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";

export default function ContactPage() {
  return (
    <Container className="py-16 sm:py-20">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 max-w-2xl">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Contact
          </p>
          <h1 className="font-display text-4xl tracking-tight text-foreground sm:text-5xl">
            We&apos;re here to help.
          </h1>
          <p className="mt-5 text-base leading-7 text-muted-foreground">
            Whether you&apos;re planning a special occasion or have a question about a
            piece, we&apos;d love to assist with your jewellery needs.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.35fr]">
          <div className="space-y-6 rounded-2xl border border-border bg-secondary/60 p-6 sm:p-8">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
                Contact Information
              </p>
            </div>

            <div className="space-y-5 text-sm text-muted-foreground">
              <div>
                <p className="font-medium text-foreground">Phone</p>
                <p className="mt-1">[Phone Number]</p>
              </div>

              <div>
                <p className="font-medium text-foreground">Email</p>
                <p className="mt-1">[Email Address]</p>
              </div>

              <div>
                <p className="font-medium text-foreground">Store Address</p>
                <p className="mt-1">[Store Address]</p>
              </div>
            </div>
          </div>

          <form className="rounded-2xl border border-border bg-background p-6 sm:p-8">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-foreground">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="Your name"
                  className="h-11 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none ring-0 placeholder:text-muted-foreground/80 focus:border-ring"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-foreground">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="Your email"
                  className="h-11 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none ring-0 placeholder:text-muted-foreground/80 focus:border-ring"
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <label htmlFor="phone" className="text-sm font-medium text-foreground">
                  Phone
                </label>
                <input
                  id="phone"
                  type="tel"
                  placeholder="Your phone number"
                  className="h-11 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none ring-0 placeholder:text-muted-foreground/80 focus:border-ring"
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <label htmlFor="message" className="text-sm font-medium text-foreground">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={6}
                  placeholder="How can we help you?"
                  className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none ring-0 placeholder:text-muted-foreground/80 focus:border-ring"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-start">
              <Button type="button" size="lg">
                Send Message
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Container>
  );
}
