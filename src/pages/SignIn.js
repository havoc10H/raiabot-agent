import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function SignIn() {
  const appName = process.env.REACT_APP_NAME;

  const siteUrl = process.env.REACT_APP_SITE_URL;

  const apiKey = process.env.REACT_APP_API_KEY;
  const secretKey = process.env.REACT_APP_SECRET_KEY;

  const appIcon = 'https://raiabot.com/assets/images/favicon.ico';

  const signinUrl = siteUrl + "/api/getUser.cfm";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(signinUrl, 
        {
        'APIKEY': apiKey,
        'SECRETKEY': secretKey,
        'USERNAME': username,
        'PASSWORD': password
        },
        {
          headers: {
            'Content-Type': 'application/json', // or whatever content type you need
            // Add any other headers you need here
          }
        }
      );
      localStorage.setItem('raia-token', 'tempToken');
      navigate('/');
    } catch (error) {
      localStorage.setItem('raia-token', 'tempToken');
      navigate('/');
      console.error("Error signing in:", error);
    }
  };

  return (
    <div
      id="page-container"
      className="mx-auto flex min-h-dvh w-full min-w-[320px] flex-col bg-custom-black text-white"
    >
      <main id="page-content" className="flex max-w-full flex-auto flex-col">
        <div className="relative mx-auto flex min-h-dvh w-full max-w-10xl items-center justify-center overflow-hidden p-4 lg:p-8">
          <section className="w-full max-w-xl py-6">
            {/* Header */}
            <header className="mb-10 text-center">
              <div className="inline-flex items-center justify-between my-2">
                <div className="flex items-center space-x-2">
                  <img
                    src={appIcon}
                    alt="App Icon"
                    className="w-7 h-7 rounded-full"
                  />
                  <h1 className="text-xl font-semibold">{appName}</h1>
                </div>
              </div>
              <h2 className="text-sm font-medium text-custom-gray">
                Welcome, please sign in to {appName}
              </h2>
            </header>
            {/* END Header */}

            {/* Sign In Form */}
            <div className="flex flex-col overflow-hidden rounded-lg bg-custom-black2 shadow-sm">
              <div className="grow p-5 md:px-16 md:py-12">
                <form
                  onSubmit={handleSignIn}
                  className="space-y-6"
                >
                  <div className="space-y-1">
                    <label htmlFor="username" className="text-sm font-medium">
                      username
                    </label>
                    <input
                      type="username"
                      id="username"
                      name="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter your username"
                      className="block w-full rounded-lg text-custom-black px-5 py-3 leading-6 placeholder-gray-500 focus:ring"
                    />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="password" className="text-sm font-medium">
                      Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="block w-full rounded-lg text-custom-black px-5 py-3 leading-6"
                    />
                  </div>
                  <div>
                    <div className="mb-5 flex items-center justify-between gap-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          id="remember_me"
                          name="remember_me"
                          className="size-4 rounded border border-gray-200 text-blue-500 focus:border-blue-500 focus:ring focus:ring-blue-500/50"
                        />
                        <span className="ml-2 text-sm">Remember me</span>
                      </label>
                      <a
                        href="#"
                        className="inline-block text-sm font-medium text-blue-600 hover:text-blue-400"
                      >
                        Forgot Password?
                      </a>
                    </div>
                    <button
                      type="submit"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-blue-700 bg-blue-700 px-6 py-3 font-semibold leading-6 text-white hover:border-blue-600 hover:bg-blue-600 hover:text-white focus:ring focus:ring-blue-400/50 active:border-blue-700 active:bg-blue-700"
                    >
                      <span>Sign In</span>
                    </button>
                    {/* Divider: With Label */}
                    <div className="my-5 flex items-center">
                      <span
                        aria-hidden="true"
                        className="h-0.5 grow rounded bg-custom-gray"
                      />
                      <span className="rounded-full bg-custom-gray px-3 py-1 text-xs font-medium text-custom-black2">
                        or sign in with
                      </span>
                      <span
                        aria-hidden="true"
                        className="h-0.5 grow rounded bg-custom-gray"
                      />
                    </div>
                    {/* END Divider: With Label */}
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-semibold leading-5 text-gray-800 hover:border-gray-300 hover:text-gray-900 hover:shadow-sm focus:ring focus:ring-gray-300/25 active:border-gray-200 active:shadow-none"
                      >
                        <svg
                          className="bi bi-facebook inline-block size-4 text-[#1877f2]"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 16 16"
                          aria-hidden="true"
                        >
                          <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z" />
                        </svg>
                        <span>Facebook</span>
                      </button>
                      <button
                        type="button"
                        className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-semibold leading-5 text-gray-800 hover:border-gray-300 hover:text-gray-900 hover:shadow-sm focus:ring focus:ring-gray-300/25 active:border-gray-200 active:shadow-none"
                      >
                        <svg
                          className="bi bi-twitter-x inline-block size-4"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 16 16"
                          aria-hidden="true"
                        >
                          <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865l8.875 11.633Z" />
                        </svg>
                        <span className="sr-only">X</span>
                      </button>
                    </div>
                  </div>
                </form>
              </div>
              <div className="grow bg-custom-black5 p-5 text-center text-sm md:px-16">
                Don’t have an account yet?{" "}
                <a
                  href="/signup"
                  className="font-medium text-blue-600 hover:text-blue-400"
                >
                  Sign up
                </a>
              </div>
            </div>
            {/* END Sign In Form */}

            {/* Footer */}
            <div className="mt-6 text-center text-sm text-custom-gray">
              Powered by{" "}
              <a
                href={siteUrl}
                className="font-medium text-blue-600 hover:text-blue-400"
              >
                {appName}
              </a>
            </div>
            {/* END Footer */}
          </section>
        </div>
      </main>
    </div>
  );
}