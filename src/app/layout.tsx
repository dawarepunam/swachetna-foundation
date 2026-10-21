import type { Metadata } from "next";
import StoreShell from "../components/layout/StoreShell";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Swachetna Foundation-Work to create a difference", template: "%s | Swachetna Foundation" },
  description: "Swachetna Foundation works with communities in Pune and Maharashtra across education, healthcare, food security and self-reliance.",
  icons: {
    icon: "/images/swachetna-purple.webp",
    shortcut: "/images/swachetna-purple.webp",
    apple: "/images/swachetna-purple.webp",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en"><body><StoreShell>{children}</StoreShell></body></html>
  );
}
