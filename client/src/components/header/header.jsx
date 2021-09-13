import React, {useContext} from "react"
import {Link} from "react-router-dom"

import {AuthContext} from "../../context/authContext"
import AuthController from "../../controllers/authController"

import "./header.sass"

export default function Header(){
  let {isAuth, setIsAuth, setReRender} = useContext(AuthContext) 
  const checkIsAuth = () => {
    if(!isAuth){
      alert("Login or register first")
    }
  }
  const logout = async () => {
    await setIsAuth(AuthController.logout(setIsAuth))
    await AuthController.isAuthCheck()
    setReRender(new Date())
  }

  return(
    <header className="p-3 bg-dark text-white header">
      <div className="container">
        <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
          <ul to="/" className="d-flex align-items-center mb-2 mb-lg-0 text-white text-decoration-none">
            <Link to="/" className="nav-link px-2 text-white liItem">Main Page</Link>
          </ul>

            {isAuth &&
              <ul className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
                <li><Link to="/myLinks" className="nav-link px-2 text-white liItem">My Links</Link></li>
                <li><Link to="/create" className="nav-link px-2 text-white liItem">Create Link</Link></li>
              </ul>
            }
            {!isAuth && 
              <ul className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
                <li className="nav-link px-2 text-white liItem" onClick={() => checkIsAuth()}>My Links</li>
                <li className="nav-link px-2 text-white liItem" onClick={() => checkIsAuth()}>Create Link</li>
              </ul>
            }     
          {!isAuth && 
            <div className="text-end">
              <Link to="/auth/login"><button type="button" className="btn btn-outline-light me-2">Login</button></Link>
              <Link to="/auth/register"><button type="button" className="btn btn-warning">Register</button></Link>
            </div>
          }
          {isAuth &&
            <div className="text-end">
              <button type="button" className="btn btn-warning" onClick={() => logout()}>Logout</button>
            </div>
          }
        </div>
      </div>
    </header>
  )
}