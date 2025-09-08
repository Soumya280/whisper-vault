import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import "./assets/App.css";
import Home from "./components/Home";
import About from "./components/About";
import Contact from "./components/Contact";
import Forms from "./components/Forms";
import Profile from "./components/Profile";
import UpdateUser from "./components/UpdateUser";

const App = () => {
  const [page, setPage] = useState("home");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in on page load
    const checkLogin = async () => {
      try {
        const res = await fetch("http://localhost:8080/user/userdata", {
          method: "GET",
          credentials: "include",
        });
        if (res.ok) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (err) {
        console.error(err);
        setIsLoggedIn(false);
      }
    };
    checkLogin();
  }, []);

  const theme = () => {
    document.body.classList.toggle("light");
  };

  const renderPage = () => {
    switch (page) {
      case "profile":
        return <Profile setPage={setPage} setIsLoggedIn={setIsLoggedIn} />;
      case "update_user":
        return <UpdateUser />;
      case "about":
        return <About />;
      case "contact":
        return <Contact />;
      case "login":
        return <Forms setPage={setPage} setIsLoggedIn={setIsLoggedIn} />;
      case "home":
      default:
        return <Home setPage={setPage} />;
    }
  };

  return (
    <div id="app">
      <Navbar
        theme={theme}
        setPage={setPage}
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
      />
      <section id="hero">{renderPage()}</section>
    </div>
  );
};

export default App;
