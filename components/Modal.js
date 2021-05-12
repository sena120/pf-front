import React from 'react'
import styles from './Components.module.css'
import { useState, useEffect } from 'react'
import ModalCategory from './ModalCategory'
import axios from 'axios'

const Modal = (props) => {
  const [newCategoryName, setNewCategoryName] = useState('')
  const [canSubmit, setCanSubmit] = useState(true) //連打したとしても、リクエストを1回だけにする
  const [isMount, setIsMount] = useState(false)

  useEffect(() => {
    setIsMount(true)
  }, [])

  //フォームに入力された値をセット
  const inputCategoryName = (e) => {
    setNewCategoryName(e.target.value)
  }

  //カテゴリーを追加する処理
  const submitForm = async (e) => {
    e.preventDefault()
    if (canSubmit) {
      setCanSubmit(false)
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
        .post(`${process.env.RAILS_API}` + listType, {
          category: newCategoryName,
          user_id: props.userId,
        })
        .then((results) => {
          props.changeListsState(results.data.data)
        })
        .catch((data) => {
          console.log(data)
        })
    }
    return
  }

  //カテゴリーを削除する処理
  const destroyCategory = async (id) => {
    if (props.listData.length === 1) {
      return
    } else {
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

      const listData = props.listData.slice()
      const categoryIndex = props.listData.findIndex((category) => category.id === id)

      await axios
        .delete(`${process.env.RAILS_API}${listType}/${id}`, { params: { user_id: props.userId } })
        .then((results) => {
          if (results.status === 200) {
            listData.splice(categoryIndex, 1)
            props.changeListsState(listData)
          }
          return
        })
        .catch((data) => {
          console.log(data)
        })

      if (props.selectedCategory === id) {
        props.changeCategory(listData[categoryIndex - 1].id, props.type)
      }
    }
  }

  return (
    <div className={styles.modal}>
      <form className={styles.modalForm} onSubmit={submitForm}>
        <input
          className={styles.modalAddInput}
          onChange={inputCategoryName}
          value={newCategoryName}
          required
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
