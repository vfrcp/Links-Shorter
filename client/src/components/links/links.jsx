import React, {useContext, useEffect} from "react"

import { AuthContext } from "../../context/authContext"
import ListItem from "./linkItem"
import "./links.sass"

export default function Links({history}){
  const {isAuth, setIsAuth, setReRender} = useContext(AuthContext)
  if(!isAuth){history.push("/")}
    useEffect(() => {
      try{
        if(isAuth){
          const getInfo = async () => {
            const newIsAuth = {...isAuth}
            let response = await fetch("http://localhost:5000/links/get",{
              method: "POST", 
              headers:{
                'Content-Type': 'application/json;charset=utf-8',
              }, 
                body: JSON.stringify({id: isAuth.id, prevToken: isAuth.token})
            })
            response = await response.json()
            newIsAuth.token = response.token
            newIsAuth.links = response.links
            console.log(response)
            setIsAuth(newIsAuth)
            localStorage.setItem("token", JSON.stringify(newIsAuth))
          }
          getInfo() 
        }
      }catch(err){
        console.log(err.message)
      }
    },[])
  return(
    isAuth && 
    <div className="wraper">
      <h1 className="label">Hello {isAuth.username}, your links</h1>
      {isAuth.links &&
        <div className="links">
          {isAuth.links.map((item, index) => {
            return <ListItem index={index} name={item.name} link ={item.id} clicks={item.clicks} key={item.id} / >
          })}
        </div>
      }
    </div>
  )
}