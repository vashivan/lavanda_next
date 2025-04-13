import { useStudio } from '@/context/StudioContext';
import { Check, Mail, PencilLine, Phone, User, Wallet, X } from 'lucide-react';
import { useState } from 'react';
import styles from '../../styles/UserCard.module.scss';
import MiniLoader from '../MiniLoader/MiniLoader';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  availablecl: number;
  role: string;
}

type Props = {
  student: User;
}

const UserCard: React.FC<Props> = ({ student }) => {
  const { studio } = useStudio();
  const isLavandaRed = studio === 'lavanda_red';

  const [editingField, setEditingField] = useState<string | null>(null);
  const [isUpdated, setIsUpdated] = useState(false);
  const [editedData, setEditedData] = useState({
    id: student?.id,
    name: student?.name || "",
    phone: student?.phone || "",
    email: student?.email || "",
    availablecl: student?.availablecl,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedData({ ...editedData, [e.target.name]: e.target.value });
  };

  const handleSave = async (field: string) => {
    setIsUpdated(true);
    try {
      const updatedField = {
        id: student.id,
        [field]: editedData[field as keyof typeof editedData]
      };

      const response = await fetch("/api/auth/adminUpdate", {
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
      // updateUser({
      //   ...student,  // Беремо всі старі дані
      //   ...updatedUserData, // Оновлюємо лише змінені
      // });

      setEditingField(null);
      setIsUpdated(false);
    } catch (error) {
      console.error("Помилка при збереженні:", error);
    }
  };

  const handleCancel = () => {
    setEditingField(null);
    setEditedData({
      id: student?.id,
      name: student?.name || "",
      phone: student?.phone || "",
      email: student?.email || "",
      availablecl: student?.availablecl,
    });
  };

  return (
    <div className={`${student.role === 'admin' ? styles.adminCard : styles.userCard}`}>
      {/* Ім"я */}
      <p>
        <User size={25} color={"#7F7FD5"} />
        {editingField === "name" ? (
          <>
            <input
              className={styles.userCard_input}
              type="text"
              name="name"
              value={editedData.name}
              onChange={handleChange}
            />
            <button
              className={styles.userCard_saveBtn}
              onClick={() => handleSave("name")}
            >
              {isUpdated ? <MiniLoader /> : <Check color="green" />}
            </button>
            <button
              className={styles.userCard_saveBtn}
              onClick={handleCancel}
            >
              <X color="red" />
            </button>
          </>
        ) : (
          <>
            <span>{student.name}</span>
            <button className={styles.userCard_editBtn} onClick={() => setEditingField("name")}>
              <PencilLine size={25}  color={"#7F7FD5"} />
            </button>
          </>
        )}
      </p>

      {/* Телефон */}
      <p>
        <Phone size={25} color={"#7F7FD5"} />
        {editingField === "phone" ? (
          <>
            <input
              className={styles.userCard_input}
              type="text"
              name="phone"
              value={editedData.phone}
              onChange={handleChange}
            />
            <button
              className={styles.userCard_saveBtn}
              onClick={() => handleSave("phone")}
            >
              <Check color="green" />
            </button>
            <button
              className={styles.userCard_saveBtn}
              onClick={handleCancel}
            >
              <X color="red" />
            </button>
          </>
        ) : (
          <>
            <span>{student.phone}</span>
            <button
              className={styles.userCard_editBtn}
              onClick={() => setEditingField("phone")}
            >
              <PencilLine size={25}  className={styles.userCard_editBtn} color={"#7F7FD5"} />
            </button>
          </>
        )}
      </p>

      {/* Email */}
      <p>
        <Mail size={25} color={"#7F7FD5"} />
        {editingField === "email" ? (
          <>
            <input
              className={styles.userCard_input}
              type="text"
              name="email"
              value={editedData.email}
              onChange={handleChange}
            />
            <button
              className={styles.userCard_saveBtn}
              onClick={() => handleSave("email")}
            >
              <Check color="green" />
            </button>
            <button
              className={styles.userCard_saveBtn}
              onClick={handleCancel}
            >
              <X color="red" />
            </button>
          </>
        ) : (
          <>
            <span>{student.email}</span>
            <button
              className={styles.userCard_editBtn}
              onClick={() => setEditingField("email")}
            >
              <PencilLine size={25} className={styles.userCard_editBtn} color={"#7F7FD5"} />
            </button>
          </>
        )}
      </p>

      {/* Баланс занять */}
      <p>
        <Wallet size={25} color={"#7F7FD5"} />
        {editingField === "availablecl" ? (
          <>
            <input
              className={styles.userCard_input}
              type="text"
              name="availablecl"
              value={editedData.availablecl}
              onChange={handleChange}
            />
            <button
              className={styles.userCard_saveBtn}
              onClick={() => handleSave("availablecl")}
            >
              <Check color="green" />
            </button>
            <button
              className={styles.userCard_saveBtn}
              onClick={handleCancel}
            >
              <X color="red" />
            </button>
          </>
        ) : (
          <>
            <span>Баланс занять: {student.availablecl}</span>
            <button
              className={styles.userCard_editBtn}
              onClick={() => setEditingField("availablecl")}
            >
              <PencilLine size={25} className={styles.userCard_editBtn} color={"#7F7FD5"} />
            </button>
          </>
        )}
      </p>
    </div>
  );
}

export default UserCard;