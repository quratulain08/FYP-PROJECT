"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { FaUniversity, FaUser, FaChalkboardTeacher, FaUsers, FaSignOutAlt } from "react-icons/fa"

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
      path: "/Coordinator/Internships",
      label: "Internships",
      icon: <FaUniversity className="text-gray-700" />,
    },
    {
      path: "/Coordinator/Profile",
      label: "Profile",
      icon: <FaUser className="text-gray-700" />,
    },
    {
      path: "/Coordinator/Faculty",
      label: "Faculty Directory",
      icon: <FaChalkboardTeacher className="text-gray-700" />,
    },
    {
      path: "/Coordinator/student",
      label: "Students Directory",
      icon: <FaUsers className="text-gray-700" />,
    },
  ]

  return (
    <div className="sticky top-0 z-50">
      {/* Top Navbar */}
      <nav className="bg-white border-b border-gray-300 shadow-sm">
        <div className="container mx-auto px-4 py-2 flex justify-between items-center">
          <div className="flex items-center">
            <img src="/nceac-logo.jpg" alt="NCAA Logo" className="h-12 mr-3" />
            <h1 className="text-lg md:text-xl text-gray-700 font-normal">Air University, Islamabad</h1>
          </div>
          <div className="flex items-center">
            <div className="hidden md:flex items-center mr-4 bg-gray-100 px-3 py-1.5 rounded-full">
              <FaUser className="text-green-600 mr-2" />
              <span className="text-gray-700">{email ?? "Guest"}</span>
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
      <nav className="bg-white border-b border-gray-300 shadow-sm">
        <div className="container mx-auto px-2 py-1">
          <div className="flex justify-between items-center overflow-x-auto hide-scrollbar">
            <div className="flex space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex flex-col items-center px-3 py-2 rounded transition-all duration-200 ${
                    pathname === item.path
                      ? "bg-green-500 text-white"
                      : "text-gray-700 hover:bg-green-500 hover:text-white"
                  }`}
                >
                  <span className="text-2xl mb-2">{item.icon}</span>
                  <span className="text-sm">{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>
    </div>
  )
}

export default Navbar

