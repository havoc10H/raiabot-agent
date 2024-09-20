export default function SignUp() {
  const appName = process.env.REACT_APP_NAME;

  const siteUrl = process.env.REACT_APP_SITE_URL;

  return (
    <div
      id="page-container"
      className="mx-auto flex min-h-dvh w-full min-w-[320px] flex-col bg-gray-100 dark:bg-gray-900 dark:text-gray-100"
    >
      {/* Page Content */}
      <main id="page-content" className="flex max-w-full flex-auto flex-col">
        <div className="relative mx-auto flex min-h-dvh w-full max-w-10xl items-center justify-center overflow-hidden p-4 lg:p-8">
          {/* Sign Up Section */}
          <section className="w-full max-w-xl py-6">
            {/* Header */}
            <header className="mb-10 text-center">
              <h1 className="mb-2 inline-flex items-center gap-2 text-2xl font-bold">
                <svg
                  className="hi-mini hi-cube-transparent inline-block size-5 text-blue-600 dark:text-blue-500"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M9.638 1.093a.75.75 0 01.724 0l2 1.104a.75.75 0 11-.724 1.313L10 2.607l-1.638.903a.75.75 0 11-.724-1.313l2-1.104zM5.403 4.287a.75.75 0 01-.295 1.019l-.805.444.805.444a.75.75 0 01-.724 1.314L3.5 7.02v.73a.75.75 0 01-1.5 0v-2a.75.75 0 01.388-.657l1.996-1.1a.75.75 0 011.019.294zm9.194 0a.75.75 0 011.02-.295l1.995 1.101A.75.75 0 0118 5.75v2a.75.75 0 01-1.5 0v-.73l-.884.488a.75.75 0 11-.724-1.314l.806-.444-.806-.444a.75.75 0 01-.295-1.02zM7.343 8.284a.75.75 0 011.02-.294L10 8.893l1.638-.903a.75.75 0 11.724 1.313l-1.612.89v1.557a.75.75 0 01-1.5 0v-1.557l-1.612-.89a.75.75 0 01-.295-1.019zM2.75 11.5a.75.75 0 01.75.75v1.557l1.608.887a.75.75 0 01-.724 1.314l-1.996-1.101A.75.75 0 012 14.25v-2a.75.75 0 01.75-.75zm14.5 0a.75.75 0 01.75.75v2a.75.75 0 01-.388.657l-1.996 1.1a.75.75 0 11-.724-1.313l1.608-.887V12.25a.75.75 0 01.75-.75zm-7.25 4a.75.75 0 01.75.75v.73l.888-.49a.75.75 0 01.724 1.313l-2 1.104a.75.75 0 01-.724 0l-2-1.104a.75.75 0 11.724-1.313l.888.49v-.73a.75.75 0 01.75-.75z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{appName}</span>
              </h1>
              <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Create your own account in one single step
              </h2>
            </header>
            {/* END Header */}

            {/* Sign Up Form */}
            <div className="flex flex-col overflow-hidden rounded-lg bg-white shadow-sm dark:bg-gray-800 dark:text-gray-100">
              <div className="grow p-5 md:px-16 md:py-12">
                <form
                  onSubmit={(e) => e.preventDefault()}
                  className="space-y-6"
                >
                  <div className="space-y-1">
                    <label htmlFor="name" className="text-sm font-medium">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      placeholder="Enter your first name"
                      className="block w-full rounded-lg border border-gray-200 px-5 py-3 leading-6 placeholder-gray-500 focus:border-blue-500 focus:ring focus:ring-blue-500/50 dark:border-gray-600 dark:bg-gray-800 dark:placeholder-gray-400 dark:focus:border-blue-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="Enter your email"
                      className="block w-full rounded-lg border border-gray-200 px-5 py-3 leading-6 placeholder-gray-500 focus:border-blue-500 focus:ring focus:ring-blue-500/50 dark:border-gray-600 dark:bg-gray-800 dark:placeholder-gray-400 dark:focus:border-blue-500"
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
                      placeholder="Choose a strong password"
                      className="block w-full rounded-lg border border-gray-200 px-5 py-3 leading-6 placeholder-gray-500 focus:border-blue-500 focus:ring focus:ring-blue-500/50 dark:border-gray-600 dark:bg-gray-800 dark:placeholder-gray-400 dark:focus:border-blue-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label
                      htmlFor="password_confirm"
                      className="text-sm font-medium"
                    >
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      id="password_confirm"
                      name="password_confirm"
                      placeholder="Confirm your chosen password"
                      className="block w-full rounded-lg border border-gray-200 px-5 py-3 leading-6 placeholder-gray-500 focus:border-blue-500 focus:ring focus:ring-blue-500/50 dark:border-gray-600 dark:bg-gray-800 dark:placeholder-gray-400 dark:focus:border-blue-500"
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="terms"
                      name="terms"
                      className="size-4 rounded border border-gray-200 text-blue-500 focus:border-blue-500 focus:ring focus:ring-blue-500/50 dark:border-gray-600 dark:bg-gray-800 dark:ring-offset-gray-900 dark:checked:border-transparent dark:checked:bg-blue-500 dark:focus:border-blue-500"
                    />
                    <span className="ml-2 text-sm font-medium">
                      I accept
                      <a
                        href="#"
                        className="font-medium text-gray-600 underline hover:text-gray-500 dark:text-gray-400 dark:hover:text-gray-300"
                      >
                        terms &amp; conditions
                      </a>
                    </span>
                  </div>
                  <div>
                    <button
                      type="submit"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-blue-700 bg-blue-700 px-6 py-3 font-semibold leading-6 text-white hover:border-blue-600 hover:bg-blue-600 hover:text-white focus:ring focus:ring-blue-400/50 active:border-blue-700 active:bg-blue-700 dark:focus:ring-blue-400/90"
                    >
                      Create Account
                    </button>
                  </div>
                </form>
              </div>
              <div className="grow bg-gray-50 p-5 text-center text-sm md:px-16 dark:bg-gray-700/50">
                <a
                  href="/signin"
                  className="inline-block font-medium text-blue-600 hover:text-blue-400 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Return to Sign In
                </a>
              </div>
            </div>
            {/* END Sign Up Form */}

            {/* Footer */}
            <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
              Powered by{" "}
              <a
                href={siteUrl}
                className="font-medium text-blue-600 hover:text-blue-400 dark:text-blue-400 dark:hover:text-blue-300"
              >
                {appName}
              </a>
            </div>
            {/* END Footer */}
          </section>
          {/* END Sign Up Section */}
        </div>
      </main>
      {/* END Page Content */}
    </div>
  );
}
