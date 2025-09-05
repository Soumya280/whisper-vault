import { useState } from "react";

const Login = ({ setForm, setPage, setIsLoggedIn }) => {
  const [showPassword, setShowPassword] = useState("password");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await fetch("http://localhost:8080/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      if (result.ok) {
        const login = await result.json();
        console.log(login.login);
        setIsLoggedIn(true);
        setPage("home");
      }
    } catch (error) {
      console.error(error);
      console.log("Something went wrong!!!");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <div className="password-input">
        <input
          type={showPassword}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <p
          onClick={() => {
            showPassword == "text"
              ? setShowPassword("password")
              : setShowPassword("text");
          }}
        >
          👁️
        </p>
      </div>
      <button type="submit">Submit</button>
      <button type="button" onClick={() => setForm("signup")}>
        Signup
      </button>
    </form>
  );
};
export default Login;
