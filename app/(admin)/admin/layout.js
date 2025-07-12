// no "use client"
import { Breadcrumbs } from "@/components/breadcrumb";
import { AppSidebar } from "./components/adminSidebar";
import { notFound } from "next/navigation";
import { getAdmin } from "@/actions/admin";

export default async function Layout({ children }) {
  const admin = await getAdmin();

  if (!admin.authorized) {
    return notFound();
  }

  return (
    <div className="pt-15">
      <div className="lg:w-55 fixed bg-white lg:z-50 z-100">
        <AppSidebar />
      </div>
      <main className="lg:pl-55 pt-8 sm:mx-4">
        <Breadcrumbs /> {/* new Client Component */}
        <div className="sm:px-4 px-2 py-4 mt-2">{children}</div>
      </main>
    </div>
  );
}
