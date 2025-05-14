"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from 'lucide-react'; // or use react-icons if you prefer



const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetMessage, setResetMessage] = useState<string | null>(null);
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false); // 👈 Password visibility


  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || "Login failed. Please try again.");
        return;
      }

      const data = await response.json();
      console.log("Login successful:", data);

      localStorage.setItem("token", data.token);
      localStorage.setItem("email", email);
      localStorage.setItem("role", data.user.role);

      const userRole = localStorage.getItem("role");

      if (userRole) {
        console.log("User Role from localStorage:", userRole);

        switch (userRole.toLowerCase()) {
          case "admin":
            router.push("/admin/dashboard");
            break;
          case "coordinator":
            router.push("/Coordinator/Dashboard");
            break;
          case "focalperson":
            router.push("/FocalPerson/dashboard");
            break;
          case "faculty":
            router.push("/FacultySupervisor/internshipdisplay");
            break;
          case "student":
            router.push("/Student/internshipdisplay");
            break;
          case "industry":
            router.push("/Industry/internshipdisplay");
            break;
          case "enterprisecell":
            router.push("/InterpriseCell/dashboard");
            break;
          case "superadmin":
            router.push("/superAdminPortal/makeIndustry");
            break;
          default:
            
            router.push("/dashboard");
        }
      } else {
        setError("Role not found. Please log in again.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setError("An error occurred. Please try again later.");
    }
  };

  const handleForgotPassword = () => {
    setShowForgotPassword(true);
  };

  const handleResetPassword = async () => {
    try {
      const response = await fetch("/api/forget-Password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        setResetMessage(data.error || "Failed to send reset link.");
        return;
      }
  
      setResetMessage("✅ Reset link sent! Check your email.");
      setTimeout(() => setShowForgotPassword(false), 3000); // Auto-close popup
    } catch (error) {
      console.error("Error sending reset link:", error);
      setResetMessage("Something went wrong. Please try again.");
    }
  };
  
  return (
    <div className="flex h-screen">
      <div className="w-1/2 bg-green-700 rounded-tr-[100px] rounded-br-[100px] flex items-center justify-center">
        <h2 className="text-white text-2xl font-bold">Welcome Back!</h2>
      </div>

      <div className="w-1/2 bg-white flex items-center justify-center">
        <div className="w-80">
          <h2 className="text-xl mb-4 text-gray-800 text-center font-bold">Login</h2>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <form onSubmit={handleLogin}>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-3 py-2 border border-gray-300 rounded mb-4 text-sm focus:outline-none focus:ring focus:ring-green-700"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative mb-2">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring focus:ring-green-700 pr-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer text-gray-500"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </div>
            </div>

            <div className="text-right text-sm text-green-700 cursor-pointer mb-4" onClick={handleForgotPassword}>
              Forgot Password?
            </div>

            <button
              type="submit"
              className="w-full bg-green-700 text-white py-2 rounded-full text-sm hover:bg-green-600 transition duration-300 ease-in-out"
            >
              Login
            </button>
          </form>

          {showForgotPassword && (
            <div className="mt-4 bg-gray-100 p-4 rounded shadow-md">
              <h3 className="text-sm font-medium mb-2">Reset Your Password</h3>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-3 py-2 border border-gray-300 rounded mb-2 text-sm focus:outline-none focus:ring focus:ring-green-700"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                required
              />
              <button
                onClick={handleResetPassword}
                className="w-full bg-green-700 text-white py-2 rounded-full text-sm hover:bg-green-600 transition duration-300 ease-in-out"
              >
                Send Reset Link
              </button>

              {resetMessage && (
                <p className={`text-sm mt-2 ${resetMessage.includes("✅") ? "text-green-500" : "text-red-500"}`}>
                  {resetMessage}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;