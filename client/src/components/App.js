import React, {useState, useEffect} from "react"
import {BrowserRouter, Switch, Route, Redirect} from "react-router-dom"

import {AuthContext} from "../context/authContext"
import AuthController from "../controllers/authController"

import Header from "./header/header"
import Main from "./main/main"
import Auth from "./auth/auth"
import Links from "./links/links"
import CreateLink from "./createLink/createLink"

export default function App() {
  let [isAuth, setIsAuth] = useState(false)
  let [reRender, setReRender] = useState(0)
  useEffect(()=> {
    const fet = async () => {
      setIsAuth(await AuthController.isAuthCheck())
    }
    fet()
  }, [reRender])

  return (
    <AuthContext.Provider value={{setReRender, reRender, isAuth, setIsAuth, login: AuthController.login, register: AuthController.register, logout: AuthController.logout}}>
      <div className="App">
      <BrowserRouter>
        <Header />
        <Switch>
          <Route exact path="/" component={Main}/> 
          <Route path="/auth/:type" component={Auth} />
          <Route exact path="/myLinks" component={Links} />
          <Route exact path="/create" component={CreateLink}/>
          <Redirect to="/" />
        </Switch>
      </BrowserRouter>
    </div>
    </AuthContext.Provider>
  );
}
