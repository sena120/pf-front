import React from "react"
import styles from "./Components.module.css"

const FoodItem = (props) => {
  // console.log(props.item)
  return (
    <li className={styles.item}>
      <input type="text" defaultValue={props.item.item} />
      <button>🔍</button>
      <input type="checkbox" />
    </li>
  )
}

export default FoodItem
