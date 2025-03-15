import type { Metadata } from "next"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { ProfileForm } from "@/components/profile/profile-form"
import { AccountSwitcher } from "@/components/profile/account-switcher"

export const metadata: Metadata = {
  title: "Profile - SmartWise",
  description: "Manage your profile settings",
}

export default function ProfilePage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Profile" text="Manage your profile settings and accounts." />
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <ProfileForm />
        </div>
        <div>
          <AccountSwitcher />
        </div>
      </div>
    </DashboardShell>
  )
}

