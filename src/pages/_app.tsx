import { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import '../styles/globals.css';
import '../Components/Footer/Footer.scss';
import Navbar from '../Components/Navbar/Navbar';
import Footer from '../Components/Footer/Footer';
import StartPage from '../Components/StartPage/StartPage';
import { StudioProvider } from '../context/StudioContext';
import { AuthProvider } from '../context/AuthContext';
import RegistrationPage from '../Components/RegistrationPage/RegistrationPage';

const titleMap: Record<string, string> = {
  '/': 'Моя сторінка | Lavanda Studio',
  '/registrationPage': 'Реєстрація | Lavanda Studio',
  '/schedulePage': 'Розклад | Lavanda Studio',
  '/bookPage': 'Запис на заняття | Lavanda Studio',
  '/newsPage': 'Наші новини | Lavanda Studio',
  '/createUser': 'Реєстрація клієнта | Lavanda Studio',
};

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const title = titleMap[router.pathname] || 'Lavanda Studio';
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);


  const handleRegister = async (name: string, email: string, phone: string, password: string) => {
    try {
      const response = await fetch('/api/auth/register', { // Виправлено шлях
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, password }), // Додано phone
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        setIsLoggedIn(true);
        // window.location.href = "/"; // Перенаправлення після реєстрації
        router.replace('/')
      } else {
        const data = await response.json();
        alert(data.error || 'Помилка реєстрації');
      }
    } catch (error) {
      console.error('Помилка реєстрації', error);
    }
  };

  const handleLogin = async (email: string, password: string) => {
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token); // Збереження токена
        setIsLoggedIn(true);
      } else {
        const data = await response.json();
        alert(data.error || 'Помилка входу');
        setLoading(false);
      }
    } catch (error) {
      console.error('Помилка входу:', error);
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", { method: "POST" });
      if (!response.ok) throw new Error("Помилка виходу");

      localStorage.removeItem("token");

      // Опціонально: редірект на головну сторінку
      window.location.href = "/";
    } catch (error) {
      console.error("Помилка при виході:", error);
    }
  };

  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=Comfortaa:wght@300;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap" rel="stylesheet" />
        <title>{title}</title>
      </Head>
      {!isLoggedIn ? (
        <StartPage loading={loading} onLogin={handleLogin} setIsLoggedIn={setIsLoggedIn} />
      ) : (
        <AuthProvider>
          <StudioProvider>
            <Navbar handleLogout={handleLogout} />
            <Component {...pageProps} />
            <Footer />
          </StudioProvider>
        </AuthProvider>
      )}
    </>
  );
}

export default MyApp;
