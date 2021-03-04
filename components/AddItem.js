import React from 'react'
import { useState } from 'react'
import axios from 'axios'

const AddItem = (props) => {
  const [itemName, setItemName] = useState('')
  const categoryId = props.selectedCategory

  const inputItemName = (e) => {
    setItemName(e.target.value)
  }

  const but = (e) => {
    e.preventDefault()
    console.log(itemName)
  }

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
    }
    axios
      .post('http://localhost:3001/' + listType, params)
      .then((results) => {
        console.log(results.data.data)
        props.changeListsState(results.data.data)
        // const newItems = props.items.slice()
        // newItems.push(results.data)
        // console.log(newItems)
        // props.changeItems(newItems, 'post')
      })
      .catch((data) => {
        console.log(data)
      })

    setItemName('')
  }

  if (props.add && props.type === props.selectedList) {
    if (props.type === 'Food') {
      return (
        <form onSubmit={submitForm}>
          <input type='text' placeholder='food' onChange={inputItemName} value={itemName} />
          <button type='submit'>追加</button>
        </form>
      )
    }
    if (props.type === 'Buy') {
      return (
        <div>
          <input type='text' onChange={inputItemName} placeholder='buy' />
          <button onClick={but}>aa</button>
        </div>
      )
    }
  }
  return null
}

export default AddItem
