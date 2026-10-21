import { notFound } from "next/navigation";
import AdminWorkspace from "../../../components/admin/AdminWorkspace";

const sections = ["products", "inventory", "orders", "customers", "categories", "reports", "content", "campaigns", "settings"] as const;
type Section = (typeof sections)[number];

export function generateStaticParams() {
  return sections.map((section) => ({ section }));
}

export default async function AdminSectionPage({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  if (!sections.includes(section as Section)) notFound();
  return <AdminWorkspace section={section as Section} />;
}
