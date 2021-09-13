const {Router} = require("express")
const router = Router()
const { nanoid } = require('nanoid')

const Tokens = require("../models/tokens")
const User = require("../models/user")

router.post("/register", async (req, res) => {
  const id = nanoid()
  try{
    const candidate = await User.registerUser(id, req.body.username, req.body.email, req.body.password)
    if(candidate.message === "registered"){
      const tokens = Tokens.create({id, username: req.body.username, links: []})
      await User.writeToken(id, tokens.tokenR, "token1")
      const data = Tokens.verify(tokens.tokenR)
      console.log(data)
      res.send(JSON.stringify(data))
    }else{
      throw Error 
    }
  }catch(err){
    console.log(err.message)
    res.send({message: false})
  }
})

router.post("/login", async (req, res) => {
  try{
    const response = await User.loginUser(req.body.username, req.body.password)
    const tokens = Tokens.create({id: response.candidate.id, username: response.candidate.username, links: response.candidate.links})
    await User.writeToken(response.candidate.id, tokens.tokenR, "token1")
    const data = Tokens.verify(tokens.tokenR)
    data.token = tokens.tokenR
    res.send(data)
  }catch(err){
    console.log(err.message)
    res.send({message: false})
  }
})

router.post("/tokens", async (req, res) => {
  const response = Tokens.verify(req.cookies.token, req.body.tokenA)
  console.log(typeof response )
  if(typeof response === Object){
    res.send(Tokens.verify(req.body.tokenR))
  }else{
    res.send({message: false})
  }
})

module.exports = router