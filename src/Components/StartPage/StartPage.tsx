import React, { useState } from 'react';
import styles from '../../styles/StartPage.module.scss';
import MiniLoader from '../MiniLoader/MiniLoader';
import Link from 'next/link';
import Head from 'next/head';


type Props = {
  onLogin: (email: string, password: string) => void;
  loading: boolean;
};

const StartPage: React.FC<Props> = ({ onLogin, loading }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Будь ласка, введіть email та пароль');
      return;
    }
    setError('');
    onLogin(email, password);
  };

  return (
    <>
      <Head>
        <title>Вхід клієнта | Lavanda Studio</title>
      </Head>
      <div className={styles.startPage}>
        <div className={styles.startPageBackground} />
        <div className={styles.startPageContainer}>
          <img className={styles.logo} src="logo.PNG" alt="logo" />
          <h1 className={styles.title}>Ласкаво просимо до <br /> Lavanda Studio</h1>
          <p className={styles.slogan}>Увійдіть, щоб керувати своїм балансом і записами</p>

          <form className={styles.form}>
          <label htmlFor="email" className={styles.label}>E-mail:</label>
          <input
            className={styles.input}
            type="email"
            id='email'
            placeholder="Введіть email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />

          <label htmlFor="password" className={styles.label}>Пароль:</label>
          <input
            className={styles.input}
            type="password"
            id='password'
            placeholder="Введіть пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />

          </form>


          {error && <p className={styles.error}>{error}</p>}

          <button
            className={styles.button}
            onClick={handleLogin}
          >
            {loading ? <MiniLoader /> :
              `Увійти`}
          </button>
        </div>
        <div className={styles.startPage_newClient}>
          <p>Новий користувач?</p>
          <Link
            className={styles.startPage_newClient_btn}
            href="/registrationPage">
            Зареєструватися
          </Link>
        </div>
      </div>
    </>

  );
};

export default StartPage;
