import React from 'react'
import { useState } from 'react'

const AddMenuItem = (props) => {
  const [foods, setFoods] = useState([])

  const setFood = (e) => {
    setFoods(e.target.value)
  }
  return (
    <form onSubmit={props.submitForm}>
      <input
        type='text'
        placeholder='料理名'
        onChange={props.inputItemName}
        value={props.itemName}
      />
      <input type='text' placeholder='食材' onChange={props.inputItemName} value={props.itemName} />
      <div>{foods}</div>
      <button type='submit'>追加</button>
    </form>
  )
}

export default AddMenuItem
