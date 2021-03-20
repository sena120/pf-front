import Link from 'next/link'
import React from 'react'
import Header from '../../components/Header'
import styles from '../../styles/utils.module.css'

const about = () => {
  return (
    <div>
      <Header />
      <div className={styles.about}>
        <h4>Foodlistは家庭の食材管理、こんだて決め、買う物の管理ができるアプリケーションです。</h4>
      </div>
      <div className={styles.toLoginOrSignup}>
        <Link href='/signup'>
          <a className={styles.userlink}>新規登録</a>
        </Link>
        <Link href='/login'>
          <a className={styles.userlink}>ログインする</a>
        </Link>
      </div>
    </div>
  )
}

export default about
