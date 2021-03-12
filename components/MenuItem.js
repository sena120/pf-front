import React from 'react'
import styles from './Components.module.css'
import { useState, useEffect } from 'react'

const MenuItem = (props) => {
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
  const upDateMenuItem = async (newArray) => {
    await axios
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
}

export default MenuItem
