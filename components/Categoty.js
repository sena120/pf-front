import React from "react"

const FoodCategoty = (props) => {
  const ctname = props.category.category
  const userid = props.category.user_id
  // console.log(userid)

  return <div>{ctname}</div>
}

export default FoodCategoty