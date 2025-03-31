import styles from '../../styles/MainPage.module.scss';
import { useAuth } from '../../context/AuthContext';
import { useStudio } from '../../context/StudioContext';
import { LogOut, Mail, Phone, User, Wallet, PencilLine, Check, X, Search, Loader } from 'lucide-react';
import { useState, useEffect } from 'react';
import MiniLoader from '../MiniLoader/MiniLoader';
import UserCard from '../UserCard/UserCard';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  availablecl: number;
  role: string;
}

const MainPage: React.FC = () => {
  const { user, isLoading, updateUser } = useAuth();
  const { studio } = useStudio();
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const isLavandaRed = studio === 'lavanda_red';

  // Стан для редагованого поля
  const [editingField, setEditingField] = useState<string | null>(null);
  const [isUpdated, setIsUpdated] = useState(false);
  const [editedData, setEditedData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    email: user?.email || "",
  });

  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => {
        // console.log("Отримані користувачі:", data);
        // Трансформуємо API-відповідь під очікуваний формат
        setLoading(true);
        const transformedUsers = data.map((u: any) => ({
          id: u.id, // Перетворюємо id у string, якщо потрібно
          name: u.student_name,
          email: u.student_email || "Немає email",
          phone: u.student_phone || "Немає телефону",
          availablecl: u.student_availablecl,
          role: "student" // Додаємо role, якщо її немає
        }));

        // console.log("Трансформовані користувачі:", transformedUsers);
        setUsers(transformedUsers);
        setTimeout(() => {
          setLoading(false)
        }, 4000)
      })
      .catch((error) => console.error("Помилка отримання користувачів:", error));
  }, []);

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    (u.email && u.email.toLowerCase().includes(search.toLowerCase())) ||
    u.phone.includes(search)
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedData({ ...editedData, [e.target.name]: e.target.value });
  };

  const handleSave = async (field: string) => {
    setIsUpdated(true);
    try {
      const updatedField = { [field]: editedData[field as keyof typeof editedData] };

      const response = await fetch("/api/auth/updateUserInfo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Додає токен з cookies
        body: JSON.stringify(updatedField),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Помилка оновлення даних");
      }

      const updatedUserData = await response.json(); // Отримуємо оновлені дані з API

      // Оновлюємо лише змінене поле у локальному стейті користувача
      updateUser({
        ...user,  // Беремо всі старі дані
        ...updatedUserData, // Оновлюємо лише змінені
      });

      setEditingField(null);
      setIsUpdated(false);
    } catch (error) {
      console.error("Помилка при збереженні:", error);
    }
  };

  const handleCancel = () => {
    setEditingField(null);
    setEditedData({
      name: user?.name || "",
      phone: user?.phone || "",
      email: user?.email || "",
    });
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

  if (isLoading) return <p className={styles.loading}>Завантаження...</p>;
  if (!user) return <p className={styles.notAuth}>Ви не авторизовані.</p>;

  if (user?.role === "admin") return (
    <div className={styles.admin}>
      <h2>Ви зайшли як адміністратор {user.name}</h2>
      <div className={styles.page_container}>
        <div className={styles.search}>
          <span className={styles.search_icon}><Search /></span>
          <input
            className={styles.students_container_search}
            type="text"
            placeholder="Пошук учня"
            value={search}
            onChange={(e) => setSearch(e.target.value.trim())}
          />
        </div>

        <h2>Список учнів</h2>
        {loading ? (
          <div className={styles.loader_container}>
            <MiniLoader />
          </div>
        ) : (
          <div className={styles.students_container}>
            {filteredUsers.map((u) => (
              <UserCard key={u.id} student={u} />
            ))}
          </div>
        )}

      </div>
    </div>
  )
  else return (
    <div className={styles.profileContainer}>
      <div className={styles.profileCard}>
        <h1 className={`${styles.title} ${isLavandaRed ? styles.title_red : ""}`}>Мій профіль</h1>

        <div className={styles.profileInfo}>
          {/* Ім"я */}
          <p>
            <User size={30} color={isLavandaRed ? "#FF416C" : "#7F7FD5"} />
            {editingField === "name" ? (
              <>
                <input
                  className={styles.profileInfo_input}
                  type="text"
                  name="name"
                  value={editedData.name}
                  onChange={handleChange}
                />
                <button
                  className={styles.profileInfo_saveBtn}
                  onClick={() => handleSave("name")}
                >
                  {isUpdated ? <MiniLoader /> : <Check color="green" />}
                </button>
                <button
                  className={styles.profileInfo_saveBtn}
                  onClick={handleCancel}>
                  <X color="red" />
                </button>
              </>
            ) : (
              <>
                <span className={styles.userName}>{user.name}</span>
                <button className={styles.profileInfo_editBtn} onClick={() => setEditingField("name")}>
                  <PencilLine color={isLavandaRed ? "#FF416C" : "#7F7FD5"} />
                </button>
              </>
            )}
          </p>

          {/* Телефон */}
          <p>
            <Phone size={30} color={isLavandaRed ? "#FF416C" : "#7F7FD5"} />
            {editingField === "phone" ? (
              <>
                <input
                  className={styles.profileInfo_input}
                  type="text"
                  name="phone"
                  value={editedData.phone}
                  onChange={handleChange}
                />
                <button
                  className={styles.profileInfo_saveBtn}
                  onClick={() => handleSave("phone")}
                >
                  <Check color="green" />
                </button>
                <button
                  className={styles.profileInfo_saveBtn}
                  onClick={handleCancel}
                >
                  <X color="red" />
                </button>
              </>
            ) : (
              <>
                <span>{user.phone}</span>
                <button
                  className={styles.profileInfo_editBtn}
                  onClick={() => setEditingField("phone")}
                >
                  <PencilLine className={styles.profileInfo_editBtn} color={isLavandaRed ? "#FF416C" : "#7F7FD5"} />
                </button>
              </>
            )}
          </p>

          {/* Email */}
          <p>
            <Mail size={30} color={isLavandaRed ? "#FF416C" : "#7F7FD5"} />
            {editingField === "email" ? (
              <>
                <input
                  className={styles.profileInfo_input}
                  type="text"
                  name="email"
                  value={editedData.email}
                  onChange={handleChange}
                />
                <button
                  className={styles.profileInfo_saveBtn}
                  onClick={() => handleSave("email")}
                >
                  <Check color="green" />
                </button>
                <button
                  className={styles.profileInfo_saveBtn}
                  onClick={handleCancel}
                >
                  <X color="red" />
                </button>
              </>
            ) : (
              <>
                <span>{user.email}</span>
                <button
                  className={styles.profileInfo_editBtn}
                  onClick={() => setEditingField("email")}
                >
                  <PencilLine className={styles.profileInfo_editBtn} color={isLavandaRed ? "#FF416C" : "#7F7FD5"} />
                </button>
              </>
            )}
          </p>

          {/* Баланс занять */}
          <p>
            <Wallet size={30} color={isLavandaRed ? "#FF416C" : "#7F7FD5"} />
            <span>Баланс занять: {user.availablecl}</span>
          </p>
        </div>

        <button
          className={`${styles.logoutBtn} ${isLavandaRed ? styles.logoutBtn_red : ''}`}
          onClick={handleLogout}
        >
          <LogOut size={20} /> Вийти
        </button>
      </div>
    </div>
  );
};

export default MainPage;
