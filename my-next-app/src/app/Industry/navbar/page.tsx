"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Building2, Briefcase, LogOut, User, ChevronDown } from "lucide-react"

const IndustryNavbar = () => {
  const [email, setEmail] = useState<string | null>(null)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const pathname = usePathname()

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

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }

  const isActive = (path: string) => {
    return pathname === path
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
                {email ?? "Guest"}
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
        <div className="container mx-auto px-4 py-1">
          <div className="flex justify-between items-center overflow-x-auto hide-scrollbar">
            <div className="flex space-x-4">
              <Link
                href="/Industry/university"
                className={`flex flex-col items-center px-4 py-2 rounded-md transition-all duration-200 ${
                  isActive("/Industry/university")
                    ? "bg-green-500 text-white"
                    : "text-gray-700 hover:bg-green-50 hover:text-green-600"
                }`}
              >
                <Building2
                  className={`h-5 w-5 mb-1 ${isActive("/Industry/university") ? "text-white" : "text-green-600"}`}
                />
                <span
                  className="text-xs font-medium whitespace-nowrap"
                  style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                >
                  Universities
                </span>
              </Link>

              <div className="relative group">
                <Link
                  href="/Industry/internshipdisplay"
                  className={`flex flex-col items-center px-4 py-2 rounded-md transition-all duration-200 ${
                    isActive("/Industry/internshipdisplay")
                      ? "bg-green-500 text-white"
                      : "text-gray-700 hover:bg-green-50 hover:text-green-600"
                  }`}
                  onClick={(e) => {
                    if (isDropdownOpen) {
                      e.preventDefault()
                      toggleDropdown()
                    }
                  }}
                >
                  <Briefcase
                    className={`h-5 w-5 mb-1 ${isActive("/Industry/internshipdisplay") ? "text-white" : "text-gray-700"}`}
                  />
                  <div className="flex items-center">
                    <span
                      className="text-xs font-medium whitespace-nowrap"
                      style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                    >
                      Internships
                    </span>
                    <ChevronDown
                      className={`h-3 w-3 ml-1 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        toggleDropdown()
                      }}
                    />
                  </div>
                </Link>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute left-0 mt-1 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
                    <Link
                      href="/Industry/internshipdisplay"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600"
                      style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                    >
                      View Internships
                    </Link>
                    <Link
                      href="/Industry/createinternship"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600"
                      style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                    >
                      Create Internship
                    </Link>
                    <Link
                      href="/Industry/manageapplications"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600"
                      style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                    >
                      Manage Applications
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  )
}

export default IndustryNavbar

