const JWT = require("jsonwebtoken");

class tokens{

  static create(data){
    const tokens = {
      tokenR: JWT.sign(data, process.env.TOKENR, {
          expiresIn: "50d",
      })
    } 
    return tokens
  }
  static verify(token){
    try{
      const data  = JWT.verify(token, process.env.TokenR)
      return data
    }catch(err){
      return{message: "token expared"}
    }
  }
}

module.exports = tokens