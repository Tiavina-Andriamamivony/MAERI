import AnotherNav from "@/components/anotherNav";
import { Footer } from "@/components/brand/footer";

export default function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <AnotherNav />
      <main className="pt-20 md:pt-24">{children}</main>
      <Footer />
    </>
  );
}
