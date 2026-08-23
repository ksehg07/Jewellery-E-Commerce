import type { ReactNode } from "react";

import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";

export default function StorefrontLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <AnnouncementBar />
      <Header />

      <main>{children}</main>

      <Footer />
    </>
  );
}