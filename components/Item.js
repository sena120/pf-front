import React from 'react'
import Image from 'next/image'
import styles from './Components.module.css'
import { useState, useEffect } from 'react'
import axios from 'axios'

const Item = (props) => {
  const [itemName, setItemName] = useState(props.item.item) //アイテム編集ホームにい入力された文字
  const [food, setFood] = useState('')
  const [foods, setFoods] = useState(props.item.foods)
  const [toBuy, setToBuy] = useState([])
  const [accordionState, setAccordionState] = useState(false) //menuアイテムのアコーディオンの状態
  const [canPushButton, setCanPushButton] = useState(true)
  const [isMount, setIsMount] = useState(false)

  useEffect(() => {
    setIsMount(true)
  }, [])

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

  //Menuアイテムから作る新しいBuyアイテムを更新
  if (props.type === 'Menu') {
    useEffect(() => {
      props.item.foods.map((fod) => {
        if (
          !props.allFoodItems.some((item) => item.item === fod) &&
          !props.allBuyItems.some((item) => item.item === fod)
        ) {
          if (toBuy.some((item) => item.item === fod)) {
            Object.assign(
              toBuy.find((item) => item.item === fod),
              { item: fod, buylist_id: props.selectedBuyCategory }
            )
          } else {
            toBuy.push({ item: fod, buylist_id: props.selectedBuyCategory })
          }
        } else {
          if (toBuy.some((item) => item.item === fod)) {
            const toBuyIndex = toBuy.findIndex((item) => item.item === fod)
            toBuy.splice(toBuyIndex, 1)
          }
        }
      })
    }, [props.selectedBuyCategory, props.allFoodItems, props.allBuyItems])
  }

  //Menuアイテムのリストに存在しないfoodsをBuyリストに追加
  const createNewBuyItems = async () => {
    if (canPushButton) {
      setCanPushButton(false)
      toBuy.map((buy) => {
        axios
          .post(`${process.env.RAILS_API}buyitems/`, {
            item: buy.item,
            buylist_id: buy.buylist_id,
          })
          .then((results) => {
            props.changeListsState(results.data.data, 'addBuyFromMenu')
          })
          .catch((data) => {
            console.log(data)
          })
      })
      setToBuy([])
      setCanPushButton(true)
    }
  }

  //クリックされたMenuアイテムのfoodをBuyリストに追加
  const addBuyItem = (itemName) => {
    if (canPushButton) {
      setCanPushButton(false)
      axios
        .post(`${process.env.RAILS_API}buyitems/`, {
          item: itemName,
          buylist_id: props.selectedBuyCategory,
        })
        .then((results) => {
          props.changeListsState(results.data.data, 'addBuyFromMenu')
        })
        .catch((data) => {
          console.log(data)
        })
      setCanPushButton(true)
    }
  }

  //Menuアイテムのfoodsを追加
  const addFood = (e) => {
    e.preventDefault()
    toBuy.push({ item: food, buylist_id: props.selectedBuyCategory })
    const newArray = foods.slice()
    newArray.push(food)
    setFoods(newArray)
    setFood('')
    upDateMenuItem(newArray)
  }

  //Menuアイテムのfoodsを削除
  const removeFood = (food) => {
    const findFood = (element) => element === food

    const toBuyIndex = toBuy.findIndex(findFood)
    toBuy.splice(toBuyIndex, 1)

    const idIndex = foods.findIndex(findFood)
    const newArray = foods.slice()
    newArray.splice(idIndex, 1)
    setFoods(newArray)
    upDateMenuItem(newArray)
  }

  //Menuアイテムのfoodsの変更を処理する
  const upDateMenuItem = async (newArray) => {
    await axios
      .patch(`${process.env.RAILS_API}menuitems/${props.item.id}`, {
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

  //BuyリストからFoodリストに追加し、自身を削除する
  const addToFoodList = () => {
    if (canPushButton) {
      setCanPushButton(false)
      axios
        .all([
          axios.post(`${process.env.RAILS_API}fooditems`, {
            item: props.item.item,
            foodlist_id: props.selectedFoodCategory,
            user_id: props.userId,
          }),
          axios.delete(`${process.env.RAILS_API}buyitems/` + props.item.id, {
            params: { ids: props.item.id, user_id: props.userId },
          }),
        ])
        .then(
          axios.spread((postData, deleteData) => {
            props.changeListsState(postData.data.data, 'addFoodFromBuy')
            props.changeListsState(deleteData.data.data, 'deleteBuy')
          })
        )
        .catch((data) => {
          console.log(data)
        })
      setCanPushButton(true)
    }
  }

  //削除予定のアイテムを更新する
  const setDelete = async (id) => {
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
    await axios
      .patch(`${process.env.RAILS_API}${listType}/${props.item.id}`, params)
      .then(() => {
        props.item.checked = !props.item.checked
      })
      .catch((data) => {
        console.log(data)
      })
  }

  //アイテム名の変更を処理する
  const submitNewItems = async (e) => {
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
    await axios
      .patch(`${process.env.RAILS_API}${listType}/${props.item.id}`, params)
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
    let editFoodsStyles
    if (props.item.foods.includes(props.searchWord)) {
      menuNameStyles = styles.mutchMenuName
      inputStyles = styles.muchInput
      closedAccordionStyles = styles.mutchClosedAccordion
      editFoodsStyles = styles.mutchEditFoods
    } else {
      menuNameStyles = styles.menuName
      inputStyles = styles.itemInput
      closedAccordionStyles = styles.closedAccordion
      editFoodsStyles = styles.editFoods
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
          <span className={styles.itemButton} onClick={createNewBuyItems}>
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
          <div className={editFoodsStyles}>
            <div className={styles.editFoodsTop}>
              <form className={styles.editForm} onSubmit={addFood}>
                <input type='text' required onChange={inputFood} value={food} />
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
                } else {
                  foodStyles = styles.openFood
                }
                return (
                  <li className={styles.editFood} key={index}>
                    <div className={foodStyles} onClick={() => addBuyItem(food)}>
                      {food}
                    </div>
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
                if (props.allFoodItems.some((item) => item.item === food)) {
                  foodStyles = styles.mutchFood
                } else if (props.allBuyItems.some((item) => item.item === food)) {
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
  } //Foodのアイテム
  else if (props.type === 'Food') {
    const ActionBUtton = () => {
      if (props.searchWord !== props.item.item) {
        return (
          <span className={styles.itemButton} onClick={() => props.searchButton(props.item.item)}>
            <Image src='/icon_139170_256.png' height={20} width={20} />
          </span>
        )
      } else {
        return (
          <span className={styles.itemButton} onClick={() => props.searchButton('')}>
            <Image src='/ノーマルの太さのバツアイコン.png' height={18} width={18} />
          </span>
        )
      }
    }
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
        <ActionBUtton />
        <input
          className={styles.checkBox}
          type='checkbox'
          onClick={() => setDelete(props.item.id)}
          defaultChecked={props.item.checked}
        />
      </li>
    )
  } //Buyのアイテム
  else if (props.type === 'Buy') {
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
        <span className={styles.itemButton} onClick={addToFoodList}>
          <Image src='/返信矢印1.png' height={20} width={20} />
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
