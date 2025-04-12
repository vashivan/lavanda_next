import React from 'react';
import Link from 'next/link';
import styles from '../../styles/Menu.module.scss';
import { useStudio } from '@/context/StudioContext';
import { useAuth } from '@/context/AuthContext';
import { LogOut } from 'lucide-react';

interface Props {
  isOpen: boolean;
  toggleMenu: () => void;
}

export const Menu: React.FC<Props> = ({ isOpen, toggleMenu }) => {
  const { user } = useAuth();
  const { studio, toggleStudio } = useStudio();
  const isLavandaRed = studio === "lavanda_red";


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
    <div className={`${styles['menu']} ${isOpen ? styles['open'] : ''}`}>
      <ul className={styles['navbar-nav']}>
        <li className={styles['nav-item']}>
          <Link href="/" className={`${styles['menu-nav-link']} 
            ${isLavandaRed ? styles['menu-nav-link_red'] : ''}`
          }
            onClick={toggleMenu}>
            {user?.role === 'admin' ? 'Cписок учнів' : 'Головна сторінка'}
          </Link>
        </li>
        {user?.role === "admin" && (
          <li className={styles['nav-item']}>
            <Link href="/createUser" className={`${styles['menu-nav-link']} 
                    ${isLavandaRed ? styles['menu-nav-link_red'] : ''}`
            } onClick={toggleMenu}>
              Реєстрація клієнта
            </Link>
          </li>
        )}

        {/* <li className={styles['nav-item']}>
          <Link href="/price" className={`${styles['menu-nav-link']} 
            ${isLavandaRed ? styles['menu-nav-link_red'] : ''}`
          } onClick={toggleMenu}>
            Ціни
          </Link>
        </li> */}
        {/* <li className={styles['nav-item']}>
          <Link href="/trainersPage" className={`${styles['menu-nav-link']} 
            ${isLavandaRed ? styles['menu-nav-link_red'] : ''}`
          } onClick={toggleMenu}>
            Наші тренери
          </Link>
        </li> */}
        {/* <li className={styles['nav-item']}>
          <Link href="/newsPage" className={`${styles['menu-nav-link']} 
            ${isLavandaRed ? styles['menu-nav-link_red'] : ''}`
          } onClick={toggleMenu}>
            Наші новини
          </Link>
        </li> */}
        {/* <li className={styles['nav-item']}>
          <Link href="/bookPage" className={`${styles['menu-nav-link']} 
            ${isLavandaRed ? styles['menu-nav-link_red'] : ''}`
          } onClick={toggleMenu}>
            Запис на заняття
          </Link>
        </li> */}
        {user?.role === "admin" ? (
          <li className={styles.navbarListItem}>
            <Link
              className={`${styles['menu-nav-link']} 
              ${isLavandaRed ? styles['menu-nav-link_red'] : ''}`
              } onClick={toggleMenu}
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
      {/* <button
        className={`${styles.toggle_studio} ${isLavandaRed ? styles.toggle_studio_red : ''}`}
        onClick={() => {
          toggleStudio();
          toggleMenu();
        }}
      >
        {isLavandaRed ?
          (<p>Змінити на Lavanda Purple</p>)
          :
          (<p>Змінити на Lavanda Red</p>)
        }
      </button> */}
      <button className={`${styles['menu-button']} 
        ${isLavandaRed ? styles['menu-button_red'] : ''}`
      }
        onClick={toggleMenu}></button>
    </div>
  );
};

export default Menu;
