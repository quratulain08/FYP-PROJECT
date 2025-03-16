"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  FaHome,
  FaUniversity,
  FaFolder,
  FaUsers,
  FaChalkboardTeacher,
  FaUser,
  FaSignOutAlt,
} from "react-icons/fa"

const Navbar: React.FC = () => {
  const [email, setEmail] = useState<string | null>(null)
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

  const navItems = [
    {
      path: "/admin/dashboard",
      label: "Dashboard",
      icon: <FaHome className="text-gray-700" />,
    },
    {
      path: "/admin/profile",
      label: "Your Profile",
      icon: <FaUser className="text-gray-700" />,
    },
    {
      path: "/admin/InstituteProfile",
      label: "Institute Profile",
      icon: <FaUniversity className="text-gray-700" />,
    },
    {
      path: "/admin/Department",
      label: "Departments & Programs",
      icon: <FaFolder className="text-gray-700" />,
    },
    {
      path: "/admin/Faculty",
      label: "Faculty Directory",
      icon: <FaChalkboardTeacher className="text-gray-700" />,
    },
    {
      path: "/admin/student",
      label: "Students Directory",
      icon: <FaUsers className="text-gray-700" />,
    },
  ]

  return (
    <div className="sticky top-0 z-50">
      {/* Top Navbar */}
      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-2 flex justify-between items-center">
          <div className="flex items-center">
            <img src="/air-university-logo-1.png" alt="Air University Logo" className="h-12 mr-3" />
            <h1 className="text-lg md:text-xl text-gray-800 font-medium">Air University, Islamabad</h1>
          </div>
          <div className="flex items-center">
            <div className="hidden md:flex items-center mr-4 bg-gray-100 px-3 py-1.5 rounded-full">
              <FaUser className="text-green-600 mr-2" />
              <span className="text-gray-700 font-medium">{email ?? "Guest"}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center text-white bg-green-600 hover:bg-green-700 px-3 py-1.5 rounded-md transition duration-150"
            >
              <FaSignOutAlt className="mr-1" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Navigation */}
      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-1">
          <div className="flex justify-between items-center overflow-x-auto hide-scrollbar">
            <div className="flex space-x-1 md:space-x-4">
              {navItems.map((item) => (
                <div key={item.path} className="relative group">
                  <Link
                    href={item.path}
                    className={`flex flex-col items-center px-3 py-2 rounded-md transition-all duration-200 ${
                      pathname === item.path
                        ? "bg-green-500 text-white"
                        : "text-gray-700 hover:bg-green-50 hover:text-green-600"
                    }`}
                  >
                    <span className="text-2xl mb-1">{item.icon}</span>
                    <span className="text-xs font-medium whitespace-nowrap">{item.label}</span>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </nav>
    </div>
  )
}

export default Navbar
