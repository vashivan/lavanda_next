import { useStudio } from '@/context/StudioContext';
import styles from '../../styles/OurServices.module.scss';
import services from '../../Info/services.json';


const OurServices = () => {
  const { studio } = useStudio();
  const isLavandaRed = studio === "lavanda_red";

  return (
    <div className={styles.ourServices}>
      <h1 className={`${styles['ourServices-title']} ${isLavandaRed ? styles['ourServices-title_red'] : ''}`}>
        З нашою студією Lavanda ви отримаєте
      </h1>

      {services.map(({ title, text, className }, index) => (
        <div key={index} className={`${styles[className]} ${styles["ourServices-section"]}`}>
          <h1 className={`${styles["ourServices-section-title"]} ${isLavandaRed ? styles["ourServices-section-title_red"] : ''}`}>
            {title}
          </h1>
          <p>{text}</p>
        </div>
      ))}
    </div>
  );
};

export default OurServices;
