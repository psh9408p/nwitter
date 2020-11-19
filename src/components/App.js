import React, { useState, useEffect } from "react";
import AppRouter from "./Router";
import { authService } from "../fbase";
function App() {
  const [Init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
      setInit(true);
    });
  }, []);

  setInterval(() => {
    console.log(authService.currentUser);
  }, 2000);
  return <>{Init ? <AppRouter isLoggedIn={isLoggedIn} /> : "initalizing"}</>;
}

export default App;
