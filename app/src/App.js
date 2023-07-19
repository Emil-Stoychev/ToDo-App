import styles from './App.module.css';
import { Routes, Route } from 'react-router-dom'
import { lazy, Suspense, useEffect, useRef, useState } from 'react';

import { io } from 'socket.io-client'
import { Navigation } from './core/navigation/Navigation';
import { Footer } from './core/footer/Footer';

function App() {



  return (
    <div className={styles.app}>
      <Navigation />

      <main className={styles.mainContainer}>
        <Routes>


        </Routes>
      </main>


      <Footer />
    </div>
  );
}

export default App;
