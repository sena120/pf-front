import React from 'react'
import Item from './Item'
import styles from './Components.module.css'
import AddItem from './AddItem'
import { useState } from 'react'

const Panel = (props) => {
  if (props.categoryId === props.selectedCategory) {
    return (
      <div className={styles.panel}>
        <ul className={styles.ul}>
          <AddItem
            items={props.items}
            add={props.add}
            type={props.type}
            userId={props.userId}
            selectedList={props.selectedList}
            selectedCategory={props.selectedCategory}
            changeListsState={props.changeListsState}
          />
          {props.items.map((item) => {
            return (
              <Item
                item={item}
                items={props.items}
                key={item.id}
                type={props.type}
                deleteItems={props.deleteItems}
              />
            )
          })}
        </ul>
      </div>
    )
  }
  return null
}

export default Panel
