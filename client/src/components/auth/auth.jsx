import React, {useContext} from "react";
import { useParams } from "react-router";

import AuthController from "../../controllers/authController";
import {AuthContext} from "../../context/authContext";

import "./auth.sass"

export default function Auth({history}){
  let {setIsAuth, setReRender} = useContext(AuthContext)
  const {type} = useParams()
  const fet = async (event) => {
    event.preventDefault()
    let data = new FormData(event.target)
    data = Object.fromEntries(data)
    if(data.type === "login"){
      await setIsAuth(JSON.stringify(await AuthController.login(data)))
      setReRender(new Date())      
    }else{
      await setIsAuth(JSON.stringify((await AuthController.register(data))))
      setReRender(new Date())    
    }
    history.push("/")
  }

  return(
    <div className="wraper">
      {type === "login" &&
       <div className="wraper">
         <h1>Login</h1>
        <form onSubmit={fet} name="login">
          <input type="hidden" name="type" value="login" />
          <label htmlFor="username">Enter Username</label>
          <input name="username" type="text" />
          <label htmlFor="password">Enter Password</label>
          <input name="password" type="password" />
          <button>Login</button>
        </form>
       </div>
      }
      {type === "register" &&
        <div className="wraper">
          <h1>Register</h1>
          <form onSubmit={fet} name="register">
          <input type="hidden" name="type" value="register" />
            <label htmlFor="username">Enter Username</label>
            <input type="text" name="username" />
            <label htmlFor="email">Enter Email</label>
            <input type="text" name="email" />
            <label htmlFor="password">Enter Passsword</label>
            <input type="password" name="password" />
            <button>Register</button>
          </form>
        </div>
      }
    </div>
  )
}