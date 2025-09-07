import { useState } from "react";
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
  const [open, setOpen] = useState(false);

  const theme = () => {
    document.body.classList.toggle("light");
  };

  const renderPage = () => {
    switch (page) {
      case "home":
        return <Home />;
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

      default:
        return <Home />;
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
