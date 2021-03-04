import React from 'react'
import { useState } from 'react'
import Category from './Categoty'
import styles from './Components.module.css'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import Panel from './Panel'
import 'react-tabs/style/react-tabs.css'

const Listsflame = (props) => {
  const [tabIndex, setTabIndex] = useState(0)

  return (
    <div className={styles.listsContainer} onClick={() => props.changeList(props.type)}>
      <h3 className={styles.listTitle}>{props.type}</h3>

      {/* 各リストのカテゴリ */}
      <Tabs selectedIndex={tabIndex} onSelect={(index) => setTabIndex(index)}>
        <TabList>
          {props.listData.map((category) => {
            return (
              <Tab key={category.id} onClick={() => props.changeCategory(category.id)}>
                <Category category={category} />
              </Tab>
            )
          })}
        </TabList>

        {/* 各カテゴリに対応したアイテム */}
        {props.listData.map((category, index) => {
          let items
          if (props.type === 'Food') {
            items = category.fooditems
          } else if (props.type === 'Buy') {
            items = category.buyitems
          }
          return (
            <TabPanel key={index}>
              <Panel
                items={items}
                add={props.add}
                type={props.type}
                userId={props.userId}
                selectedList={props.selectedList}
                selectedCategory={props.selectedCategory}
                changeListsState={props.changeListsState}
              />
            </TabPanel>
          )
        })}
      </Tabs>
    </div>
  )
}

export default Listsflame
