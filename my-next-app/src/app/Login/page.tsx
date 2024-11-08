"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null); // Reset error state

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || 'Login failed. Please try again.');
        return;
      }

      const data = await response.json();
      console.log('Login successful:', data);

      // Store the token and email in localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('email', email); // Store email

      // Navigate to Navbar component
      router.push('/navbar'); 
    } catch (error) {
      console.error('Error during login:', error);
      setError('An error occurred. Please try again later.');
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
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full px-3 py-2 border border-gray-300 rounded mb-4 text-sm focus:outline-none focus:ring focus:ring-green-700"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button
              type="submit"
              className="w-full bg-green-700 text-white py-2 rounded-full text-sm hover:bg-green-600 transition duration-300 ease-in-out"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
