import { Formik } from "formik";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
} from "firebase/auth";
import { initializeApp } from "firebase/app";
import { useState } from "react";

export default function PageComponent({ onClick }: any) {
  const [userInfo, setUserInfo] = useState("");
  const [loginError, setLoginError] = useState("");

  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID,
  };
  const app = initializeApp(firebaseConfig);


  async function postData(url = "", data = {}) {

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-hasura-admin-secret": "ty56UDfuwW5sd4HJ2QQrFDB2r5Jpy6volIN1z2rPiNkLo4dNda4FeIjB68l8O3HO"

      },
      body: JSON.stringify(data),
    });
    return response.json();
  }

  const createUser = async (values: any) => {
    const { login, email, password } = values;
    var body = {
      login: login,
      email: email,
      password: password,
      role: "client",
    };

    const auth = getAuth(app);
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential: { user: any }) => {

        const user = userCredential.user;
        console.log(user);
        onClick();
        postData("https://modern-moray-45.hasura.app/api/rest/user_creation", { ...body }).then(
          (data) => {
            console.log(data);
          }
        );
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode);

        // ..
      });
    onAuthStateChanged(auth, (user) => {
      console.log(user);
    });
  };

  const handleLogin = async (event: any) => {
    event.preventDefault();
    var emailLogin = (document.getElementById("emailLogin") as HTMLInputElement)
      .value;
    var passwordLogin = (
      document.getElementById("passwordLogin") as HTMLInputElement
    ).value;

    const auth = getAuth();
    signInWithEmailAndPassword(auth, emailLogin, passwordLogin)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        // ...
        setUserInfo(emailLogin);
        setLoginError("");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setLoginError(errorMessage);
      });
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center pt-10 lg:pt-40">
        <div className="lg:flex w-[80vw] justify-around">
          {/* LOGIN FORM */}
          <form
            onSubmit={(event) => handleLogin(event)}
            className="flex flex-col items-center p-2 justify-center"
          >
            <div className="flex flex-col">
              <div className="text-center mb-4">
                {userInfo ? <p>Hello! - {userInfo}</p> : ""}
                {loginError ? <p>Error! - {loginError}</p> : ""}
              </div>
              <label className="text-md font-semibold text-black-600">
                E-Mail
              </label>
              <input
                id="emailLogin"
                type="email"
                name="email"
                className="mb-2 px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <div className="text-red-600 text-sm"></div>
            </div>
            <div className="flex flex-col">
              <label className="text-md font-semibold text-black-600">
                Password
              </label>
              <input
                id="passwordLogin"
                type="password"
                name="password"
                className="mb-2 px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <div className="text-red-600 text-sm"></div>
            </div>
            <button
              type="submit"
              className="w-60 h-12 mt-4 rounded-md bg-orange-500 text-white font-semibold text-lg hover:bg-white hover:text-orange-500 hover:border-2 hover:border-orange-500"
            >
              Log in
            </button>
          </form>
          {/* REGISTER FORM */}
          <Formik
            initialValues={{
              email: "",
              password: "",
              repeatPassword: "",
              login: "",
            }}
            validate={(values) => {
              const errors: any = {};
              if (!values.email) {
                errors.email = "Required";
              } else if (
                !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
              ) {
                errors.email = "Invalid email address";
              }
              if (!values.password) {
                errors.password = "Required";
              } else if (values.password.length < 8) {
                errors.password = "Password must be at least 8 characters";
              }
              if (!values.repeatPassword) {
                errors.repeatPassword = "Required";
              } else if (values.repeatPassword != values.password) {
                errors.repeatPassword = "Password Mismatch";
              }
              if (!values.login) {
                errors.login = "Required";
              } else if (values.login.length < 6) {
                errors.login = "Username must be at least 6 characters";
              }
              return errors;
            }}
            onSubmit={createUser}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting,
              /* and other goodies */
            }) => (
              <form
              onSubmit={handleSubmit}
              className="flex flex-col items-center p-2"
              noValidate
            >
              <div className="flex flex-col">
                <label className="text-md font-semibold text-black-600">
                  Login
                </label>
                <input
                  onChange={handleChange}
                  name="login"
                  type="username"
                  value={values.login}
                  className="mb-2 px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <div className="text-red-600 text-sm">
                  {errors.login && touched.login && errors.login}
                </div>
              </div>
              <div className="flex flex-col">
                <label className="text-md font-semibold text-black-600">
                  E-Mail
                </label>
                <input
                  onChange={handleChange}
                  name="email"
                  type="email"
                  value={values.email}
                  className="mb-2 px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <div className="text-red-600 text-sm">
                  {errors.email && touched.email && errors.email}
                </div>
              </div>
              <div className="flex flex-col">
                <label className="text-md font-semibold text-black-600">
                  Password
                </label>
                <input
                  onChange={handleChange}
                  name="password"
                  type="password"
                  value={values.password}
                  className="mb-2 px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <div className="text-red-600 text-sm">
                  {errors.password && touched.password && errors.password}
                </div>
              </div>
              <div className="flex flex-col">
                <label className="text-md font-semibold text-black-600">
                  Repeat Password
                </label>
                <input
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name="repeatPassword"
                  type="password"
                  value={values.repeatPassword}
                  className="mb-2 px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <div className="text-red-600 text-sm">
                  {errors.repeatPassword &&
                    touched.repeatPassword &&
                    errors.repeatPassword}
                </div>
              </div>
              <button
                data-modal-target="defaultModal"
                data-modal-toggle="defaultModal"
                type="submit"
                className="w-60 h-12 mt-4 rounded-md bg-orange-500 text-white font-semibold text-lg hover:bg-white hover:text-orange-500 hover:border-2 hover:border-orange-500"
              >
                Register
              </button>
            </form>
            )}
          </Formik>
        </div>
        <div className="h-24 lg:h-64" />
      </div>
    </div>
  );
}
