import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { CSSTransition } from 'react-transition-group';
import Menu from '../Menu/Menu';
import styles from '../../styles/Navbar.module.scss';
import { useStudio } from '@/context/StudioContext';
import { useAuth } from '@/context/AuthContext';
import { LogOut } from 'lucide-react';

type Props = {
  handleLogout: () => void;
}

const Navbar: React.FC<Props> = ({ handleLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { studio } = useStudio();
  const { user } = useAuth();
  const isLavandaRed = studio === "lavanda_red";

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };  

  return (
    <nav className={styles.navbar}>
      <Link href="/">
        <img className={styles.navbarImg} src="/logo.PNG" alt="logo" />
      </Link>
      <ul className={styles.navbarList}>
        <li className={styles.navbarListItem}>
          <Link
            className={isLavandaRed ? styles.navbarListItem_link_red : ""}
            href="/"
          >
            {user?.role === 'admin' ? 'Cписок учнів' : 'Головна сторінка'}
          </Link>
        </li>
        {user?.role === "admin" && (
          <li className={styles.navbarListItem}>
            <Link
              className={isLavandaRed ? styles.navbarListItem_link_red : ""}
              href="/createUser"
            >
              Реєстрація клієнта
            </Link>
          </li>
        )}
        {user?.role === "admin" ? (
          <li className={styles.navbarListItem}>
            <Link
              className={isLavandaRed ? styles.navbarListItem_link_red : ""}
              href="/adminBookPage"
            >
              Запис на заняття
            </Link>
          </li>
        ) : (
        <li className={styles.navbarListItem}>
          <Link
            className={isLavandaRed ? styles.navbarListItem_link_red : ""}
            href="/bookPage"
          >
            Запис на заняття
          </Link>
        </li>
        )}
        <li>
          <button className={styles.end_session} onClick={handleLogout}>
          <LogOut size={20} /> Вийти
          </button>
        </li>
      </ul>
      <button className={styles.navbarMenuBtn} onClick={toggleMenu}>
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={isLavandaRed ? styles.navbarMenuBtn_icon_red : styles.navbarMenuBtn_icon}
        >
          <path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>

      <div ref={menuRef} className={`${styles['menu']} ${isOpen ? styles['open'] : ''}`}>
        <CSSTransition
          in={isOpen}
          timeout={500}
          unmountOnExit
          nodeRef={menuRef}
        >
          <Menu toggleMenu={toggleMenu} isOpen={isOpen} />
        </CSSTransition>
      </div>
    </nav>
  );
};

export default Navbar;
