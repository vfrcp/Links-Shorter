const db = require("mongoose")
const {Schema} = db

const userSchema = new Schema({
  id: String,
  username: String,
  email: String,
  password: String,
  links: Array,
  token1: {
      type: Object,
      default: null,
  },
  token2: {
      type: Object,
      default: null,
  },
  token3: {
      type: Object,
      default: null,
  },
  token4: {
      type: Object,
      default: null,
  },
  prevToken:{
      type: String,
      default: null,
  },
  restoreLink: {
      type: String,
      default: null,
  }
}, { versionKey: false })

const User = db.model("User", userSchema)

class user{
  static async findLink(id){
    const candidate = await User.findOne({"links.id": id})
    if(candidate){
      let index
      candidate.links.forEach((item, i) => {
        if(item.id == id){
          index = i
        }
      })
      candidate.links[index].clicks++
      candidate.markModified("links");
      await candidate.save()
      return candidate.links[index]
    }else{
      return false
    }
  }
  static async findById(id){
    const candidate = await User.findOne({id})
    if(candidate){
      return candidate
    }else{
      return {message: false}
    }
  }
  static async findUserbyRestoreLink(link){
    const candidate = await User.findOne({restoreLink: link})
    if(candidate){
        return {message:"reset"}
    }else{
        return {message:"invalid link"}
    }
  }
  static async registerUser(id, username, email, password){
    let candidate = await User.findOne({email})
    if(candidate){
      return {message:"exist email"}
    }else{
      candidate = await User.findOne({username})
      if(candidate){
          return {message:"exist username"}
      }else{
          const user = await new User({id, username, email, password})
          await user.save()
          return {message:"registered"}
      }
    }
  }
  static async loginUser(username, password){
    const candidate = await User.findOne({username})
    if(candidate){
      if(candidate.password == password){
          let token
          const tokensExpires = () => {
            switch(true){
              case ((Date.now() - +candidate.token1.date) > (4320000)): return "token1"
                  break
              case ((Date.now() - +candidate.token2.date) > (4320000)): return "token2"
                  break
              case ((Date.now() - +candidate.token3.date) > (4320000)): return "token3"
                  break
              case ((Date.now() - +candidate.token4.date) > (4320000)): return "token4"
                  break
            }
            if(candidate.prevToken == "token4"){
              return "token1"
            }
            return `token${+candidate.prevToken + 1}`
        }
        !candidate.token1 ? token = "token1" : !candidate.token2 ? token = "token2" :
        !candidate.token3 ? token = "token3" : !candidate.token4 ? token = "token4" : token = tokensExpires()
        
        await candidate.save()
        return {candidate, message:"logined", token}
      }else{
          return {message:"wrong password"}
      }
    }else{
        return {message:"not found"}
    }
  }
  static async writeToken(id, token, tokenCount){
    const candidate = await User.findOne({id})
    switch(tokenCount){
      case "token1": candidate.token1 = {token, date: new Date()} 
        candidate.prevToken = "token1"
        await candidate.save()
        break
      case "token2": candidate.token2 = {token, date: new Date()} 
        candidate.prevToken = "token2"
        await candidate.save()
        break
      case "token3": candidate.token3 = {token, date: new Date()} 
        candidate.prevToken = "token3"
        await candidate.save()
        break
      case "token4": candidate.token4 = {token, date: new Date()} 
        candidate.prevToken = "token4" 
        await candidate.save() 
        break
    }
  }
  static async rewriteToken(id, prevToken, newToken){
    const candidate = await User.findOne({id})
    console.log(candidate)
    if(candidate){
      let token1 
      let token2
      let token3
      let token4
      if(candidate.token1){token1 = candidate.token1.token}
      if(candidate.token2){token2 = candidate.token2.token}
      if(candidate.token3){token3 = candidate.token3.token}
      if(candidate.token4){token4 = candidate.token4.token}
      console.log("token1: ", token1, "token2: ", token2)
        switch(prevToken){
          case token1: candidate.token1 = {token: newToken, date: new Date()} 
            await candidate.save() 
            break
          case token2: candidate.token2 = {token: newToken, date: new Date()} 
            await candidate.save()
            break
          case token3: candidate.token3 = {token: newToken, date: new Date()} 
            await candidate.save()
            break
          case token4: candidate.token4 = {token: newToken, date: new Date()} 
            await candidate.save()
            break
          default: candidate.token2.token = {token: newToken, date: new Date()} 
          }
      }else{
          return {message: "wrong"}
      }
  }
  static async logout(id, token){
    const candidate = await User.findOne({id})
    if(candidate){
      switch(token){
        case candidate.token1.token: candidate.token1 = null
          await candidate.save() 
          break
        case candidate.token2.token: candidate.token2 = null
          await candidate.save()
          break
        case candidate.token3.token: candidate.token3 = null
          await candidate.save()
          break
        case candidate.token4.token: candidate.token4 = null
          await candidate.save()
          break
      }
    }
  }
  static async addLink(userId, id, name, link){
    const candidate = await User.findOne({id: userId})
    if(candidate){
      candidate.links.push({id, name, link, clicks: 0})
      await candidate.save()
      return candidate
    }else{
      return {message: false}
    }
  }

  static async restoreLink(email, link){
    const candidate = await User.findOne({email})
    if(candidate){
      candidate.restoreLink = link
      await candidate.save()
      return {message: "link created"}
    }else{
      return {message: "not exist"}
    }
  }
  static async restorePass(link, newPass){
    const candidate = await User.findOne({restoreLink: link})
    if(candidate){
      candidate.password = newPass
      candidate.restoreLink = null
      await candidate.save()
      return {message: "password changed"}
    }else{
      return{message: "not exist"}
    }
  }
}

module.exports = user