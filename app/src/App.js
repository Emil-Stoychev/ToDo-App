import styles from './App.module.css';
import { Routes, Route } from 'react-router-dom'
import { lazy, Suspense, useEffect, useRef, useState } from 'react';

import { io } from 'socket.io-client'
import { Navigation } from './core/navigation/Navigation';
import { Footer } from './core/footer/Footer';

import { LoadingSpinner } from './components/loadingSpinner/LoadingSpinner';

import Home from './components/home/Home.js'
const LazyLoginComponent = lazy(() => import('./components/login/Login.js'))
const LazyRegisterComponent = lazy(() => import('./components/register/Register.js'))
const LazyAboutComponent = lazy(() => import('./components/about/About.js'))
const LazyCreateComponent = lazy(() => import('./components/create/Create.js'))
const LazyProfileComponent = lazy(() => import('./components/profile/Profile.js'))
const LazyFAQComponent = lazy(() => import('./components/faq/FAQ.js'))

function App() {
  const [user, setUser] = useState(null)


  return (
    <div className={styles.app}>
      <Navigation />

      <main className={styles.mainContainer}>
        <Routes>

          {user == null
            ?
            <>
              <Route path='/' element={<Home />} />

              <Route path='/login' element={<Suspense fallback={<LoadingSpinner />}><LazyLoginComponent /></Suspense>} />

              <Route path='/register' element={<Suspense fallback={<LoadingSpinner />}><LazyRegisterComponent /></Suspense>} />
            </>
            :
            <>
              <Route path='/create' element={<Suspense fallback={<LoadingSpinner />}><LazyCreateComponent /></Suspense>} />

              <Route path='/profile' element={<Suspense fallback={<LoadingSpinner />}><LazyProfileComponent /></Suspense>} />
            </>
          }

          <Route path='/about' element={<Suspense fallback={<LoadingSpinner />}><LazyAboutComponent /></Suspense>} />

          <Route path='/FAQ' element={<Suspense fallback={<LoadingSpinner />}><LazyFAQComponent /></Suspense>} />

        </Routes>
      </main>


      <Footer />
    </div>
  );
}

export default App;
