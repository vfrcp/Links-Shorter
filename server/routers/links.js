const {Router} = require("express")
const router = Router()
const { nanoid } = require("nanoid")

const User = require("../models/user")
const Tokens = require("../models/tokens")
const user = require("../models/user")

router.post("/create", async (req, res) => {
  try{
    const id = nanoid()
    const data = await User.addLink(req.body.id, id, req.body.name, req.body.link)
    data.token = Tokens.create({id: req.body.id, username: data.username})
    User.rewriteToken(data.id, data.token, req.body.prevToken)
    res.send({id: req.body.id, username: data.username, links: data.links, token: data.token.tokenR})
  }catch(err){
    console.log(err.message)
    res.send({message: false})
  }
})
router.post("/get", async (req, res) => {
  try{
    const data = await User.findById(req.body.id)
    if(data){
      data.token = Tokens.create({id: req.body.id, username: data.username})
      await User.rewriteToken(data.id, req.body.prevToken, data.token.tokenR)
      res.send({token: data.token.tokenR, links: data.links})
    }else{
      res.send({message: false})
    }
  }catch(err){
    console.log("here") 
    console.log(err.message)
  }
})

router.get("/:id", async (req, res) => {
  const response = await user.findLink(req.params.id)
  res.redirect(response.link)
})


module.exports = router
