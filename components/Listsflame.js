import React from "react"
import { useState } from "react"
import Category from "./Categoty"
import styles from "./Components.module.css"
import { Tab, Tabs, TabList, TabPanel } from "react-tabs"
import Panels from "./Panels"
import "react-tabs/style/react-tabs.css"

const Listsflame = (props) => {
  const [tabIndex, setTabIndex] = useState(0)

  return (
    <div className={styles.listsContainer}>
      <h3 className={styles.listTitle}>{props.type}</h3>
      <Tabs selectedIndex={tabIndex} onSelect={(index) => setTabIndex(index)}>
        <TabList>
          {props.categorys.map((category) => {
            return (
              // eslint-disable-next-line react/jsx-key
              <Tab onClick={() => props.select(category.id)}>
                <Category category={category} select={props.select} />
              </Tab>
            )
          })}
        </TabList>

        {props.categorys.map((category) => {
          let items
          if (props.type === "Food") {
            items = category.fooditems
          }
          if (props.type === "Buy") {
            items = category.buyitems
          }

          return (
            // eslint-disable-next-line react/jsx-key
            <TabPanel>
              <Panels
                items={items}
                add={props.add}
                selectCategory={props.selectCategory}
              />
            </TabPanel>
          )
        })}
      </Tabs>
    </div>
  )
}

export default Listsflame
