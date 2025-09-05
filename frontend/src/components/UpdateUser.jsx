import { useEffect, useState } from "react";

const UpdateUser = () => {
  const [showPassword, setShowPassword] = useState("password");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const result = await fetch("http://localhost:8080/user/userdata", {
          method: "GET",
          credentials: "include",
        });

        if (!result.ok) {
          const errorData = await result.json();
          console.error(errorData.error);
          return;
        }

        const userData = await result.json();

        if (userData) {
          setEmail(userData.email);
          setUsername(userData.username);
          setPassword(userData.password);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await fetch("http://localhost:8080/user/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, username, password }),
        credentials: "include",
      });

      const update = await result.json();
      if (result.ok) {
        console.log(update);
      }
    } catch (error) {
      console.error(error);
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
      <button type="submit">Update</button>
    </form>
  );
};
export default UpdateUser;
