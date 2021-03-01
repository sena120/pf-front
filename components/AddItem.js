import React from "react"

const AddItem = (props) => {
  if (!props.add) {
    return null
  }
  return <input type="text" />
}

export default AddItem
