import { useState } from "react";

export default function AddClass() {
  const [classTitle, setClassTitle] = useState('');
  const [startTime, setStartTime] = useState('');
  const [selectedStudio, setSelectedStudio] = useState('');
  const [instructor, setInstructor] = useState('');
  const [spots, setSpots] = useState(0);

  const handleAdding = async () => {
    try {
      const response = await fetch('/api/addClass', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ classTitle, startTime, selectedStudio, instructor, spots }),
      });

      if (response.ok) {
        setClassTitle('');
        setStartTime('');
        setSelectedStudio('');
        setInstructor('');
        setSpots(0);
      } else {
        const data = await response.json();
        alert(data.error || 'Помилка додавання');
      }
    } catch (error) {
      console.error('Помилка додавання', error);
    }
  };

  return (
    <div>
      <form 
        onSubmit={(e) => {
          e.preventDefault();
          handleAdding();
        }}
      >
        <label>
          Оберіть студію
          <select
            value={selectedStudio}
            onChange={(e) => setSelectedStudio(e.target.value)}
          >
            <option value="">Оберіть студію</option>
            <option value="lavanda_red">Lavanda Red</option>
            <option value="lavanda_purple">Lavanda Purple</option>
          </select>
        </label>

        <label>
          Клас
          <input
            type="text"
            value={classTitle}
            onChange={(e) => setClassTitle(e.target.value)}
          />
        </label>

        <label>
          Інструктор
          <input
            type="text"
            value={instructor}
            onChange={(e) => setInstructor(e.target.value)}
          />
        </label>

        <label>
          Дата та час заняття
          <input
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </label>

        <label>
          Кількість місць:
          <input
            type="number"
            min={0}
            value={spots}
            onChange={(e) => setSpots(Number(e.target.value))}
          />
        </label>

        <button type="submit">
          Додати
        </button>
      </form>
    </div>
  );
}
