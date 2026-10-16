import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { RoleViewRouter } from "@/components/dashboard/RoleViewRouter";
import { RoleId } from "@/components/dashboard/types";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      {
        title: "Workspace & Role Dashboards | Namutek Logistics Limited",
      },
      {
        name: "description",
        content:
          "Unified multi-role industrial logistics dashboard system for Namutek Logistics: Super Admin, Managing Director, Quotation Officer, Sales, Dispatch, Projects, Fleet, Finance, Field Staff & Customer Portal.",
      },
    ],
  }),
  component: AdminWorkspacePage,
});

export function AdminWorkspacePage() {
  const [currentRole, setCurrentRole] = useState<RoleId>("managing_director");
  const [activeNav, setActiveNav] = useState<string>("Overview");

  return (
    <DashboardShell
      currentRole={currentRole}
      onRoleChange={setCurrentRole}
      activeNav={activeNav}
      onNavChange={setActiveNav}
    >
      <RoleViewRouter currentRole={currentRole} activeNav={activeNav} />
    </DashboardShell>
  );
}
