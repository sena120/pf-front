import React from 'react'
import styles from './Components.module.css'
import { useState } from 'react'

const MenuItem = () => {
  return (
    <li className={styles.menuItem}>
      <form onSubmit={submitNewItems}>
        <input type='text' defaultValue={itemName} onChange={inputItemName} />
      </form>
      <button>🛍</button>
      <input
        type='checkbox'
        onClick={() => setDelete(props.item.id)}
        defaultChecked={props.item.checked}
      />
      <ul>
        {props.item.foods.map((food, index) => {
          return <li key={index}>{food}</li>
        })}
      </ul>
    </li>
  )
}

export default MenuItem
