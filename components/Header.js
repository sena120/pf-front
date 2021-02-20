import Link from 'next/link'
import React from 'react'
import styles from './Header.module.css'

const Header = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>foodlist</h1>

      <div className={styles.routes}>
        <Link href="/header/about">
        <a className={styles.rout}>About</a>
        </Link>

        <Link href="/header/help">
          <a className={styles.rout}>Help</a>
        </Link>
      </div>
    </div>
  )
}

export default Header
