"use client"

import type React from "react"
import Image from 'next/image';

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { LogOut, User, Home, Building, BookOpen, Users, FileText, Briefcase, ChevronDown } from "lucide-react"

const AdminNavbar = ({ children }: { children: React.ReactNode }) => {
  const [email, setEmail] = useState<string | null>(null)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const storedEmail = localStorage.getItem("email")
    setEmail(storedEmail)
  }, [])

  const handleLogout = () => {
    localStorage.clear()
    setTimeout(() => {
      window.location.href = "/Login"
    }, 0)
  }

  const isActive = (path: string) => {
    return pathname?.startsWith(path)
  }

  return (
    <div>
      {/* Top Navbar */}
      <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-2 flex justify-between items-center">
          <div className="flex items-center">
<Image
  src="/air-university-logo-1.png"
  alt="Air University Logo"
  width={48}
  height={48}
  className="h-12 mr-3"
/>            <h1
              className="text-lg md:text-xl text-gray-800 font-medium"
              style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
            >
              Air University, Islamabad
            </h1>
          </div>
          <div className="flex items-center">
            <div className="hidden md:flex items-center mr-4 bg-gray-100 px-3 py-1.5 rounded-full">
              <User className="text-gray-600 mr-2 h-4 w-4" />
              <span className="text-gray-700 font-medium" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
                {email ?? "Guest"} <span className="text-green-600">(Administrator)</span>
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center text-white bg-green-600 hover:bg-green-700 px-3 py-1.5 rounded-md transition duration-150"
              style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
            >
              <LogOut className="mr-1 h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Navigation */}
      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto">
          <div className="flex overflow-x-auto hide-scrollbar">
            <button
              onClick={() => router.push("/admin/dashboard")}
              className={`flex items-center px-4 py-3 ${
                isActive("/admin/dashboard")
                  ? "border-b-2 border-green-600 text-green-600"
                  : "text-gray-600 hover:text-green-600 hover:border-b-2 hover:border-green-200"
              }`}
              style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
            >
              <Home className="h-5 w-5 mr-2" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => router.push("/admin/profile")}
              className={`flex items-center px-4 py-3 ${
                isActive("/admin/profile")
                  ? "border-b-2 border-green-600 text-green-600"
                  : "text-gray-600 hover:text-green-600 hover:border-b-2 hover:border-green-200"
              }`}
              style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
            >
              <User className="h-5 w-5 mr-2" />
              <span>Your Profile</span>
            </button>

            <button
              onClick={() => router.push("/admin/InstituteProfile")}
              className={`flex items-center px-4 py-3 ${
                isActive("/admin/InstituteProfile")
                  ? "border-b-2 border-green-600 text-green-600"
                  : "text-gray-600 hover:text-green-600 hover:border-b-2 hover:border-green-200"
              }`}
              style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
            >
              <Building className="h-5 w-5 mr-2" />
              <span>Institute Profile</span>
            </button>

            <button
              onClick={() => router.push("/admin/Department")}
              className={`flex items-center px-4 py-3 ${
                isActive("/admin/Department")
                  ? "border-b-2 border-green-600 text-green-600"
                  : "text-gray-600 hover:text-green-600 hover:border-b-2 hover:border-green-200"
              }`}
              style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
            >
              <FileText className="h-5 w-5 mr-2" />
              <span>Departments & Programs</span>
              <ChevronDown className="h-4 w-4 ml-1" />
            </button>

            <button
              onClick={() => router.push("/admin/Faculty")}
              className={`flex items-center px-4 py-3 ${
                isActive("/admin/Faculty")
                  ? "border-b-2 border-green-600 text-green-600"
                  : "text-gray-600 hover:text-green-600 hover:border-b-2 hover:border-green-200"
              }`}
              style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
            >
              <BookOpen className="h-5 w-5 mr-2" />
              <span>Faculty Directory</span>
            </button>

            <button
              onClick={() => router.push("/admin/student")}
              className={`flex items-center px-4 py-3 ${
                isActive("/admin/student")
                  ? "border-b-2 border-green-600 text-green-600"
                  : "text-gray-600 hover:text-green-600 hover:border-b-2 hover:border-green-200"
              }`}
              style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
            >
              <Users className="h-5 w-5 mr-2" />
              <span>Students Directory</span>
              <ChevronDown className="h-4 w-4 ml-1" />
            </button>

            <button
              onClick={() => router.push("/admin/Announcements")}
              className={`flex items-center px-4 py-3 ${
                isActive("/admin/internships")
                  ? "border-b-2 border-green-600 text-green-600"
                  : "text-gray-600 hover:text-green-600 hover:border-b-2 hover:border-green-200"
              }`}
              style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
            >
              <Briefcase className="h-5 w-5 mr-2" />
              <span>Annoucements</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>{children}</main>
    </div>
  )
}

export default AdminNavbar

