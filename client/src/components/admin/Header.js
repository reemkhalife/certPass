// Header.js
import React, { useState, useContext, useEffect } from 'react';
import styles from './Header.module.css';
import AuthContext from '../../context/AuthContext';

export default function Header() {
  const {logoutHandler} = useContext(AuthContext);

  return (
    <header className={styles.header}>
      <h1>Welcome <span>User</span></h1>
      <div className={styles.actions}>
        <i className="fa fa-user"></i>
      </div>
      <button onClick={logoutHandler}>Logout</button>
    </header>
  );
}
