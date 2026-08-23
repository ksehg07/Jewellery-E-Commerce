"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function CheckoutForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsSubmitting(true);

    // Temporary frontend-only checkout.
    // Payment integration will be added later.
    setTimeout(() => {
      setIsSubmitting(false);
    }, 1000);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-10"
    >
      {/* Contact Information */}
      <section>
        <h2 className="font-display text-2xl">
          Contact Information
        </h2>

        <div className="mt-6 grid gap-4">
          <Input
            type="email"
            name="email"
            placeholder="Email address"
            required
          />

          <Input
            type="tel"
            name="phone"
            placeholder="Phone number"
            required
          />
        </div>
      </section>

      {/* Shipping Address */}
      <section>
        <h2 className="font-display text-2xl">
          Shipping Address
        </h2>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Input
            name="firstName"
            placeholder="First name"
            required
          />

          <Input
            name="lastName"
            placeholder="Last name"
            required
          />

          <div className="sm:col-span-2">
            <Input
              name="addressLine1"
              placeholder="Address"
              required
            />
          </div>

          <div className="sm:col-span-2">
            <Input
              name="addressLine2"
              placeholder="Apartment, suite, etc. (optional)"
            />
          </div>

          <Input
            name="city"
            placeholder="City"
            required
          />

          <Input
            name="state"
            placeholder="State"
            required
          />

          <Input
            name="postalCode"
            placeholder="PIN code"
            required
          />

          <Input
            name="country"
            placeholder="Country"
            defaultValue="India"
            required
          />
        </div>
      </section>

      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting
          ? "Processing..."
          : "Proceed to Payment"}
      </Button>
    </form>
  );
}