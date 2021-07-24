import React from "react";
import { auth } from "./components/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import Home from "./components/Home";
import SignIn from "./components/SignIn";
const App = () => {
  const [user] = useAuthState(auth);
  return <>{user ? <Home user={user} /> : <SignIn />}</>;
};

export default App;
