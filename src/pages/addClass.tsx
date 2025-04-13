import { useState } from "react";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from '../styles/AddClass.module.scss';
import MiniLoader from "@/Components/MiniLoader/MiniLoader";

export default function AddClass() {
  const [classTitle, setClassTitle] = useState('');
  const [startTime, setStartTime] = useState('');
  const [selectedStudio, setSelectedStudio] = useState('');
  const [instructor, setInstructor] = useState('');
  const [spots, setSpots] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const handleAdding = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/addClass', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ classTitle, startTime, selectedStudio, instructor, spots }),
      });
  
      if (response.ok) {
        toast.success('Заняття додано успішно!');
        setClassTitle('');
        setStartTime('');
        setSelectedStudio('');
        setInstructor('');
        setSpots(0);
        setIsLoading(false);
      } else {
        const data = await response.json();
        toast.error(data.error || 'Помилка додавання');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Помилка додавання', error);
      toast.error('Помилка зʼєднання з сервером');
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.addClass}>
      <h1 className={styles.addClass_title}>Додати заняття</h1>
      <form 
        className={styles.addClass_form}
        onSubmit={(e) => {
          e.preventDefault();
          handleAdding();
        }}
      >
        <label className={styles.addClass_label}>
          Оберіть студію
          <select
            className={styles.addClass_input}
            value={selectedStudio}
            onChange={(e) => setSelectedStudio(e.target.value)}
          >
            <option value="">Оберіть студію</option>
            <option value="lavanda_red">Lavanda Red</option>
            <option value="lavanda_purple">Lavanda Purple</option>
          </select>
        </label>

        <label className={styles.addClass_label}>
          Клас
          <input
            className={styles.addClass_input}
            type="text"
            value={classTitle}
            onChange={(e) => setClassTitle(e.target.value)}
          />
        </label>

        <label className={styles.addClass_label}>
          Інструктор
          <input
            className={styles.addClass_input}
            type="text"
            value={instructor}
            onChange={(e) => setInstructor(e.target.value)}
          />
        </label>

        <label className={styles.addClass_label}>
          Дата та час заняття
          <input
            className={styles.addClass_input}
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </label>

        <label className={styles.addClass_label}>
          Кількість місць:
          <input
            className={styles.addClass_input}
            type="number"
            min={0}
            value={spots}
            onChange={(e) => setSpots(Number(e.target.value))}
          />
        </label>

        <button className={styles.addClass_btn} type="submit">
          {isLoading ? <MiniLoader /> : 'Додати'}
        </button>
      </form>
      <ToastContainer position="bottom-center" autoClose={3000} />
    </div>
  );
}
