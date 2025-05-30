"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Building2,
  //  Briefcase, LogOut, User, Users,
    Home } from "lucide-react"

const navbar = () => {
  const pathname = usePathname()
  const router = useRouter()
  const [activeButton, setActiveButton] = useState<string>("")

  useEffect(() => {
    if (pathname?.startsWith("/superAdminPortal/makeAdmin")) {
      setActiveButton("makeAdmin")
    } else if (pathname?.startsWith("/superAdminPortal/makeIndustry")) {
      setActiveButton("industry")
    } else if (
      pathname?.startsWith("/superAdminPortal/internshipdisplay") ||
      pathname?.startsWith("/superAdminPortal/internships") ||
      pathname?.startsWith("/superAdminPortal/createinternship")
    ) {
      setActiveButton("internship")
    } else if (pathname?.startsWith("/superAdminPortal/students")) {
      setActiveButton("students")
    } else if (pathname?.startsWith("/superAdminPortal/faculty")) {
      setActiveButton("faculty")
    }
  }, [pathname])
  

 

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
         
        </div>
      </nav>

      {/* Main Navigation */}
      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto">
          <div className="flex overflow-x-auto hide-scrollbar">
          <button
  onClick={() => handleNavigation("/superAdminPortal/makeAdmin", "makeAdmin")}
  className={`flex items-center px-4 py-3 ${
    activeButton === "makeAdmin"
      ? "border-b-2 border-green-600 text-green-600"
      : "text-gray-600 hover:text-green-600 hover:border-b-2 hover:border-green-200"
  }`}
>
  <Home className="h-5 w-5 mr-2" />
  <span>MakeAdmin</span>
</button>

<button
  onClick={() => handleNavigation("/superAdminPortal/makeIndustry", "industry")}
  className={`flex items-center px-4 py-3 ${
    activeButton === "industry"
      ? "border-b-2 border-green-600 text-green-600"
      : "text-gray-600 hover:text-green-600 hover:border-b-2 hover:border-green-200"
  }`}
>
  <Building2 className="h-5 w-5 mr-2" />
  <span>MakeIndustry</span>
</button>
{/* 
            <button
              onClick={() => handleNavigation("/Superadmin/Industry", "industry")}
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
            </button> */}
          </div>
        </div>
      </nav>
    </div>
  )
}

export default navbar

