export default class authController{
  static async isAuthCheck(){
    try{
      if(localStorage.getItem("token")){
       return JSON.parse(localStorage.getItem("token"))
      }else{
        return false
      }
    }catch(err){
      console.log(err.message)
    }
  }
  static async login(data){
    let response = await fetch("http://localhost:5000/auth/login", {
      method: "POST",
      headers:{
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify(data)
    })
    response = await response.json()
    console.log(response)
    if(response.message == false){
      alert("You writed wrong data")
    }else{
      localStorage.setItem("token", JSON.stringify(response))
      return response
    }
  }
  static async register(data){
    let response = await fetch("http://localhost:5000/auth/register", {
      method: "POST",
      headers:{
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify(data)
    })
    response = await response.json()
    if(response.message == false){
      
    }else{
      localStorage.setItem("token", JSON.stringify(response))
      return response
    }
  }
  static async logout(){
    localStorage.removeItem("token")
    return false
  }
}

