import React from "react"
import { useEffect } from "react"
import Header from "../components/Header"
import axios from "axios"

const Test = () => {
  useEffect(() => {
    const u = "users"
    axios
      .get(`http://localhost:3001/${u}`, {
        params: { email: "test@co.jp" },
      })
      .then((results) => {
        console.log(results)
      })
      .catch((data) => {
        console.log(data)
      })
  }, [])

  return (
    <div>
      <Header />
      ここがリストだ
    </div>
  )
}

export default Test
