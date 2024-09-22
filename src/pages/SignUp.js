export default function SignUp() {
  const appName = process.env.REACT_APP_NAME;

  const siteUrl = process.env.REACT_APP_SITE_URL;

  const appIcon = 'https://raiabot.com/assets/images/favicon.ico';

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
                Create your own account in one single step
              </h2>
            </header>
            {/* END Header */}

            {/* Sign Up Form */}
            <div className="flex flex-col overflow-hidden rounded-lg bg-custom-black2 shadow-sm">
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
                      className="block w-full rounded-lg text-custom-black px-5 py-3 leading-6 placeholder-gray-500 focus:ring"
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
                      placeholder="Choose a strong password"
                      className="block w-full rounded-lg text-custom-black px-5 py-3 leading-6 placeholder-gray-500 focus:ring"
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
                      className="block w-full rounded-lg text-custom-black px-5 py-3 leading-6 placeholder-gray-500 focus:ring"
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="terms"
                      name="terms"
                      className="size-4 rounded border border-gray-200 text-blue-500 focus:border-blue-500 focus:ring focus:ring-blue-500/50"
                    />
                    <span className="ml-2 text-sm font-medium">
                      I accept&nbsp;
                      <a
                        href="#"
                        className="font-medium text-custom-gray underline hover:text-gray-500"
                      >
                        terms &amp; conditions
                      </a>
                    </span>
                  </div>
                  <div>
                    <button
                      type="submit"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-blue-700 bg-blue-700 px-6 py-3 font-semibold leading-6 text-white hover:border-blue-600 hover:bg-blue-600 hover:text-white focus:ring focus:ring-blue-400/50 active:border-blue-700 active:bg-blue-700"
                    >
                      Create Account
                    </button>
                  </div>
                </form>
              </div>
              <div className="grow bg-custom-black5 p-5 text-center text-sm md:px-16">
                <a
                  href="/signin"
                  className="inline-block font-medium text-blue-600 hover:text-blue-400"
                >
                  Return to Sign In
                </a>
              </div>
            </div>
            {/* END Sign Up Form */}

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
