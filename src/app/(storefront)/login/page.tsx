import { AccountAuth } from "@/components/auth/account-auth";
import { Container } from "@/components/layout/container";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  let callbackUrl = typeof params.callbackUrl === "string" ? params.callbackUrl : "/account";

  // Security requirement: Only allow safe internal relative URLs.
  if (!callbackUrl.startsWith("/") || callbackUrl.startsWith("//")) {
    callbackUrl = "/account";
  }

  return (
    <Container className="py-16 sm:py-24">
      <div className="mx-auto max-w-md p-6 sm:p-10 border border-border">
        <AccountAuth callbackUrl={callbackUrl} />
      </div>
    </Container>
  );
}
