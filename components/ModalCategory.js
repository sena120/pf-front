import React from 'react'
import styles from './Components.module.css'
import { useState } from 'react'
import axios from 'axios'

const ModalCategory = (props) => {
  const [categoryName, setCategoryName] = useState(props.category.category)

  //フォームに入力された値をセット
  const inputCategoryName = (e) => {
    setCategoryName(e.target.value)
  }

  //カテゴリー名の変更を処理する
  const submitNewCategory = async (e) => {
    e.preventDefault()
    let listType
    if (props.type === 'Menu') {
      listType = 'menulists'
    }
    if (props.type === 'Food') {
      listType = 'foodlists'
    }
    if (props.type === 'Buy') {
      listType = 'buylists'
    }
    await axios
      .patch(`${process.env.RAILS_API}${listType}/${props.category.id}`, {
        category: categoryName,
        user_id: props.userId,
      })
      .then((results) => {
        props.changeListsState(results.data.data)
      })
      .catch((data) => {
        console.log(data)
      })
  }

  return (
    <li className={styles.modalItem}>
      <form onSubmit={submitNewCategory}>
        <input
          onChange={inputCategoryName}
          defaultValue={categoryName}
          className={styles.modalItemInput}
        />
      </form>
      <button onClick={() => props.destroyCategory(props.category.id)}>削除</button>
    </li>
  )
}

export default ModalCategory
