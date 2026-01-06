import {auth} from "../firebase.ts";
import {Navigate} from "react-router-dom";

export default function ProtectedRoute({children,}:{
  children: React.ReactNode
}) {
  const user = auth.currentUser;
  console.log(user);

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
}