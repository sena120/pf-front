import React from 'react'
import styles from './Components.module.css'
import { useState, useEffect } from 'react'
import axios from 'axios'

const Item = (props) => {
  const [itemName, setItemName] = useState(props.item.item) //アイテム編集ホームにい入力された文字

  //チェック済みのアイテムを削除予定のアイテムに追加
  useEffect(() => {
    const isExits = props.deleteItems.includes(props.item.id)
    if (props.item.checked === true) {
      if (!isExits) {
        props.deleteItems.push(props.item.id)
      }
    }
  }, [])

  //フォームに入力された値をセット
  const inputItemName = (e) => {
    e.preventDefault()
    setItemName(e.target.value)
  }

  //削除予定のアイテムを更新する
  const setDelete = (id) => {
    if (props.item.checked === false) {
      props.deleteItems.push(id)
    } else {
      const findId = (element) => element === id
      const idIndex = props.deleteItems.findIndex(findId)
      props.deleteItems.splice(idIndex, 1)
    }
    console.log(props.deleteItems)

    //API側でもcheckboxを更新する
    let listType
    let params
    if (props.type === 'Menu') {
      listType = 'menuitems'
      params = { item: itemName, checked: !props.item.checked }
    }
    if (props.type === 'Food') {
      listType = 'fooditems'
      params = { item: itemName, checked: !props.item.checked }
    }
    if (props.type === 'Buy') {
      listType = 'buyitems'
      params = { item: itemName, checked: !props.item.checked }
    }
    axios
      .patch(`http://localhost:3001/${listType}/${props.item.id}`, params)
      .then((results) => {
        console.log(results)
        props.item.checked = !props.item.checked
      })
      .catch((data) => {
        console.log(data)
      })
  }

  //アイテムの変更を処理する
  const submitNewItems = (e) => {
    e.preventDefault()
    let listType
    let params
    if (props.type === 'Menu') {
      listType = 'menuitems'
      params = { item: itemName, checked: props.item.checked }
    }
    if (props.type === 'Food') {
      listType = 'fooditems'
      params = { item: itemName, checked: props.item.checked }
    }
    if (props.type === 'Buy') {
      listType = 'buyitems'
      params = { item: itemName, checked: props.item.checked }
    }
    axios
      .patch(`http://localhost:3001/${listType}/${props.item.id}`, params)
      .then((results) => {
        console.log(results)
        Object.assign(
          props.items.find((item) => item.id === props.item.id),
          results.data
        )
      })
      .catch((data) => {
        console.log(data)
      })
  }

  //各アイテム
  if (props.type === 'Menu') {
    return (
      <li className={styles.item}>
        <form onSubmit={submitNewItems}>
          <input type='text' defaultValue={itemName} onChange={inputItemName} />
          <button>🛍</button>
          <input
            type='checkbox'
            onClick={() => setDelete(props.item.id)}
            defaultChecked={props.item.checked}
          />
        </form>
      </li>
    )
  } else {
    return (
      <li className={styles.item}>
        <form className={styles.itemFrom} onSubmit={submitNewItems}>
          <input
            className={styles.itemInput}
            type='text'
            defaultValue={itemName}
            onChange={inputItemName}
          />
          <input className={styles.itemDate} type='date' />
        </form>
        <button>🔍</button>
        <input
          type='checkbox'
          onClick={() => setDelete(props.item.id)}
          defaultChecked={props.item.checked}
        />
      </li>
    )
  }
}

export default Item
