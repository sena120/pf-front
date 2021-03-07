import React from 'react'
import styles from './Components.module.css'

const Category = (props) => {
  let select
  if (props.selectedCategory === props.category.id) {
    select = styles.selectedCategory
  } else {
    select = styles.category
  }

  let itemLength
  if (props.type === 'Menu') {
    itemLength = props.category.menuitems.length
  } else if (props.type === 'Food') {
    itemLength = props.category.fooditems.length
  } else if (props.type === 'Buy') {
    itemLength = props.category.buyitems.length
  }
  return (
    <li
      className={select}
      key={props.category.id}
      onClick={() => props.changeCategory(props.category.id, props.type)}
    >
      {props.category.category}({itemLength})
    </li>
  )
}

export default Category
