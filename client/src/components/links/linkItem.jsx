import React from "react"

export default function ListItem({index, name, link, clicks}){
  return(
    <div className="listItem">
      <div className="index">{index + 1}</div>
      <div className="name">Name: {name}</div>
      <div className="link">Link: <a href={"http://localhost:5000/links/" + link}>http://localhost:5000/links/{link}</a> </div>
      <div className="cliks">Clicks: {clicks}</div>
    </div>
  )
}