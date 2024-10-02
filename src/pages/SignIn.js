import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import qs from "qs";
import Swal from 'sweetalert2';
import config from '../config.json';

export default function SignIn({ setIsAuthenticated }) {
  const appName = config.appName;
  const appIcon = config.appIcon;
  
  const siteUrl = config.siteUrl;

  const apiKey  = config.apiKey;
  const secretKey = config.secretKey;

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const showSignInError = (errorText) => {
    Swal.fire({
      title: '<h2 class="text-lg text-white">Sign In Failed</h2>',
      html: `<p class="text-md text-gray-200">${errorText}</p>`, // Inject errorText here
      icon: null,
      background: '#2B3544', // Dark background
      confirmButtonText: 'Try again!',
      customClass: {
        confirmButton: 'bg-red-500 hover:bg-red-700 text-white text-sm px-6', 
        popup: 'p-2', // Full width on mobile, smaller on larger screens
      },
    });
  }

  const handleSignIn = async (e) => {
    e.preventDefault();

    const data = qs.stringify({
      'APIKEY': apiKey,
      'SECRETKEY': secretKey,
      'USERNAME': username,
      'PASSWORD': password,
    });
    
    const config = {
      method: 'post',
      url: siteUrl + "/api/getUser.cfm",
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: data,
    };
    
    axios.request(config)
    .then((response) => {
      const responseData = response.data[0];

      if (responseData) {

        const loginKey = responseData.loginKey;
        const loginUsername = `${responseData.firstName} ${responseData.lastName}`;
  
        localStorage.setItem('raia-loginKey', loginKey);
        localStorage.setItem('raia-loginUsername', loginUsername);

        setIsAuthenticated(true);

        navigate('/');
      } else {
        showSignInError('Invalid username or password.');
        // console.error('Invalid response data:', response.data);
      }
    })
    .catch((error) => {
      showSignInError('Invalid username or password.');
      // console.error('Error signing in:', error.response ? error.response.data : error.message);
    });
    
  };

  const [realHeight, setRealHeight] = useState(window.innerHeight);

  const handleResize = () => {
    setRealHeight(window.innerHeight);
  };

  window.addEventListener('resize', handleResize);

  return (
    <div className="mx-auto flex w-full min-w-1/2 flex-col bg-sign-background text-white" style={{ height: realHeight }}>
      <main id="page-content" className="flex max-w-full flex-auto flex-col">
        <div 
          className="relative mx-auto flex w-full max-w-10xl items-center justify-center overflow-hidden p-4 lg:p-8" 
          style={{ height: realHeight }}
        >
          <section className="w-full max-w-xl py-6">
            {/* Header */}
            <header className="mb-10 text-center">
              <div className="inline-flex items-center justify-between my-2">
                <div className="flex items-center space-x-2">
                  <img src={appIcon} alt="App Icon" className="w-7 h-7 rounded-full" />
                  <h1 className="text-xl font-semibold">{appName}</h1>
                </div>
              </div>
              <h2 className="text-sm font-medium text-gray-400">
                Welcome, please sign in to {appName}
              </h2>
            </header>
            {/* END Header */}

            {/* Sign In Form */}
            <div className="flex flex-col overflow-hidden rounded-lg bg-sign-dialog-background shadow-sm">
              <div className="grow p-5 md:px-16 md:py-12">
                <form
                  onSubmit={handleSignIn}
                  className="space-y-6"
                >
                  <div className="space-y-1">
                    <label htmlFor="username" className="text-sm font-medium">
                      Username
                    </label>
                    <input
                      type="username"
                      id="username"
                      name="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter your username or email"
                      className="block w-full rounded-lg text-black px-5 py-3 leading-6 focus:ring"
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
                      className="block w-full rounded-lg text-black px-5 py-3 leading-6"
                    />
                  </div>
                  <div>
                    <div className="mb-5 flex items-center justify-between gap-2">
                      <label className="flex items-center">
                       
                      </label>
                     
                      <Link to={`${siteUrl}/app/login_forgot.cfm`} className="inline-block text-sm font-medium text-blue-600 hover:text-blue-400">Forgot Password?</Link>
                    </div>
                    <button
                      type="submit"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-blue-700 bg-blue-700 px-6 py-3 font-semibold leading-6 text-white hover:border-blue-600 hover:bg-blue-600 hover:text-white focus:ring focus:ring-blue-400/50 active:border-blue-700 active:bg-blue-700"
                    >
                      <span>Sign In</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
            {/* END Sign In Form */}

            {/* Footer */}
            <div className="mt-6 text-center text-sm text-gray-400">
              Powered by&nbsp;
              <Link to={siteUrl} className="font-medium text-blue-600 hover:text-blue-400">{appName}</Link>
            </div>
            {/* END Footer */}
          </section>
        </div>
      </main>
    </div>
  );
}