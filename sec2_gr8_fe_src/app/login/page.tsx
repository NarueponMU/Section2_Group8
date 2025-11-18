'use client'
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";

export default function Login() {
  const [remember, setRemember] = useState(false);
  const [show, setShow] = useState(false);
  const [Username, setUsername] = useState("");
  const [Password, setEmpPassword] = useState("");
  const [message, setMessage] = useState("");

  const router = useRouter();

  const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5050";

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!Username || !Password) {
      setMessage("Please fill username and password");
      return;
    }

    try {
      const res = await fetch(`${API}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Username, Password }),
        credentials: "include",
      });

      const text = await res.text();
      console.log("🔥 Raw Response:", text);

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        setMessage("Server returned invalid JSON");
        return;
      }

      console.log("Login Response:", data);

      if (data.found) {
        router.push("/dashboard/User");
      } else {
        setMessage("Username or password incorrect");
      }
    } catch (error) {
      console.error("Login error:", error);
      setMessage("Server error, please try again later");
    }
  };

  return (
    <main
      aria-labelledby="login-title"
      className="flex flex-col w-[800px] h-[600px] mx-auto bg-[#fff2d8] justify-center items-center mt-8 rounded-lg p-6 mb-8"
    >
      {/* Header Section */}
      <header className="text-center mb-8">
        <h1 id="login-title" className="text-4xl font-semibold">
          WELCOME TO DUDE TEE NHEE COFFEE
        </h1>

        <h2 className="text-3xl mt-3">Sign in an account</h2>
      </header>

      {/* Form Section */}
      <section
        aria-labelledby="login-form-title"
        className="w-full"
      >
        <h3 id="login-form-title" className="sr-only">Login Form</h3>

        <form onSubmit={handleSubmit} className="w-full mt-4">
          {/* Username */}
          <label htmlFor="username" className="sr-only">Username</label>
          <input
            id="username"
            type="text"
            placeholder="Username"
            className="p-4 bg-white w-full rounded-lg"
            value={Username}
            onChange={(e) => setUsername(e.target.value)}
          />

          {/* Password */}
          <div className="relative w-full mt-7">
            <label htmlFor="password" className="sr-only">Password</label>

            <input
              id="password"
              type={show ? "text" : "password"}
              placeholder="Password"
              className="p-4 bg-white w-full rounded-lg pr-10"
              value={Password}
              onChange={(e) => setEmpPassword(e.target.value)}
            />

            <button
              type="button"
              aria-label={show ? "Hide Password" : "Show Password"}
              onClick={() => setShow(!show)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
            >
              <FontAwesomeIcon icon={show ? faEye : faEyeSlash} />
            </button>
          </div>

          {/* Error Message */}
          {message && (
            <p role="alert" className="mt-5 text-lg text-red-500">
              {message}
            </p>
          )}

          {/* Submit Button */}
          <div className="flex justify-center mt-7">
            <button
              type="submit"
              className="bg-black text-white p-3 w-40 rounded-lg hover:bg-gray-800"
            >
              Login
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}