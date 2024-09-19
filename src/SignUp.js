// SignUp.js
export default function SignUp() {
    return (
      <div className="flex h-screen justify-center items-center">
        <form className="bg-white p-6 rounded shadow-md w-80">
          <h1 className="text-xl font-bold mb-4">Sign Up</h1>
          <input
            type="email"
            placeholder="Email"
            className="border p-2 w-full mb-4"
          />
          <input
            type="password"
            placeholder="Password"
            className="border p-2 w-full mb-4"
          />
          <button className="bg-green-500 text-white py-2 px-4 rounded w-full">
            Sign Up
          </button>
        </form>
      </div>
    );
  }
  