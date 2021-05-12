import React from 'react'
import { useState } from 'react'
import axios from 'axios'
import styles from './Components.module.css'

const AddItem = (props) => {
  const [itemName, setItemName] = useState('')
  const [food, setFood] = useState('')
  const [newFoods, setNewFoods] = useState([])
  const [canSubmit, setCanSubmit] = useState(true) //連打したとしても、リクエストを1回だけにする
  const categoryId = props.selectedCategory

  //フォームに入力された文字を値をセット
  const inputItemName = (e) => {
    setItemName(e.target.value)
  }
  const inputFood = (e) => {
    setFood(e.target.value)
  }

  //新しく作るMneuアイテムのfoodを追加
  const addFood = (e) => {
    e.preventDefault()
    const newArray = newFoods.slice()
    newArray.push(food)
    setNewFoods(newArray)
    setFood('')
  }

  //新しく作るMenuアイテムのfoodを削除
  const removeFood = () => {
    const findFood = (element) => element === food
    const idIndex = newFoods.findIndex(findFood)
    const newArray = newFoods.slice()
    newArray.splice(idIndex, 1)
    setNewFoods(newArray)
  }

  const checkFoods = () => {
    if (newFoods.length < 1) {
      alert('食材を1つ以上追加してください。')
      return false
    } else {
      return true
    }
  }

  const date = new Date()
  const yyyy = date.getFullYear()
  const mm = ('0' + (date.getMonth() + 1)).slice(-2)
  const dd = ('0' + date.getDate()).slice(-2)

  //アイテムを追加する処理
  const submitForm = async (e) => {
    e.preventDefault()
    if (canSubmit) {
      setCanSubmit(false)
      let listType
      let params
      if (props.type === 'Menu') {
        if (checkFoods() === false) {
          setCanSubmit(true)
          return
        } else {
          listType = 'menuitems'
          params = { item: itemName, foods: newFoods, menulist_id: categoryId }
        }
      } else if (props.type === 'Food') {
        listType = 'fooditems'
        params = { item: itemName, foodlist_id: categoryId }
      } else if (props.type === 'Buy') {
        listType = 'buyitems'
        params = { item: itemName, buylist_id: categoryId }
      }
      await axios
        .post(`${process.env.RAILS_API}` + listType, params)
        .then((results) => {
          const listData = props.listData.slice()
          const categoryIndex = props.listData.findIndex(
            (category) => category.id === props.selectedCategory
          )
          listData[categoryIndex][`${listType}`].push(results.data.data)
          props.changeListsState(listData)
        })
        .catch((data) => {
          console.log(data)
        })

      setItemName('')
      setNewFoods([])
      setCanSubmit(true)
    }
    return
  }

  //リストに合わせた追加フォーム
  if (props.type === props.selectedList) {
    //Menuのフォーム
    if (props.type === 'Menu') {
      let liState
      if (props.add) {
        liState = styles.addMenu
        if (newFoods.length !== 0) {
          liState = styles.existFoodAddMenu
        }
      } else {
        liState = styles.closedAddMenu
      }
      return (
        <li className={liState}>
          {props.add ? (
            <>
              <form className={styles.addMenuForm} onSubmit={submitForm}>
                <input
                  className={styles.addInput}
                  autoFocus
                  required
                  type='text'
                  placeholder='料理名'
                  onChange={inputItemName}
                  value={itemName}
                />
                <button className={styles.addButton} type='submit'>
                  追加
                </button>
              </form>
              <form className={styles.addMenuForm} onSubmit={addFood}>
                <input
                  className={styles.addInput}
                  type='text'
                  required
                  placeholder='食材'
                  onChange={inputFood}
                  value={food}
                />
                <button className={styles.addButton} type='submit'>
                  追加
                </button>
              </form>
            </>
          ) : null}

          <ul className={styles.Foods}>
            {newFoods.map((newfood, index) => {
              return (
                <li className={styles.addFood} key={index}>
                  <div>{newfood}</div>
                  <div className={styles.removeFood} onClick={removeFood}>
                    ×
                  </div>
                </li>
              )
            })}
          </ul>
        </li>
      )
    } //FoodとBuyのフォーム
    else {
      let liState
      props.add ? (liState = styles.add) : (liState = styles.closedAdd)
      return (
        <li className={liState}>
          {props.add ? (
            <form className={styles.addForm} onSubmit={submitForm}>
              <input
                className={styles.addInput}
                type='text'
                autoFocus={true}
                required
                onChange={inputItemName}
                value={itemName}
              />
              {/* <input type='date' defaultValue={`${yyyy}-${mm}-${dd}`} /> */}
              <button className={styles.addButton} type='submit'>
                追加
              </button>
            </form>
          ) : null}
        </li>
      )
    }
  }
  return null
}

export default AddItem
