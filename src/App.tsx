import {createBrowserRouter, RouterProvider} from "react-router-dom";
import type {RouteObject} from "react-router-dom";
import Layout from "./components/layout.tsx";
import Home from "./routes/home.tsx";
import Profile from "./routes/profile.tsx";
import CreateAccount from "./routes/create-account.tsx";
import Login from "./routes/login.tsx";
import styled, {createGlobalStyle} from "styled-components";
import reset from "styled-reset";
import {useEffect, useState} from "react";
import LoadingScreen from "./components/loading-screen.tsx";
import {auth} from "./firebase.ts";
import ProtectedRoute from "./components/protected-route.tsx";

const router = createBrowserRouter([
    {
      path:"/",
      element: (
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>),
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

const Wrapper = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
`

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const init = async() => {
    // wait for firebase

    // 인증 상태가 준비되었는지 기다림
    // 최초 인증 상태가 완료될 때 실행되는 promise를 return
    await auth.authStateReady();
    setIsLoading(false);

    // for test
    // setTimeout(() => setIsLoading(false), 2000);
  }
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    init();
  }, []);
  return (
    <Wrapper>
      <GlobalStyles />
      {isLoading ? <LoadingScreen />
          : <RouterProvider router={router} />}
    </Wrapper>
  )
}

export default App
