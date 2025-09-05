import { useState } from "react";

const Signup = ({ setForm }) => {
  const [showPassword, setShowPassword] = useState("password");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await fetch("http://localhost:8080/user/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, username, password }),
        credentials: "include",
      });

      const signup = await result.json();
      if (result.ok) {
        setForm("login");
      }
      console.log(signup.signup);
    } catch (error) {
      console.error(error);
      console.log("Something went wrong");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <div className="password-input">
        <input
          type={showPassword}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
      <button type="button" onClick={() => setForm("login")}>
        Login
      </button>
    </form>
  );
};

export default Signup;
