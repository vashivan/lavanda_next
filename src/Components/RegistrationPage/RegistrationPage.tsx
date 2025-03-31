import Link from "next/link";
import styles from '../../styles/RegistrationPage.module.scss';
import { useState } from "react";
import MiniLoader from "../../Components/MiniLoader/MiniLoader";

type Props = {
  onRegister: (name: string, email: string, phone: string, password: string) => void;
};

const RegistrationPage: React.FC<Props> = ({ onRegister }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !phone || !password) {
      setError('Заповніть всі поля');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await onRegister(name, email, phone, password);
    } catch (err) {
      setError('Помилка реєстрації');
    }
    setLoading(false);
  };

  return (
    <div className={styles['registration-page']}>
      <div className={styles['registration-page_form']}>
        <h1 className={styles['registration-page_form_title']}>Реєстрація</h1>
        <form className={styles['form']}>
          <input
            className={styles['registration-page_form_input']}
            type="text"
            placeholder="Ім'я"
            value={name}
            autoComplete="username"
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
            autoComplete="current-phone"
            onChange={(e) => setPhone(e.target.value)}
          />
          <input
            className={styles['registration-page_form_input']}
            type="password"
            placeholder="Пароль"
            value={password}
            autoComplete="current-password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </form>
        {error && <p className={styles.error}>{error}</p>}
        <button
          className={styles['registration-page_form_btn']}
          onClick={handleRegister} disabled={loading
          }>
          {loading ? (
            <MiniLoader />
          ) : 'Зареєструватися'}
        </button>
      </div>

      <Link href="/">Скасувати</Link>
    </div>
  );
};

export default RegistrationPage;
