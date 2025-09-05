import { useState } from "react";
import "../assets/Navbar.css";
import { handleLogout } from "../utils/logout";

const Navbar = ({ setPage, isLoggedIn, setIsLoggedIn }) => {
  const [open, setOpen] = useState(false);

  const handleClick = (page) => {
    setPage(page);
  };

  return (
    <nav>
      <button onClick={() => setPage("home")}>Home</button>
      <div>
        <button onClick={() => setOpen(!open)}>☰</button>

        {open && (
          <div id="nav-menu">
            <a onClick={() => handleClick("profile")}>Profile</a>
            <a onClick={() => handleClick("about")}>About</a>
            <a onClick={() => handleClick("contact")}>Contact</a>
            {isLoggedIn ? (
              <a onClick={() => handleLogout(setPage, setIsLoggedIn)}>Logout</a>
            ) : (
              <a onClick={() => handleClick("login")}>Login</a>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
