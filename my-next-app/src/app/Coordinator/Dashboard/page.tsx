"use client"

import React from "react"
import { useRouter } from "next/navigation"
import StudentDashboard from "../../components/Dashboard"
import CoordinatorLayout from "../CoordinatorLayout";

const DashboardPage = () => {
  const router = useRouter()

  return (
   <CoordinatorLayout>
      <StudentDashboard />
      </CoordinatorLayout>
  )
}

export default DashboardPage
