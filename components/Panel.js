import React from 'react'
import Item from './Item'
import styles from './Components.module.css'
import AddItem from './AddItem'
import { useState } from 'react'

const Panel = (props) => {
  // const [items, setItems] = useState(props.items)

  // const changeItems = (newItems, method) => {
  //   if (method === 'post') {
  //     console.log(newItems)
  //     setItems(newItems)
  //   } else if (method === 'patch') {
  //     // setItems(items)
  //     console.log(method)
  //   }
  //   console.log(items)
  // }

  return (
    <div>
      <AddItem
        items={props.items}
        add={props.add}
        type={props.type}
        userId={props.userId}
        // changeItems={changeItems}
        selectedList={props.selectedList}
        selectedCategory={props.selectedCategory}
        changeListsState={props.changeListsState}
      />
      <ul className={styles.ul}>
        {props.items.map((item) => {
          return (
            <Item
              item={item}
              // items={items}
              key={item.id}
              type={props.type}
              // changeItems={changeItems}
            />
          )
        })}
      </ul>
    </div>
  )
}

export default Panel
