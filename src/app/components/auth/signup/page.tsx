"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");  
  const [isLoading, setIsLoading] = useState(false); 
  const router = useRouter();

  const handleSignUp = async (email: string, password: string, name: string) => {
    setIsLoading(true);  
    setError(""); 

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, name }),
      });

      const contentType = response.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        const data = await response.json(); 
        if (response.ok) {
          console.log("Signup thành công:", data.token);
          localStorage.setItem("token", data.token);
          router.push("/components/auth/login");
        } else {
          console.error("Lỗi đăng ký:", data.message);
          setError(data.message || "Đã có lỗi xảy ra, vui lòng thử lại!");
        }
      } else {
        const text = await response.text();  
        setError(`Dữ liệu trả về không hợp lệ: ${text}`);
      }
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
      setError("Có lỗi xảy ra, vui lòng thử lại.");
    }

    setIsLoading(false); 
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-3xl font-semibold text-center mb-8">Sign Up</h2>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border rounded-lg"
              placeholder="Enter your name"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border rounded-lg"
              placeholder="Enter your email"
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border rounded-lg"
              placeholder="Enter your password"
            />
          </div>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <button
            type="button"
            onClick={() => handleSignUp(email, password, name)}
            className="w-full py-3 bg-blue-600 text-white rounded-lg"
            disabled={isLoading} 
          >
            {isLoading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
