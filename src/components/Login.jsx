import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";

import { login } from "../models/auth";
import { isAuthenticated } from "../models/token";

import eyeIcon from "../assets/icons/eye.png";
import logo from "../assets/logo/logo-login.svg";
import text from "../assets/logo/CoedOne.svg";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const passwordField = useRef(null);

  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const inputClasses = error !== "" ? "input-field input-field-error" : "input-field";

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    const result = await login(email.toLowerCase(), password);

    if (result && result.errors) {
      setError(result.errors.detail);

      return;
    }

    setEmail("");
    setPassword("");

    navigate("/dashboard");
  };

  const showPassword = (e) => {
    e.preventDefault();

    if (passwordField.current.type === "password") {
      passwordField.current.type = "text";
    } else {
      passwordField.current.type = "password";
    }
  };

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
        <p
          className="
        text-xs
        text-gray-400
        mt-8
        text-center
      "
        >
          Create projects, invite collaborators and edit files together.
        </p>
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
        <h1 className="text-4xl font-bold">Login</h1>

        <form
          onSubmit={handleSubmit}
          className="
          flex
          flex-col
          gap-4
          w-full
        "
        >
          <div>
            <label
              htmlFor="email"
              className="
              text-sm
              text-gray-300
              mb-2
              block
            "
            >
              Email
            </label>

            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClasses}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="
              text-sm
              text-gray-300
              mb-2
              block
            "
            >
              Password
            </label>

            <div className="flex gap-2">
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClasses}
                ref={passwordField}
              />

              <button
                type="button"
                onClick={showPassword}
                className="
                button
                button-cyan
                button-small
                w-12
                flex
                items-center
                justify-center
              "
              >
                <img
                  src={eyeIcon}
                  alt="Show password"
                  className="
                  opacity-50
                  hover:opacity-80
                  transition-all
                "
                />
              </button>
            </div>
          </div>

          {error && (
            <div
              className="
              text-error
              text-sm
            "
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            className="
            mt-2
            w-full
            button
            button-cyan
          "
          >
            Login
          </button>
        </form>
      </div>

      <p
        className="
          text-center
          mt-6
        "
      >
        No account?{" "}
        <Link
          to="/register"
          className="link"
        >
          Register
        </Link>
      </p>
    </div>
  );
}

export default Login;
