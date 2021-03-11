import React from 'react'
import Image from 'next/image'
import styles from './Components.module.css'
import { useState, useEffect } from 'react'
import axios from 'axios'

const Item = (props) => {
  const [itemName, setItemName] = useState(props.item.item) //アイテム編集ホームにい入力された文字
  const [food, setFood] = useState('')
  const [foods, setFoods] = useState(props.item.foods)
  const [accordionState, setAccordionState] = useState(false) //menuアイテムのアコーディオンの状態

  //チェック済みのアイテムを削除予定のアイテムに追加
  useEffect(() => {
    const isExist = props.deleteItems.includes(props.item.id)
    if (props.item.checked === true) {
      if (!isExist) {
        props.deleteItems.push(props.item.id)
      }
    }
  }, [])

  //フォームに入力された値をセット
  const inputItemName = (e) => {
    e.preventDefault()
    setItemName(e.target.value)
  }

  const inputFood = (e) => {
    setFood(e.target.value)
  }

  //Menuアイテムのfoodsを追加
  const addFood = (e) => {
    e.preventDefault()
    const newArray = foods.slice()
    newArray.push(food)
    setFoods(newArray)
    setFood('')
    upDateMenuItem(newArray)
  }

  //Menuアイテムのfoodsを削除
  const removeFood = (food) => {
    const findFood = (element) => element === food
    const idIndex = foods.findIndex(findFood)
    const newArray = foods.slice()
    newArray.splice(idIndex, 1)
    setFoods(newArray)
    upDateMenuItem(newArray)
  }

  //Menuアイテムのfoodsの変更を処理する
  const upDateMenuItem = (newArray) => {
    axios
      .patch(`http://localhost:3001/menuitems/${props.item.id}`, {
        item: itemName,
        foods: newArray,
        checked: props.item.checked,
      })
      .then((results) => {
        Object.assign(
          props.items.find((item) => item.id === props.item.id),
          results.data
        )
      })
      .catch((data) => {
        console.log(data)
      })
  }

  //削除予定のアイテムを更新する
  const setDelete = (id) => {
    if (props.item.checked === false) {
      props.deleteItems.push(id)
    } else {
      const idIndex = props.deleteItems.findIndex((element) => element === id)
      props.deleteItems.splice(idIndex, 1)
    }

    //API側でもcheckboxを更新する
    let listType
    let params
    if (props.type === 'Menu') {
      listType = 'menuitems'
      params = { item: itemName, foods: foods, checked: !props.item.checked }
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
      params = { item: itemName, foods: foods, checked: props.item.checked }
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
        Object.assign(
          props.items.find((item) => item.id === props.item.id),
          results.data
        )
        if (props.type !== 'Menu') {
          Object.assign(
            props.allItems.find((item) => item.id === props.item.id),
            results.data
          )
        }
      })
      .catch((data) => {
        console.log(data)
      })
  }

  //Menuアイテムのアコーディオンを開閉
  const toggleAccordion = () => {
    setAccordionState(!accordionState)
  }

  //Menuのアイテム
  if (props.type === 'Menu') {
    let menuStyles
    accordionState ? (menuStyles = styles.openMenuItem) : (menuStyles = styles.menuItem)

    let menuNameStyles
    let inputStyles
    let closedAccordionStyles
    if (props.item.foods.includes(props.searchWord)) {
      menuNameStyles = styles.mutchMenuName
      inputStyles = styles.muchInput
      closedAccordionStyles = styles.mutchClosedAccordion
    } else {
      menuNameStyles = styles.menuName
      inputStyles = styles.itemInput
      closedAccordionStyles = styles.closedAccordion
    }

    return (
      <li className={menuStyles}>
        <div className={menuNameStyles}>
          <form className={styles.itemForm} onSubmit={submitNewItems}>
            <input
              className={inputStyles}
              type='text'
              defaultValue={itemName}
              onChange={inputItemName}
            />
          </form>
          <span className={styles.itemButton}>
            <Image src='/買い物カゴのアイコン18.png' height={25} width={25} />
          </span>
          <input
            className={styles.checkBox}
            type='checkbox'
            onClick={() => setDelete(props.item.id)}
            defaultChecked={props.item.checked}
          />
        </div>

        {accordionState ? ( //アコーディオンが開かれたとき
          <div className={styles.editFoods}>
            <div className={styles.editFoodsTop}>
              <form className={styles.editForm} onSubmit={addFood}>
                <input type='text' onChange={inputFood} value={food} />
                <button className={styles.editButton} type='submit'>
                  追加
                </button>
              </form>
              <span onClick={toggleAccordion} className={styles.sankaku}>
                ▲
              </span>
            </div>

            <ul className={styles.Foods}>
              {foods.map((food, index) => {
                let foodStyles
                if (props.allFoodItems.find((item) => item.item === food)) {
                  foodStyles = styles.mutchOpenFood
                } else if (props.allBuyItems.find((item) => item.item === food)) {
                  foodStyles = styles.mutchOpenBuy
                }
                return (
                  <li className={styles.editFood} key={index}>
                    <div className={foodStyles}>{food}</div>
                    <div className={styles.removeFood} onClick={() => removeFood(food)}>
                      ×
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        ) : (
          //アコーディオンが閉じられているとき
          <div className={closedAccordionStyles} onClick={toggleAccordion}>
            <div className={styles.foodsArea}>
              {foods.map((food, index) => {
                let foodStyles
                if (props.allFoodItems.find((item) => item.item === food)) {
                  foodStyles = styles.mutchFood
                } else if (props.allBuyItems.find((item) => item.item === food)) {
                  foodStyles = styles.mutchBuy
                } else {
                  foodStyles = styles.food
                }
                return (
                  <span className={foodStyles} key={index}>
                    {food}
                  </span>
                )
              })}
            </div>
            <div className={styles.sankaku}>▼</div>
          </div>
        )}
      </li>
    )
  } //FoodとBuyのアイテム
  else {
    let itemStyle
    let inputStyles
    if (props.searchWord === props.item.item) {
      itemStyle = styles.muchItem
      inputStyles = styles.muchInput
    } else {
      itemStyle = styles.item
      inputStyles = styles.itemInput
    }
    return (
      <li className={itemStyle}>
        <form className={styles.itemForm} onSubmit={submitNewItems}>
          <input
            className={inputStyles}
            type='text'
            required
            defaultValue={itemName}
            onChange={inputItemName}
          />
          {/* <input className={styles.itemDate} type='date' /> */}
        </form>
        <span className={styles.itemButton} onClick={() => props.actionButton(props.item.item)}>
          <Image src='/icon_139170_256.png' height={20} width={20} />
        </span>
        <input
          className={styles.checkBox}
          type='checkbox'
          onClick={() => setDelete(props.item.id)}
          defaultChecked={props.item.checked}
        />
      </li>
    )
  }
}

export default Item
