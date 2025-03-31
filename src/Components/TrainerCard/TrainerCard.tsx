import { useStudio } from '@/context/StudioContext';
import styles from '../../styles/TrainerCard.module.scss';
import { Trainer } from '../../Utils/Types';
import { useState } from 'react';

type Props = {
  trainer: Trainer;
};

const TrainerCard: React.FC<Props> = ({ trainer }) => {
  const { studio } = useStudio();
  const isLavandaRed = studio === "lavanda_red";
  const [active, setActive] = useState(false);
  const { name, imgSrc, slogan, info } = trainer;

  return (
    <div className={styles['trainerCard']}>
      <h1 className={`${styles['trainerCard-title']} 
        ${isLavandaRed ? styles['trainerCard-title_red'] : ''}
      `}>
        {name}
      </h1>
      <p className={styles['trainerCard-slogan']}>"{slogan}"</p>
      <img className={styles['trainerCard-img']} src={imgSrc} alt={`${name} Image`} />
      <div className={`${styles['trainerCard-info']} ${active ? styles['trainerCard-info-active'] : ''}`}>
        <h3>{name}</h3>
        <h4>Стаж роботи:</h4>
        <p>{info.years} р.</p>
        <h4>Спеціалізована освіта:</h4>
        <p>{info.study}</p>
        <h4>Напрямок:</h4>
        <p>{info.accents}</p>
      </div>
      <button className={`${styles['trainerCard-btn']}
        ${isLavandaRed ? styles['trainerCard-btn_red'] : ''}`} 
        onClick={() => setActive(!active)}
      >
        {!active ? 'Детальніше' : 'Закрити'}
      </button>
    </div>
  );
};

export default TrainerCard;
