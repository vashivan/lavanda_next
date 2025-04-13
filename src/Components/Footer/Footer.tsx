import Link from 'next/link';
import styles from '../../styles/Footer.module.scss';
import { useStudio } from '@/context/StudioContext';
import { useAuth } from '@/context/AuthContext';

const Footer = () => {
  const { studio } = useStudio();
  const { user } = useAuth();
  const isLavandaRed = studio === "lavanda_red";


  return (
    <div className={`${styles.footer} ${isLavandaRed ? styles.footer_red : ''}`}>
      <nav className={styles['footer-navbar']}>
        <ul className={styles['footer-navbar-list']}>
          <li className={styles['footer-navbar-list-item']}>
            <Link
              className={styles['footer-navbar-list-item-link']} href="/"
            >
              {user?.role === 'admin' ? 'Cписок учнів' : 'Головна сторінка'}
            </Link>
          </li>
          {user?.role === "admin" && (
            <li className={styles['footer-navbar-list-item']}>
              <Link
                className={styles['footer-navbar-list-item-link']}
                href="/createUser"
              >
                Реєстрація клієнта
              </Link>
            </li>
          )}
          {user?.role === "admin" ? (
            <li className={styles['footer-navbar-list-item']}>
              <Link
                className={styles['footer-navbar-list-item-link']}
                href="/adminBookPage"
              >
                Запис на заняття
              </Link>
            </li>
          ) : (
            <li className={styles['footer-navbar-list-item']}>
              <Link
                className={styles['footer-navbar-list-item-link']}
                href="/bookPage"
              >
                Запис на заняття
              </Link>
            </li>
          )}
          {user?.role === "admin" && (
            <li className={styles['footer-navbar-list-item']}>
              <Link
                className={styles['footer-navbar-list-item-link']}
                href="/addClass"
              >
                Додати заняття
              </Link>
            </li>
          )}
          {/* <li className={styles['footer-navbar-list-item']}>
            <Link
              className={styles['footer-navbar-list-item-link']}
              href="/schedulePage"
            >
              Розклад занять
            </Link>
          </li> */}
          {/* <li className={styles['footer-navbar-list-item']}>
            <Link
              className={styles['footer-navbar-list-item-link']}
              href="/newsPage"
            >
              Наші новини
            </Link>
          </li> */}
        </ul>
      </nav>

      <div className={styles['footer-contact']}>
        <div className={styles['footer-contact__adress']}>
          <h3>Наша адреса:</h3>
          {isLavandaRed ? (
            <a href="https://maps.app.goo.gl/Gr58JFxL1naWa9En9">
              м. Бровари, вул. Київська 261-а (ЖК "Діамант")
            </a>
          ) : (
            <a href="https://maps.app.goo.gl/AmEnf7zr4LycaX8m7">
              м. Бровари, вул. Соборна 21
            </a>
          )}
        </div>

        <div className={styles['footer-contact__phone']}>
          <h3>Телефон:</h3>
          <a href="tel:+380686471557">+38 (068) 647-15-57</a>
        </div>

        <div className={styles['footer-contact__social']}>
          <h3>Соціальні мережі:</h3>
          <div className={styles['footer-contact__social-icons']}>
            <a className={styles['footer-contact__social-icons_instagram']}
              href="https://www.instagram.com/lavanda_studio_2023/">
            </a>
            <a className={styles['footer-contact__social-icons_telegram']}
              href="https://t.me/+kQrH4E0iRMY0ZmJi">
            </a>
            <a className={styles['footer-contact__social-icons_viber']}
              href="https://www.instagram.com/">
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
