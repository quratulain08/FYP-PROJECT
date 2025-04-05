"use client"

import type React from "react"
import  Navbar from "./navbar/page"

interface SuperAdminLayoutProps {
  children: React.ReactNode
}

const SuperAdminLayout: React.FC<SuperAdminLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="pt-4">{children}</main>
    </div>
  )
}

export default SuperAdminLayout

