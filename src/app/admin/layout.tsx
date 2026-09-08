import { AppSidebar } from "@/components/app-sidebar";
import { FloatingSidebarToggle } from "@/components/floating-sidebar-toggle";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider
      style={
        {
          "--header-height": "3.5rem",
        } as React.CSSProperties
      }
    >
      <AppSidebar />
      <FloatingSidebarToggle />
      <SidebarInset>
        <SiteHeader />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
