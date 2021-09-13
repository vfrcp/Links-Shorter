import React, {useContext} from "react";

import { AuthContext } from "../../context/authContext"

export default function CreateLink({history}){
  const {isAuth, setIsAuth} = useContext(AuthContext)
  if(!isAuth){history.push("/")}
  const fet = async (event) => {
    event.preventDefault()
    try{
      let data = new FormData(event.target)
      data = Object.fromEntries(data)
      data.id = isAuth.id
      data.prevToken = isAuth.token
      let response = await fetch("http://localhost:5000/links/create", {
        method: "POST",
        headers:{
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(data)
      }) 
      response = await response.json()
      console.log(response)
      setIsAuth(response)
      localStorage.setItem("token", JSON.stringify(response))
      console.log(response)
    }catch(err){
      console.log(err.message)
    }
  }

  return(
    isAuth &&
    <div className="createLink">
      <h1>Create link</h1>
      <form onSubmit={fet}>
        <label htmlFor="name">Name</label>
        <input type="text" name="name" />
        <label htmlFor="link">link</label>
        <input type="text" name="link" />
        <button>Create</button>
      </form>
    </div>
  )
}