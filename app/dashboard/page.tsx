"use client"

import ESGDashboard from "@/features/dashboard/esg-dashboard"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const router = useRouter()

  return <ESGDashboard onLogout={() => router.push("/")} />
}
