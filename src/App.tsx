import React, { useState } from "react";
import MainPage from "./pages/MainPage";
import { ThemeProvider } from "styled-components";
import { DarkTheme } from "./Themes";
import GlobalStyle from "./GlobalStyle";
import { useEffect } from "react";
import md5 from "js-md5";

const auth = sessionStorage.getItem('isAuth')

const App = () => {
  const [isAuth, setIsAuth] = useState<number>(
    (auth && auth !== "undefined" && auth !== null) ? JSON.parse(auth) : 0
  )
  const handlePwdSecure = () => {
    const pwdSecure = localStorage.getItem("pwdSecure");
    if (!pwdSecure) {
      const pwd = window.prompt(
        "请保存您的密码，该密码在下次登录时使用!"
      );
      if (pwd) {
        localStorage.setItem("pwdSecure", md5(pwd!));
        setIsAuth(1)
        sessionStorage.setItem('isAuth', '1')
      } else {
        handlePwdSecure();
      }
    } else {
      const pwd = window.prompt("请确认您的密码!");
      if (pwd) {
        if (md5(pwd!) !== pwdSecure) {
          handlePwdSecure();
        } else {
          setIsAuth(1)
          sessionStorage.setItem('isAuth', '1')
        }
      } else {
        handlePwdSecure();
      }
    }
  };

  useEffect(() => {
    if (isAuth !== 1) {
      handlePwdSecure()
    }
  }, []);

  return (
    <>
      <GlobalStyle />
      <ThemeProvider theme={DarkTheme}>
        <MainPage />
      </ThemeProvider>
    </>
  );
};

export default App;
