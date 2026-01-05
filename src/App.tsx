import {createBrowserRouter, RouteObject, RouterProvider} from "react-router-dom";
import Layout from "../components/layout.tsx";
import Home from "../routes/home.tsx";
import Profile from "../routes/profile.tsx";
import CreateAccount from "../routes/create-account.tsx";
import Login from "../routes/login.tsx";
import {createGlobalStyle} from "styled-components";
import reset from "styled-reset";

const router = createBrowserRouter([
    {
      path:"/",
      element: <Layout />,
      children: [
        {
          index: true,
          element: <Home />,
        },
        {
          path: "profile",
          element: <Profile />
        },
      ],
    },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/create-account",
    element: <CreateAccount />
  }
] as RouteObject[]);

const GlobalStyles = createGlobalStyle`
  ${reset};
  body {
    background-color: black;
    color: white;
    font-family: system-ui;
  }
`

function App() {
  return (
    <>
      <GlobalStyles />
      <RouterProvider router={router} />
    </>
  )
}

export default App
