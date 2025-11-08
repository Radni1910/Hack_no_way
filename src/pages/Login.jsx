import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Placeholder Firebase auth functions (replace later)
const signInUser = async (email, password) => {
  return new Promise((resolve) =>
    setTimeout(() => resolve({ user: { email } }), 1000)
  );
};

const signUpUser = async (email, password) => {
  return new Promise((resolve) =>
    setTimeout(() => resolve({ user: { email } }), 1000)
  );
};

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAuth = async (action) => {
    setError(null);

    if (!email || !password) {
      setError("Please fill out all fields.");
      return;
    }

    setLoading(true);

    try {
      if (action === "signup") {
        await signUpUser(email, password);

        // Store login info temporarily before Step2
        localStorage.setItem("auth-user", JSON.stringify({ email }));

        navigate("/profile-info"); // Go to Step2 page
      } else {
        await signInUser(email, password);
        alert("Login Successful!");
        navigate("/profile"); // later can change where to go
      }
    } catch (err) {
      setError("Authentication Failed. Try Again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSigningUp(!isSigningUp);
    setError(null);
    setEmail("");
    setPassword("");
  };

  const title = isSigningUp ? "Create Your Account" : "Sign In to Your Profile";
  const buttonText = isSigningUp ? "Sign Up" : "Sign In";

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-lg bg-white p-10 rounded-2xl shadow-xl border border-gray-200">
        <h2 className="text-4xl font-extrabold text-gray-900 text-center mb-8">
          {title}
        </h2>

        {error && (
          <div className="bg-red-100 text-red-800 p-4 rounded-lg text-base mb-5 border border-red-200">
            {error}
          </div>
        )}

        <div className="space-y-6">
          {/* Email */}
          <div>
            <label className="block text-lg font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 block w-full px-5 py-3 text-lg border border-gray-300 rounded-xl 
              focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="you@example.com"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-lg font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 block w-full px-5 py-3 text-lg border border-gray-300 rounded-xl 
              focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="••••••••"
            />
          </div>

          {/* Submit */}
          <button
            onClick={() => handleAuth(isSigningUp ? "signup" : "signin")}
            className="w-full py-4 text-2xl font-semibold bg-indigo-600 text-white rounded-xl shadow-lg
            hover:bg-indigo-700 transition disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Please Wait..." : buttonText}
          </button>
        </div>

        <p className="mt-7 text-center text-lg">
          <button
            onClick={toggleMode}
            className="text-indigo-600 hover:underline"
          >
            {isSigningUp
              ? "Already have an account? Sign In"
              : "Don't have an account? Sign Up"}
          </button>
        </p>
      </div>
    </div>
  );
}
