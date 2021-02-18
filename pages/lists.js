import React from 'react'
import { useEffect, useState } from 'react'
import Header from '../components/Header'
import axios from 'axios'

const lists = () => {
  const [apiData, setApiData] = useState(null)

  useEffect(() => {
    axios.get('http://localhost:3001/users')
    .then((results) => {
      console.log(results)
      setApiData(results.data)
    })
    .catch((data) =>{
      console.log(data)
    })
  }, [])

  return (
    <div>
      <Header/>
      ここがリストだ
    </div>
  )
}

export default lists
