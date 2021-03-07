import React from 'react'
import { useState } from 'react'
import axios from 'axios'
import AddMenuItem from './AddMenuItem'

const AddItem = (props) => {
  const [itemName, setItemName] = useState('')
  const categoryId = props.selectedCategory

  const inputItemName = (e) => {
    setItemName(e.target.value)
  }

  const date = new Date()
  const yyyy = date.getFullYear()
  const mm = ('0' + (date.getMonth() + 1)).slice(-2)
  const dd = ('0' + date.getDate()).slice(-2)

  const submitForm = (e) => {
    e.preventDefault()
    let listType
    let params
    if (props.type === 'Menu') {
      listType = 'menuitems'
    }
    if (props.type === 'Food') {
      listType = 'fooditems'
      params = { item: itemName, foodlist_id: categoryId, userId: props.userId }
    }
    if (props.type === 'Buy') {
      listType = 'buyitems'
      params = { item: itemName, buylist_id: categoryId, userId: props.userId }
    }
    axios
      .post('http://localhost:3001/' + listType, params)
      .then((results) => {
        console.log(results)
        props.changeListsState(results.data.data)
      })
      .catch((data) => {
        console.log(data)
      })

    setItemName('')
  }

  //リストに合わせた追加フォーム
  if (props.add && props.type === props.selectedList) {
    if (props.type === 'Menu') {
      return (
        <li>
          <AddMenuItem submitForm={submitForm} inputItemName={inputItemName} itemName={itemName} />
        </li>
      )
    } else {
      return (
        <li>
          <form onSubmit={submitForm}>
            <input type='text' onChange={inputItemName} value={itemName} />
            <input type='date' defaultValue={`${yyyy}-${mm}-${dd}`} />
            <button type='submit'>追加</button>
          </form>
        </li>
      )
    }
  }
  return null
}

export default AddItem
