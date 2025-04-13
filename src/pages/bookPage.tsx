import styles from '../styles/BookPage.module.scss';
import MiniLoader from "../Components/MiniLoader/MiniLoader";
import { useAuth } from '../context/AuthContext';
import { useStudio } from '../context/StudioContext';
import { useEffect, useState } from "react";

type ScheduleItem = {
  id: number;
  studio: string;
  class_name: string;
  start_time: string;
  instructor: string;
  available_spots: number;
};

export default function BookPage() {
  const { studio } = useStudio();
  const { user } = useAuth();
  const todayDay = new Date().toISOString().split('T')[0];
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [selectedDate, setSelectedDate] = useState(todayDay);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [infoMsg, setInfoMsg] = useState("");

  const isLavandaRed = studio === "lavanda_red";

  useEffect(() => {
    if (user?.availablecl === 0) {
      setInfoMsg('На вашому балансі немає занять. Поповніть ваш баланс, щоб мати змогу відвідувати студію');
    }
  }, [user]);

  useEffect(() => {
    fetch("/api/schedule")
      .then((res) => res.json())
      .then((data) => {
        setSchedule(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [infoMsg]);

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


  const handleBooking = async (classId: number, className: string, classTime: string) => {
    const updatedBookingData = {
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      studio: studio || "", // Гарантуємо, що `studio` теж рядок
      className,
      classId,
      classTime,
    };

    setIsLoading(true);
    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedBookingData),
        cache: "no-store"
      });

      if (res.ok) {
      } else {
        const errorText = await res.text();
        alert(errorText);
        setInfoMsg(errorText);
      }
    } catch (error) {
      setInfoMsg("Помилка з'єднання. Спробуйте ще раз");
    } finally {
      setInfoMsg("Ви успішно зареєструвалися на заняття. Деталі запису надіслані на вашу поштову скриньку")
      setTimeout(() => {
        setInfoMsg('');
      }, 4000);
      setIsLoading(false);
    }
  };

  const handleCloseInfoMsg = () => {
    setInfoMsg('');
  }

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
          {isLavandaRed ?
            (`Lavanda Red`)
            :
            (`Lavanda Purple`)
          }
        </h2>
        <div className={styles["date-buttons"]}>
          {generateNextFiveDays().map((date, index) => (
            <button
              key={index}
              type="button"
              className={`
              ${styles["date_button"]} 
              ${selectedDate === date.toISOString().split('T')[0] ?
                  (isLavandaRed ? styles.active_red : styles.active) : ""}
              ${isLavandaRed ? styles.date_button_red : styles.container_title}
            `}
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
                  // onClick={() => openBookingModal(item.id, item.class_name, item.start_time)}
                  onClick={() => handleBooking(item.id, item.class_name, item.start_time)}
                  disabled={item.available_spots === 0 || user?.availablecl === 0}
                >
                  {isLoading ? (
                    <MiniLoader />
                  )
                    : (`Забронювати`)
                  }
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
