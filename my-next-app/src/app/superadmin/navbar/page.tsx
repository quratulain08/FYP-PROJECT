"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Building2, Briefcase, LogOut, User, Users, Home } from "lucide-react"

const navbar = () => {
  const [email, setEmail] = useState<string | null>(null)
  const pathname = usePathname()
  const router = useRouter()
  const [activeButton, setActiveButton] = useState<string>("")

  useEffect(() => {
    const storedEmail = localStorage.getItem("email")
    setEmail(storedEmail)

    // Set initial active button based on current path
    if (pathname?.startsWith("/superadmin/home")) {
      setActiveButton("home")
    } else if (pathname?.startsWith("/superadmin/university")) {
      setActiveButton("universities")
    } else if (
      pathname?.startsWith("/Industry/internshipdisplay") ||
      pathname?.startsWith("/Industry/internships") ||
      pathname?.startsWith("/Industry/createinternship")
    ) {
      setActiveButton("industry")
    } else if (pathname?.startsWith("/superadmin/students")) {
      setActiveButton("students")
    } else if (pathname?.startsWith("/superadmin/faculty")) {
      setActiveButton("faculty")
    }
  }, [pathname])

  const handleLogout = () => {
    localStorage.clear()
    setTimeout(() => {
      window.location.href = "/Login"
    }, 0)
  }

  const handleNavigation = (path: string, buttonId: string) => {
    setActiveButton(buttonId)
    router.push(path)
  }

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
              <User className="text-gray-600 mr-2 h-4 w-4" />
              <span className="text-gray-700 font-medium">
                {email ?? "Guest"} <span className="text-green-600">(Superadmin)</span>
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center text-white bg-green-600 hover:bg-green-700 px-3 py-1.5 rounded-md transition duration-150"
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
              onClick={() => handleNavigation("/superadmin/home", "home")}
              className={`flex items-center px-4 py-3 ${
                activeButton === "home"
                  ? "border-b-2 border-green-600 text-green-600"
                  : "text-gray-600 hover:text-green-600 hover:border-b-2 hover:border-green-200"
              }`}
            >
              <Home className="h-5 w-5 mr-2" />
              <span>Home</span>
            </button>

            <button
              onClick={() => handleNavigation("/superadmin/university", "universities")}
              className={`flex items-center px-4 py-3 ${
                activeButton === "universities"
                  ? "border-b-2 border-green-600 text-green-600"
                  : "text-gray-600 hover:text-green-600 hover:border-b-2 hover:border-green-200"
              }`}
            >
              <Building2 className="h-5 w-5 mr-2" />
              <span>Universities</span>
            </button>

            <button
              onClick={() => handleNavigation("/Industry/internshipdisplay", "industry")}
              className={`flex items-center px-4 py-3 ${
                activeButton === "industry"
                  ? "border-b-2 border-green-600 text-green-600"
                  : "text-gray-600 hover:text-green-600 hover:border-b-2 hover:border-green-200"
              }`}
            >
              <Briefcase className="h-5 w-5 mr-2" />
              <span>Industry</span>
            </button>

            <button
              onClick={() => handleNavigation("/superadmin/students", "students")}
              className={`flex items-center px-4 py-3 ${
                activeButton === "students"
                  ? "border-b-2 border-green-600 text-green-600"
                  : "text-gray-600 hover:text-green-600 hover:border-b-2 hover:border-green-200"
              }`}
            >
              <Users className="h-5 w-5 mr-2" />
              <span>Student</span>
            </button>

            <button
              onClick={() => handleNavigation("/superadmin/faculty", "faculty")}
              className={`flex items-center px-4 py-3 ${
                activeButton === "faculty"
                  ? "border-b-2 border-green-600 text-green-600"
                  : "text-gray-600 hover:text-green-600 hover:border-b-2 hover:border-green-200"
              }`}
            >
              <Users className="h-5 w-5 mr-2" />
              <span>Faculty</span>
            </button>
          </div>
        </div>
      </nav>
    </div>
  )
}

export default navbar

