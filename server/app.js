require("dotenv").config()
const express = require("express")
const db = require("mongoose")
const bodyParser = require("body-parser")
const cookie = require("cookie-parser")
const cors = require("cors")

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use(cookie())
app.use(express.static("static"))

const auth = require("./routers/auth")
const links = require("./routers/links")

app.use("/auth", auth)
app.use("/links", links)

app.use((req, res) => {
  res.send("404")
})


const start = () => {
  try{
    app.listen(5000)
    db.connect(process.env.DB_LINK)
  }catch(err){
    console.log("don't conected")
  }
}

start()