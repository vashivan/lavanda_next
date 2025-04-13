import styles from '../styles/AdminBookPage.module.scss';
import MiniLoader from "../Components/MiniLoader/MiniLoader";
import { useAuth } from '../context/AuthContext';
import { useStudio } from '../context/StudioContext';
import { useEffect, useState } from "react";
import { Search } from 'lucide-react';

type ScheduleItem = {
  id: number;
  studio: string;
  class_name: string;
  start_time: string;
  instructor: string;
  available_spots: number;
};

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  availablecl: number;
  role: string;
}

export default function AdminBookPage() {
  const { studio, toggleStudio } = useStudio();
  const { user } = useAuth();
  const todayDay = new Date().toISOString().split('T')[0];
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(todayDay);
  const [selectedClass, setSelectedClass] = useState<ScheduleItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [infoMsg, setInfoMsg] = useState("");

  const isLavandaRed = studio === "lavanda_red";

  useEffect(() => {
    fetch("/api/schedule")
      .then((res) => res.json())
      .then((data) => {
        setSchedule(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        setInfoMsg("Не вдалося завантажити розклад.");
      });
  }, []);

  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => {
        const transformedUsers = data.map((u: any) => ({
          id: u.id,
          name: u.student_name,
          email: u.student_email || "Немає email",
          phone: u.student_phone || "Немає телефону",
          availablecl: u.student_availablecl,
          role: "student"
        }));

        setUsers(transformedUsers);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        setInfoMsg("Не вдалося завантажити користувачів.");
      });
  }, []);


  const openBookingModal = (classItem: ScheduleItem) => {
    setSelectedClass(classItem);
    setModalOpen(true);
  };

  const closeBookingModal = () => {
    setModalOpen(false);
    setSelectedClass(null);
  };
  const validateDate = (date: string) => {
    return new Date(date).toLocaleTimeString("uk-UA", {
      timeZone: "Europe/Kyiv",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const generateNextFiveDays = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 5; i++) {
      const nextDate = new Date(today);
      nextDate.setDate(today.getDate() + i);
      dates.push(nextDate);
    }
    return dates;
  };

  const handleDateChange = (date: Date) => {
    setSelectedDate(date.toISOString().split('T')[0]);
  };

  const filteredSchedule = schedule.filter((item) => {
    const itemDate = new Date(item.start_time).toISOString().split('T')[0];
    return itemDate === selectedDate && item.studio === studio;
  });

  const handleBooking = async (userId: string, userName: string, userEmail: string, userPhone: string) => {
    const updatedBookingData = {
      name: userName || "",
      email: userEmail || "",
      phone: userPhone || "",
      studio: studio || "",
      className: selectedClass?.class_name,
      classId: selectedClass?.id,
      classTime: selectedClass?.start_time,
      studentId: userId
    };

    setLoadingId(userId);
    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedBookingData),
        cache: "no-store"
      });

      if (res.ok) {
        setInfoMsg("Запис успішний!");
        closeBookingModal();
      } else {
        const errorText = await res.text();
        alert(errorText);
        setInfoMsg(errorText);
      }
    } catch (error) {
      setInfoMsg("Помилка з'єднання. Спробуйте ще раз.");
    } finally {
      setLoadingId(null);
      setTimeout(() => {
        setInfoMsg('');
      }, 4000);
    }
  };

  const handleCloseInfoMsg = () => {
    setInfoMsg('');
  };

  return (
    <div className={styles.bookPage}>
      {infoMsg && (
        <div className={styles.bookPage_info}>
          {infoMsg}
          <button
            className={styles.bookPage_info_btn}
            onClick={handleCloseInfoMsg}
          >
            Х
          </button>
        </div>
      )}
      <div className={styles.container}>
        <h1 className={`${isLavandaRed ? styles.container_title_red : styles.container_title}`}>
          Розклад занять
        </h1>
        <h2 className={`${isLavandaRed ? styles.container_title_red : styles.container_title}`}>
          {isLavandaRed ? (`Lavanda Red`) : (`Lavanda Purple`)}
        </h2>
        <button
          className={`${styles.toggle_studio} ${isLavandaRed ? styles.toggle_studio_red : ''}`}
          onClick={() => {
            toggleStudio();
          }}
        >
          {isLavandaRed ?
            (<p>Змінити на Lavanda Purple</p>)
            :
            (<p>Змінити на Lavanda Red</p>)
          }
        </button>
        <div className={styles["date-buttons"]}>
          {generateNextFiveDays().map((date, index) => (
            <button
              key={index}
              type="button"
              className={`${styles["date_button"]} 
              ${selectedDate === date.toISOString().split('T')[0] ?
                  (isLavandaRed ? styles.active_red : styles.active) : ""}
              ${isLavandaRed ? styles.date_button_red : styles.container_title}`}
              onClick={() => handleDateChange(date)}
            >
              {date.toLocaleDateString("uk-UA")}
            </button>
          ))}
        </div>
        {loading ? (
          <MiniLoader />
        ) : filteredSchedule.length === 0 ? (
          <p>Наразі немає доступних занять.</p>
        ) : (
          <ul className={styles.list}>
            {filteredSchedule.map((item) => (
              <li key={item.id} className={`${styles.item} ${isLavandaRed ? styles.item_red : ""}`}>
                <h4 className={`${styles.item_title} ${isLavandaRed ? styles.item_title_red : ""}`}>
                  {item.class_name}
                </h4>
                <span>Час:</span>
                <span className={`${styles.time} ${isLavandaRed ? styles.time_red : ""}`}>
                  {validateDate(item.start_time.toString())}
                </span>
                <span>Вільних місць:</span>
                <span className={`${styles.spots} ${isLavandaRed ? styles.spots_red : ""}`}>
                  {item.available_spots}
                </span>
                <span>Тренер:</span>
                <span className={`${isLavandaRed ? styles.instructor_red : ""}`}>{item.instructor}</span>
                <button
                  className={`${styles.item_book_btn} ${isLavandaRed ? styles.item_book_btn_red : ""}`}
                  onClick={() => openBookingModal(item)}
                >
                  Записати учня
                </button>

                {modalOpen && (
                  <div className={styles.modal_overlay}>
                    <div className={styles.modal}>
                      <div className={styles.search}>
                        <span className={styles.search_icon}><Search /></span>
                        <input
                          className={styles.students_container_search}
                          type="text"
                          placeholder="Пошук учня"
                          value={search}
                          onChange={(e) => setSearch(e.target.value.trim().toLowerCase())}
                        />
                        <button className={styles.close_btn} onClick={closeBookingModal}>
                          X
                        </button>
                      </div>
                      <ul className={styles.list}>
                        {users.filter(u =>
                          u.name.toLowerCase().includes(search) ||
                          u.email.toLowerCase().includes(search) ||
                          u.phone.includes(search)
                        ).map(u => (
                          <li className={styles.list_item} key={u.id}>
                            <button
                              className={`${styles.list_item_btn} ${isLavandaRed ? styles.list_item_btn_red : ''}`}
                              onClick={() => handleBooking(u.id, u.name, u.email, u.phone)}
                              disabled={u.availablecl === 0}
                            >
                              {loadingId === u.id ? <MiniLoader /> : u.name}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
