import { useState } from "react";
import Login from "./Login";
import Signup from "./Signup";

const Forms = ({ setPage, setIsLoggedIn }) => {
  const [form, setForm] = useState("login");

  switch (form) {
    case "signup":
      return <Signup setForm={setForm} />;

    case "login":
    default:
      return (
        <Login
          setPage={setPage}
          setForm={setForm}
          setIsLoggedIn={setIsLoggedIn}
        />
      );
  }
};
export default Forms;
