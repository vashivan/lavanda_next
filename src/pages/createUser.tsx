import Link from "next/link";
import styles from '../styles/RegistrationPage.module.scss';
import { useState } from "react";
import MiniLoader from "../Components/MiniLoader/MiniLoader";
import { useStudio } from "@/context/StudioContext";


export default function CreateUser() {
  const { studio } = useStudio();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('');
  const [password, setPassword] = useState('');
  const [infoMsg, setInfoMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const isLavandaRed = studio === "lavanda_red";

  const handleRegister = async (name: string, email: string, phone: string, password: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/createUser', { // Виправлено шлях
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, password, role }), // Додано phone
      });

      if (response.ok) {
        setLoading(false);
        setName('');
        setEmail('');
        setPhone('');
        setPassword('');
        setInfoMsg('Реєтрація успішна!')
        const data = await response.json();
        localStorage.setItem('token', data.token);
        // window.location.href = "/"; // Перенаправлення після реєстрації
      } else {
        setLoading(false);
        setInfoMsg('Помилка реєсрації');
        const data = await response.json();
        alert(data.error || 'Помилка реєстрації');
      }
    } catch (error) {
      setLoading(false);
      setInfoMsg('Помилка реєсрації');
      console.error('Помилка реєстрації', error);
    }
  };
  return (
    <div className={styles['registration-page']}>
      <div className={styles['registration-page_form']}>
        <h1 className={`${styles['registration-page_form_title']} 
          ${isLavandaRed ? styles['registration-page_form_title_red'] : ''}`
        }
        >
          Реєстрація
        </h1>
        <input
          className={styles['registration-page_form_input']}
          type="text"
          placeholder="Ім'я"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className={styles['registration-page_form_input']}
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className={styles['registration-page_form_input']}
          type="text"
          placeholder="Телефон"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <input
          className={styles['registration-page_form_input']}
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <select
          className={styles['registration-page_form_input']}
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="">Оберіть роль</option>
          <option value="user">Клієнт</option>
          <option value="admin">Адміністратор</option>
        </select>
        {infoMsg && <p className={styles.error}>{infoMsg}</p>}
        <button
          className={styles['registration-page_form_btn']}
          onClick={() => handleRegister(name, email, phone, password)} disabled={loading
          }>
          {loading ? (
            <MiniLoader />
          ) : 'Зареєструвати'}
        </button>
      </div>

      <Link href="/">Скасувати</Link>
    </div>
  );
};