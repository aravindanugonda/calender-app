
import { auth0 } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DashboardWrapper } from "@/components/layout/DashboardWrapper";

export default async function DashboardPage() {
  const session = await auth0.getSession();
  
  if (!session) {
    redirect("/auth/login");
  }

  return <DashboardWrapper />;
}
