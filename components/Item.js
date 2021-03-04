import React from 'react'
import styles from './Components.module.css'
import { useState } from 'react'
import axios from 'axios'

const Item = (props) => {
  const [itemName, setItemName] = useState(props.item.item) //Item編集ホームにい入力された文字を管理

  const inputItemName = (e) => {
    e.preventDefault()
    setItemName(e.target.value)
  }

  //Itemの変更を処理する
  const submitNewItems = (e) => {
    e.preventDefault()
    let listType
    let params
    if (props.type === 'Menu') {
      listType = 'menuitems'
    }
    if (props.type === 'Food') {
      listType = 'fooditems'
      params = { item: itemName }
    }
    if (props.type === 'Buy') {
      listType = 'buyitems'
      params = { item: itemName }
    }
    axios
      .patch(`http://localhost:3001/${listType}/${props.item.id}`, params)
      .then((results) => {
        console.log(results)
        Object.assign(
          props.items.find((item) => item.id === props.item.id),
          results.data
        )
        props.changeItems(props.items, 'patch')
      })
      .catch((data) => {
        console.log(data)
      })
  }

  return (
    <li className={styles.item}>
      <form onSubmit={submitNewItems}>
        <input type='text' defaultValue={itemName} onChange={inputItemName} />
        <button>🔍</button>
        <input type='checkbox' />
      </form>
    </li>
  )
}

export default Item
