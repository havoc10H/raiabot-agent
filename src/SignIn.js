import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    navigate("/main");
    return;
    try {
      const response = await axios.post("http://localhost:5000/signin", {
        email,
        password,
      });
      localStorage.setItem("token", response.data.token);
      navigate("/main");
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };

  return (
    <div className="flex h-screen justify-center items-center">
      <form onSubmit={handleSignIn} className="bg-white p-6 rounded shadow-md w-80">
        <h1 className="text-xl font-bold mb-4">Sign In</h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 w-full mb-4"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 w-full mb-4"
        />
        <button className="bg-blue-500 text-white py-2 px-4 rounded w-full">
          Sign In
        </button>
      </form>
    </div>
  );
}
