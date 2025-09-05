export const handleLogout = async (setPage, setIsLoggedIn) => {
  try {
    const result = await fetch("http://localhost:8080/user/logout", {
      method: "GET",
      credentials: "include",
    });

    if (result.ok) {
      console.log(await result.json());
      setIsLoggedIn(false);
      setPage("login");
    }
  } catch (error) {
    console.log(error);
  }
};
