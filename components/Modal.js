import React from 'react'
import styles from './Components.module.css'
import { useState, useEffect } from 'react'
import ModalCategory from './ModalCategory'
import axios from 'axios'

const Modal = (props) => {
  const [newCategoryName, setNewCategoryName] = useState('')

  let isMount = false
  useEffect(() => {
    isMount = true
  }, [])

  //フォームに入力された値をセット
  const inputCategoryName = (e) => {
    setNewCategoryName(e.target.value)
  }

  //カテゴリーを追加する処理
  const submitForm = async (e) => {
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
      .post('http://localhost:3001/' + listType, {
        category: newCategoryName,
        user_id: props.userId,
      })
      .then((results) => {
        props.changeListsState(results.data.data)
      })
      .catch((data) => {
        console.log(data)
      })

    isMount ? setNewCategoryName('') : null
  }

  //カテゴリーを削除する処理
  const destroyCategory = async (id) => {
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
      .delete(`http://localhost:3001/${listType}/${id}`, { params: { user_id: props.userId } })
      .then((results) => {
        props.changeListsState(results.data.data)
      })
      .catch((data) => {
        console.log(data)
      })
  }

  return (
    <div className={styles.modal}>
      <form className={styles.modalForm} onSubmit={submitForm}>
        <input
          className={styles.modalAddInput}
          onChange={inputCategoryName}
          value={newCategoryName}
        />
        <button type='submit' className={styles.editButton}>
          追加
        </button>
      </form>
      <ul className={styles.modalUl}>
        {props.listData.map((category, index) => {
          return (
            <ModalCategory
              key={index}
              category={category}
              type={props.type}
              userId={props.userId}
              destroyCategory={destroyCategory}
              changeListsState={props.changeListsState}
            />
          )
        })}
      </ul>
      <button onClick={props.toggleModal}>閉じる</button>
    </div>
  )
}

export default Modal