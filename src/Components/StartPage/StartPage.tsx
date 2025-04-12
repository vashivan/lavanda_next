import React, { useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../../styles/StartPage.module.scss';
import MiniLoader from '../MiniLoader/MiniLoader';
import Head from 'next/head';

type Props = {
  onLogin: (email: string, password: string) => Promise<void>;
  setIsLoggedIn: (value: boolean) => void;
  loading: boolean;
};

const StartPage: React.FC<Props> = ({ onLogin, setIsLoggedIn }) => {
  const router = useRouter();

  //для вже зареєстрованих користувачів
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  //реєстрація нового користувача
  const [modalOpen, setModalOpen] = useState(false);
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [registerLoading, setRegisterLoading] = useState(false);

  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Будь ласка, введіть email та пароль');
      return;
    }

    setError('');
    setLoginLoading(true);
    try {
      await onLogin(email, password);
    } catch (err) {
      setError('Невірний email або пароль');
    }
    setLoginLoading(false);
  };

  const handleRegister = async () => {
    if (!regName || !regEmail || !phone || !regPassword) {
      setError('Будь ласка, заповніть усі поля');
      return;
    }

    setError('');
    setRegisterLoading(true);
    try {
      const response = await fetch('../api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: regName,
          email: regEmail,
          phone,
          password: regPassword,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        setIsLoggedIn(true);
        setRegName('');
        setRegEmail('');
        setPhone('');
        setRegPassword('');
        setModalOpen(false);
        router.replace('/');
      } else {
        const data = await response.json();
        setError(data.error || 'Помилка реєстрації');
      }
    } catch (err) {
      console.error('Помилка реєстрації', err);
      setError('Йой, халепа, щось пішло не так');
    }
    setRegisterLoading(false);
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
          <h1 className={styles.title}>
            Ласкаво просимо до <br /> Lavanda Studio
          </h1>
          <p className={styles.slogan}>Увійдіть, щоб керувати своїм балансом і записами</p>

          <form className={styles.form}>
            <label htmlFor="email" className={styles.label}>E-mail:</label>
            <input
              className={styles.input}
              type="email"
              id="email"
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
              id="password"
              placeholder="Введіть пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </form>

          {error && <p className={styles.error}>{error}</p>}

          <button className={styles.button} onClick={handleLogin} disabled={loginLoading}>
            {loginLoading ? <MiniLoader /> : 'Увійти'}
          </button>
        </div>

        <div className={styles.startPage_newClient}>
          <p>Новий користувач?</p>
          <button
            className={styles.startPage_newClient_btn}
            onClick={() => {
              setError('');
              setModalOpen(true);
            }}
          >
            Зареєструватися
          </button>

          {modalOpen && (
            <div className={styles.modal_overlay} role="dialog" aria-modal="true">
              <div className={styles.modal}>
                <div className={styles['registration-page_form']}>
                  <h1 className={styles['registration-page_form_title']}>Реєстрація</h1>
                  <form className={styles.form}>
                    <input
                      className={styles['registration-page_form_input']}
                      type="text"
                      placeholder="Ім'я"
                      value={regName}
                      autoComplete="username"
                      onChange={(e) => setRegName(e.target.value)}
                    />
                    <input
                      className={styles['registration-page_form_input']}
                      type="email"
                      placeholder="E-mail"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                    />
                    <input
                      className={styles['registration-page_form_input']}
                      type="text"
                      placeholder="Телефон"
                      value={phone}
                      autoComplete="tel"
                      onChange={(e) => setPhone(e.target.value)}
                    />
                    <input
                      className={styles['registration-page_form_input']}
                      type="password"
                      placeholder="Пароль"
                      value={regPassword}
                      autoComplete="new-password"
                      onChange={(e) => setRegPassword(e.target.value)}
                    />
                  </form>

                  {error && <p className={styles.error}>{error}</p>}

                  <button
                    className={styles['registration-page_form_btn']}
                    onClick={handleRegister}
                    disabled={registerLoading}
                  >
                    {registerLoading ? <MiniLoader /> : 'Зареєструватися'}
                  </button>
                </div>

                <button onClick={() => setModalOpen(false)}>
                  Скасувати
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default StartPage;
