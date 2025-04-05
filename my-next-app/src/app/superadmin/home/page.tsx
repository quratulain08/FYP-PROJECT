"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import SuperAdminLayout from "../SuperAdminLayout"
import {
  Briefcase,
  BookOpen,
  Building2,
  Users,
  CheckCircle,
  Keyboard,
  BarChart3,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  ChevronRight,
  Github,
  Twitter,
  Linkedin,
  Facebook,
} from "lucide-react"

export default function HomePage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    // Simulate form submission
    setTimeout(() => {
      setSubmitting(false)
      setSubmitted(true)
      setEmail("")
      setMessage("")

      // Reset submission state after showing success message
      setTimeout(() => {
        setSubmitted(false)
      }, 3000)
    }, 1500)
  }

  return (
    <SuperAdminLayout>
  
    <div className="min-h-screen bg-gray-50">
      {/* Header/Navbar */}
      {/* <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <img src="/air-university-logo-1.png" alt="Air University Logo" className="h-12 mr-3" />
            <h1
              className="text-xl md:text-2xl font-semibold text-gray-800"
              style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
            >
              Air University <span className="hidden md:inline">Internship Portal</span>
            </h1>
          </div>
          <div className="space-x-2 md:space-x-4">
            <button
              onClick={() => router.push("/Login")}
              className="px-4 py-2 text-teal-600 font-medium rounded-md hover:bg-teal-50 transition-colors"
              style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
            >
              Login
            </button>
            <button
              onClick={() => router.push("/Register")}
              className="px-4 py-2 bg-teal-600 text-white font-medium rounded-md hover:bg-teal-700 transition-colors"
              style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
            >
              Register
            </button>
          </div>
        </div>
      </header> */}

      {/* Hero Section */}
      <section className="pt-20 pb-32 bg-gradient-to-br from-teal-700 via-teal-600 to-emerald-500 text-white relative overflow-hidden">
        {/* Background pattern */}
        {/* <div className="absolute inset-0 opacity-10">
          <img
            src="/placeholder.svg?height=800&width=1600"
            alt="Background Pattern"
            className="w-full h-full object-cover"
          />
        </div> */}

        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1
                className="text-4xl md:text-5xl font-bold mb-6 leading-tight"
                style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
              >
                Connecting Students with Industry Opportunities
              </h1>
              <p className="text-xl mb-8 text-gray-100" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
                A comprehensive platform for managing internships, connecting students with industry partners, and
                facilitating academic supervision.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => router.push("/Register")}
                  className="px-6 py-3 bg-white text-teal-700 font-medium rounded-md hover:bg-gray-100 transition-colors shadow-lg"
                  style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                >
                  Register
                </button>
                <button
                  onClick={() => {
                    // // const contactSection = document.getElementById("contact")
                    // contactSection?.scrollIntoView({ behavior: "smooth" })
                  }}
                  className="px-6 py-3 bg-transparent border border-white text-white font-medium rounded-md hover:bg-white/10 transition-colors"
                  style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                >
                  Login
                </button>
              </div>
            </div>
            <div className="hidden md:block">
              <img
                src="/internship.png"
                alt="Internship Management"
                className="rounded-lg shadow-xl transform hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
        </div>
      </section>

      {/* About the Platform */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <h2
              className="text-3xl font-bold text-gray-800 mb-4"
              style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
            >
              What is the Internship Portal?
            </h2>
            <p
              className="text-lg text-gray-600 max-w-3xl mx-auto"
              style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
            >
              Air University's Internship Portal is a comprehensive platform designed to streamline the entire
              internship process, from posting opportunities to final evaluations.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gray-50 p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow transform hover:translate-y-[-5px] duration-300">
              <div className="bg-teal-100 p-3 w-14 h-14 rounded-lg flex items-center justify-center mb-6">
                <Briefcase className="h-8 w-8 text-teal-600" />
              </div>
              <h3
                className="text-xl font-semibold text-gray-800 mb-3"
                style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
              >
                Internship Management
              </h3>
              <p className="text-gray-600" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
                Post, manage, and track internship opportunities across multiple universities and departments.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gray-50 p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow transform hover:translate-y-[-5px] duration-300">
              <div className="bg-teal-100 p-3 w-14 h-14 rounded-lg flex items-center justify-center mb-6">
                <Building2 className="h-8 w-8 text-teal-600" />
              </div>
              <h3
                className="text-xl font-semibold text-gray-800 mb-3"
                style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
              >
                Industry Partnerships
              </h3>
              <p className="text-gray-600" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
                Connect with universities, post internship opportunities, and manage student applications.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gray-50 p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow transform hover:translate-y-[-5px] duration-300">
              <div className="bg-teal-100 p-3 w-14 h-14 rounded-lg flex items-center justify-center mb-6">
                <Users className="h-8 w-8 text-teal-600" />
              </div>
              <h3
                className="text-xl font-semibold text-gray-800 mb-3"
                style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
              >
                Student Tracking
              </h3>
              <p className="text-gray-600" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
                Monitor student progress, assignments, and completion rates across departments and batches.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-gray-50 p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow transform hover:translate-y-[-5px] duration-300">
              <div className="bg-teal-100 p-3 w-14 h-14 rounded-lg flex items-center justify-center mb-6">
                <BookOpen className="h-8 w-8 text-teal-600" />
              </div>
              <h3
                className="text-xl font-semibold text-gray-800 mb-3"
                style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
              >
                Faculty Supervision
              </h3>
              <p className="text-gray-600" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
                Enable faculty members to oversee internships, assign tasks, and grade student performance.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-gray-50 p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow transform hover:translate-y-[-5px] duration-300">
              <div className="bg-teal-100 p-3 w-14 h-14 rounded-lg flex items-center justify-center mb-6">
                <CheckCircle className="h-8 w-8 text-teal-600" />
              </div>
              <h3
                className="text-xl font-semibold text-gray-800 mb-3"
                style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
              >
                Task Management
              </h3>
              <p className="text-gray-600" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
                Create, assign, and grade tasks to track student progress and performance during internships.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-gray-50 p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow transform hover:translate-y-[-5px] duration-300">
              <div className="bg-teal-100 p-3 w-14 h-14 rounded-lg flex items-center justify-center mb-6">
                <BarChart3 className="h-8 w-8 text-teal-600" />
              </div>
              <h3
                className="text-xl font-semibold text-gray-800 mb-3"
                style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
              >
                Reporting & Analytics
              </h3>
              <p className="text-gray-600" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
                Generate comprehensive reports and analytics to track internship performance and outcomes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Image Showcase */}
      {/* <section className="py-16 bg-gradient-to-r from-gray-100 to-gray-200">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <img
              src="/placeholder.svg?height=300&width=300"
              alt="Students at internship"
              className="rounded-lg shadow-md hover:shadow-lg transition-shadow h-40 md:h-64 w-full object-cover"
            />
            <img
              src="/placeholder.svg?height=300&width=300"
              alt="Industry workplace"
              className="rounded-lg shadow-md hover:shadow-lg transition-shadow h-40 md:h-64 w-full object-cover"
            />
            <img
              src="/placeholder.svg?height=300&width=300"
              alt="Faculty mentoring"
              className="rounded-lg shadow-md hover:shadow-lg transition-shadow h-40 md:h-64 w-full object-cover"
            />
            <img
              src="/placeholder.svg?height=300&width=300"
              alt="University campus"
              className="rounded-lg shadow-md hover:shadow-lg transition-shadow h-40 md:h-64 w-full object-cover"
            />
          </div>
        </div>
      </section> */}

      {/* User Roles with Image */}
      <section className="py-20 bg-white relative">
        <div className="absolute right-0 top-0 h-full w-1/3 opacity-5 hidden lg:block">
          <img src="/placeholder.svg?height=800&width=600" alt="Background Pattern" className="h-full object-cover" />
        </div>

        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2
              className="text-3xl font-bold text-gray-800 mb-4"
              style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
            >
              Who Uses Our Platform?
            </h2>
            <p
              className="text-lg text-gray-600 max-w-3xl mx-auto"
              style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
            >
              Our platform serves multiple stakeholders in the internship process, providing tailored experiences for
              each role.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Role 1 */}
            <div className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mr-4">
                  <Building2 className="h-6 w-6 text-teal-600" />
                </div>
                <h3
                  className="text-xl font-semibold text-gray-800"
                  style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                >
                  Industry Partners
                </h3>
              </div>
              <p className="text-gray-600 mb-4" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
                Post internship opportunities, manage applications, assign tasks, and evaluate student performance.
              </p>
              <a
                href="#"
                className="inline-flex items-center text-teal-600 hover:text-teal-800"
                style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
              >
                <span>Learn More</span>
                <ChevronRight className="h-4 w-4 ml-1" />
              </a>
            </div>

            {/* Role 2 */}
            <div className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mr-4">
                  <Users className="h-6 w-6 text-teal-600" />
                </div>
                <h3
                  className="text-xl font-semibold text-gray-800"
                  style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                >
                  Students
                </h3>
              </div>
              <p className="text-gray-600 mb-4" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
                Browse internship opportunities, submit applications, complete assigned tasks, and track progress.
              </p>
              <a
                href="#"
                className="inline-flex items-center text-teal-600 hover:text-teal-800"
                style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
              >
                <span>Learn More</span>
                <ChevronRight className="h-4 w-4 ml-1" />
              </a>
            </div>

            {/* Role 3 */}
            <div className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mr-4">
                  <BookOpen className="h-6 w-6 text-teal-600" />
                </div>
                <h3
                  className="text-xl font-semibold text-gray-800"
                  style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                >
                  Faculty Supervisors
                </h3>
              </div>
              <p className="text-gray-600 mb-4" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
                Monitor internships, create and grade tasks, and provide academic oversight for student internships.
              </p>
              <a
                href="#"
                className="inline-flex items-center text-teal-600 hover:text-teal-800"
                style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
              >
                <span>Learn More</span>
                <ChevronRight className="h-4 w-4 ml-1" />
              </a>
            </div>

            {/* Role 4 */}
            <div className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mr-4">
                  <Users className="h-6 w-6 text-teal-600" />
                </div>
                <h3
                  className="text-xl font-semibold text-gray-800"
                  style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                >
                  Focal Persons
                </h3>
              </div>
              <p className="text-gray-600 mb-4" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
                Department representatives who manage student-internship assignments and faculty allocation.
              </p>
              <a
                href="#"
                className="inline-flex items-center text-teal-600 hover:text-teal-800"
                style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
              >
                <span>Learn More</span>
                <ChevronRight className="h-4 w-4 ml-1" />
              </a>
            </div>

            {/* Role 5 */}
            <div className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mr-4">
                  <Keyboard className="h-6 w-6 text-teal-600" />
                </div>
                <h3
                  className="text-xl font-semibold text-gray-800"
                  style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                >
                  Coordinators
                </h3>
              </div>
              <p className="text-gray-600 mb-4" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
                University administrators who oversee departments, batches, and overall internship programs.
              </p>
              <a
                href="#"
                className="inline-flex items-center text-teal-600 hover:text-teal-800"
                style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
              >
                <span>Learn More</span>
                <ChevronRight className="h-4 w-4 ml-1" />
              </a>
            </div>

            {/* Role 6 */}
            <div className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mr-4">
                  <Building2 className="h-6 w-6 text-teal-600" />
                </div>
                <h3
                  className="text-xl font-semibold text-gray-800"
                  style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                >
                  Enterprise Cell
                </h3>
              </div>
              <p className="text-gray-600 mb-4" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
                Manage and approve internship listings, ensuring quality standards and appropriate placements.
              </p>
              <a
                href="#"
                className="inline-flex items-center text-teal-600 hover:text-teal-800"
                style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
              >
                <span>Learn More</span>
                <ChevronRight className="h-4 w-4 ml-1" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-20 bg-gradient-to-r from-slate-800 to-slate-900 text-white relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <img
            src="/placeholder.svg?height=600&width=1600"
            alt="Background Pattern"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
              Our Impact
            </h2>
            <p
              className="text-lg text-gray-300 max-w-3xl mx-auto"
              style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
            >
              The Internship Portal has helped connect students with meaningful industry experiences.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center bg-white/10 backdrop-blur-sm p-6 rounded-lg">
              <div
                className="text-4xl md:text-5xl font-bold mb-2 text-teal-300"
                style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
              >
                500+
              </div>
              <div className="text-gray-300" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
                Internships Posted
              </div>
            </div>
            <div className="text-center bg-white/10 backdrop-blur-sm p-6 rounded-lg">
              <div
                className="text-4xl md:text-5xl font-bold mb-2 text-teal-300"
                style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
              >
                50+
              </div>
              <div className="text-gray-300" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
                Industry Partners
              </div>
            </div>
            <div className="text-center bg-white/10 backdrop-blur-sm p-6 rounded-lg">
              <div
                className="text-4xl md:text-5xl font-bold mb-2 text-teal-300"
                style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
              >
                1000+
              </div>
              <div className="text-gray-300" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
                Students Placed
              </div>
            </div>
            <div className="text-center bg-white/10 backdrop-blur-sm p-6 rounded-lg">
              <div
                className="text-4xl md:text-5xl font-bold mb-2 text-teal-300"
                style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
              >
                15+
              </div>
              <div className="text-gray-300" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
                Departments
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gradient-to-b from-white to-gray-100 relative">
        <div className="absolute left-0 top-0 h-full w-1/4 opacity-5 hidden lg:block">
          <img src="/placeholder.svg?height=800&width=400" alt="Background Pattern" className="h-full object-cover" />
        </div>

        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2
              className="text-3xl font-bold text-gray-800 mb-4"
              style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
            >
              Get in Touch
            </h2>
            <p
              className="text-lg text-gray-600 max-w-3xl mx-auto"
              style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
            >
              Have questions about the Internship Portal? Contact us for more information or support.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3
                className="text-xl font-semibold text-gray-800 mb-6"
                style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
              >
                Contact Information
              </h3>

              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <MapPin className="h-6 w-6 text-teal-600 mr-3 mt-0.5" />
                  <div>
                    <p
                      className="font-medium text-gray-800"
                      style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                    >
                      Address
                    </p>
                    <p className="text-gray-600" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
                      Air University, E-9, Islamabad, Pakistan
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Mail className="h-6 w-6 text-teal-600 mr-3 mt-0.5" />
                  <div>
                    <p
                      className="font-medium text-gray-800"
                      style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                    >
                      Email
                    </p>
                    <p className="text-gray-600" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
                      internships@au.edu.pk
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Phone className="h-6 w-6 text-teal-600 mr-3 mt-0.5" />
                  <div>
                    <p
                      className="font-medium text-gray-800"
                      style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                    >
                      Phone
                    </p>
                    <p className="text-gray-600" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
                      +92-51-9262557
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h4
                  className="text-lg font-medium text-gray-800 mb-4"
                  style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                >
                  Office Hours
                </h4>
                <div className="space-y-2 text-gray-600">
                  <p style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>Monday - Friday: 8:00 AM - 4:00 PM</p>
                  <p style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>Saturday: 9:00 AM - 1:00 PM</p>
                  <p style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>Sunday: Closed</p>
                </div>
              </div>

              <div className="mt-8">
                <img src="/placeholder.svg?height=300&width=400" alt="Campus Map" className="rounded-lg shadow-md" />
              </div>
            </div>

            <div>
              <h3
                className="text-xl font-semibold text-gray-800 mb-6"
                style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
              >
                Send us a Message
              </h3>

              {submitted ? (
                <div className="bg-teal-50 border border-teal-200 text-teal-800 rounded-lg p-6 text-center">
                  <CheckCircle className="h-12 w-12 mx-auto text-teal-500 mb-4" />
                  <h4 className="text-lg font-medium mb-2" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
                    Thank You!
                  </h4>
                  <p style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
                    Your message has been received. We'll get back to you soon.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-1"
                      style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      placeholder="Your name"
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-1"
                      style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      placeholder="Your email address"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium text-gray-700 mb-1"
                      style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                    >
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      placeholder="Subject of your message"
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-gray-700 mb-1"
                      style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      rows={5}
                      placeholder="Your message"
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                    />
                  </div>

                  <div>
                    <button
                      type="submit"
                      className="w-full px-6 py-3 bg-gradient-to-r from-teal-600 to-emerald-500 text-white font-medium rounded-lg hover:from-teal-700 hover:to-emerald-600 transition-colors flex items-center justify-center shadow-lg"
                      style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                      disabled={submitting}
                    >
                      {submitting ? (
                        <>
                          <span className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Message
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white pt-16 pb-8">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div>
              <h4 className="text-lg font-semibold mb-4" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
                About Air University
              </h4>
              <p className="text-gray-400 mb-4" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
                Air University is a premier institution providing quality education with a focus on innovation,
                research, and industry partnerships.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Linkedin className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Github className="h-5 w-5" />
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
                Quick Links
              </h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                    style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                    style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                    style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                  >
                    Internships
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                    style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                  >
                    For Industry Partners
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                    style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                  >
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
                Resources
              </h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                    style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                    style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                  >
                    Student Guidelines
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                    style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                  >
                    Industry FAQs
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                    style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                  >
                    Supervisor Handbook
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                    style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                  >
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
                Contact Us
              </h4>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <MapPin className="h-5 w-5 mr-2 text-gray-400 mt-0.5" />
                  <span className="text-gray-400" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
                    Air University, E-9, Islamabad, Pakistan
                  </span>
                </li>
                <li className="flex items-start">
                  <Mail className="h-5 w-5 mr-2 text-gray-400 mt-0.5" />
                  <span className="text-gray-400" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
                    internships@au.edu.pk
                  </span>
                </li>
                <li className="flex items-start">
                  <Phone className="h-5 w-5 mr-2 text-gray-400 mt-0.5" />
                  <span className="text-gray-400" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
                    +92-51-9262557
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8">
            <p
              className="text-center text-gray-400 text-sm"
              style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
            >
              © {new Date().getFullYear()} Air University Internship Portal. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
    
    </SuperAdminLayout>
  )
}

