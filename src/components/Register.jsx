import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../models/auth";
import { isAuthenticated } from "../models/token";
import { validatePassword } from "../utils/passwordValidation";

import logo from "../assets/logo/logo-login.svg";
import text from "../assets/logo/CoedOne.svg";

function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = {};

    if (!email) {
      newErrors.email = "Email is required";
    }

    const passwordErrors = validatePassword(password);
    if (passwordErrors.length > 0) {
      newErrors.password = passwordErrors;
    }

    if (password !== repeatPassword) {
      newErrors.repeatPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const result = await register(email.toLowerCase(), password);

    if (result.errors) {
      setErrors({ email: result.errors.detail });
    } else {
      setErrors({});
      navigate("/dashboard");
    }
  };

  const inputClass = (field) => (errors[field] ? "input-field input-field-error" : "input-field");

  return (
    <div
      className="
        flex
        flex-col
        items-center
        justify-center
        min-h-dvh
        px-4
      "
    >
      <div
        className="
              text-center
              mb-8
            "
      >
        <img
          src={logo}
          alt="Coed ikon"
          className="
                w-30
                h-auto
                mx-auto
                mb-4
                logo-glow
              "
        />
        <img
          src={text}
          alt="Coed One"
          className="
                w-30
                h-auto
                mx-auto
                mb-4
              "
        />
      </div>
      <div
        className="
              flex
              flex-col
              p-10
              rounded-2xl
              w-full
              max-w-md
              gap-4
              border
              box-shadow
            "
      >
        <h1 className="text-4xl font-bold">Register</h1>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-3 w-full"
        >
          <div>
            <label
              htmlFor="email"
              className="text-gray-300"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);

                setErrors((prev) => ({
                  ...prev,
                  email: null,
                }));
              }}
              className={inputClass("email")}
            />
            {errors.email && <p className="text-error text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <label
              htmlFor="password"
              className="text-gray-300"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);

                setErrors((prev) => ({
                  ...prev,
                  email: null,
                }));
              }}
              className={inputClass("password")}
            />

            {errors.password && (
              <div className="text-error text-sm mt-1">
                {Array.isArray(errors.password) ? (
                  errors.password.map((err, i) => (
                    <span
                      key={i}
                      className="block"
                    >
                      {err}
                    </span>
                  ))
                ) : (
                  <span>{errors.password}</span>
                )}
              </div>
            )}
          </div>

          <div className="mb-3">
            <label
              htmlFor="repeat-password"
              className="text-gray-300"
            >
              Repeat Password
            </label>
            <input
              type="password"
              id="repeat-password"
              value={repeatPassword}
              onChange={(e) => {
                setRepeatPassword(e.target.value);

                setErrors((prev) => ({
                  ...prev,
                  email: null,
                }));
              }}
              className={inputClass("repeatPassword")}
            />
            {errors.repeatPassword && (
              <p className="text-error text-sm mt-1">{errors.repeatPassword}</p>
            )}
          </div>

          <button
            type="submit"
            className="
                mt-4
                w-full
                button
                button-cyan
                "
          >
            Register
          </button>
        </form>
      </div>

      <p className="text-center mt-4">
        Already have an account?{" "}
        <Link
          to="/"
          className="link"
        >
          Login
        </Link>
      </p>
    </div>
  );
}

export default Register;
