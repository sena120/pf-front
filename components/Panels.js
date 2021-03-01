import React from "react"
import FoodItem from "./FoodItem"
import styles from "./Components.module.css"
import AddItem from "./AddItem"

const Panels = (props) => {
  // console.log(props.items)
  return (
    <div>
      <AddItem add={props.add} selectCategory={props.selectCategory} />
      <ul className={styles.ul}>
        {props.items.map((item, index) => {
          return <FoodItem item={item} key={index} />
        })}
      </ul>
    </div>
  )
}

export default Panels
