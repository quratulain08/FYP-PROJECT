"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Building2, Briefcase, LogOut, User, BarChart3, Users, Home, FileText } from "lucide-react"

const IndustryNavbar = () => {
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
    <div className="sticky top-0 z-50">
      {/* Top Navbar */}
      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-2 flex justify-between items-center">
          <div className="flex items-center">
            <img src="/air-university-logo-1.png" alt="Air University Logo" className="h-12 mr-3" />
            <h1
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
                {email ?? "Guest"} <span className="text-green-600">(Industry)</span>
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
              onClick={() => router.push("/Industry/university")}
              className={`flex items-center px-4 py-3 ${
                isActive("/Industry/university")
                  ? "border-b-2 border-green-600 text-green-600"
                  : "text-gray-600 hover:text-green-600 hover:border-b-2 hover:border-green-200"
              }`}
              style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
            >
              <Building2 className="h-5 w-5 mr-2" />
              <span>Universities</span>
            </button>

            <button
              onClick={() => router.push("/Industry/internshipdisplay")}
              className={`flex items-center px-4 py-3 ${
                isActive("/Industry/internshipdisplay") ||
                isActive("/Industry/internships") ||
                isActive("/Industry/createinternship")
                  ? "border-b-2 border-green-600 text-green-600"
                  : "text-gray-600 hover:text-green-600 hover:border-b-2 hover:border-green-200"
              }`}
              style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
            >
              <Briefcase className="h-5 w-5 mr-2" />
              <span>Internships</span>
            </button>

    
          </div>
        </div>
      </nav>
    </div>
  )
}

export default IndustryNavbar

