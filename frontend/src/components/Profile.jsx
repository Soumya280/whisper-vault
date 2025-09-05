import { useEffect, useState } from "react";
import { handleLogout } from "../utils/logout";

const Profile = ({ setPage, setIsLoggedIn }) => {
  const [userdata, setUserdata] = useState({});
  const [fetched, setFetched] = useState(false);
  const [unauthorized, setUnauthorized] = useState(false);

  useEffect(() => {
    const fetchUserdata = async () => {
      try {
        const result = await fetch("http://localhost:8080/user/userdata", {
          method: "GET",
          credentials: "include",
        });

        if (result.ok) {
          const user = await result.json();
          setUserdata(user);
          setFetched(true);
          console.log(user);
        } else if (result.status === 401) {
          setUnauthorized(true);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserdata();
  }, []);

  useEffect(() => {
    if (unauthorized) {
      setPage("login");
    }
  }, [unauthorized]);

  return (
    <>
      {fetched && (
        <div>
          <h1>My Profile</h1>
          <h2>Name: {userdata.username}</h2>
          <button type="button" onClick={() => setPage("update_user")}>
            Update
          </button>
          <button
            type="button"
            onClick={() => handleLogout(setPage, setIsLoggedIn)}
          >
            Logout
          </button>
        </div>
      )}
    </>
  );
};
export default Profile;
