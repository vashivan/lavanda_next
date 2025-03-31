import { useStudio } from '@/context/StudioContext';
import styles from '../../styles/OurTrainers.module.scss';
import { Trainer } from "../../Utils/Types";
import TrainerCard from "../TrainerCard/TrainerCard";

type Props = {
  trainers: Trainer[]
}

const OurTrainers: React.FC<Props> = ({ trainers }) => {
  const { studio } = useStudio();
  const isLavandaRed = studio === "lavanda_red";

  return (
    <div className={styles['ourTrainers']}>
      <h1 className={`${styles['ourTrainers-title']} 
        ${isLavandaRed ? styles['ourTrainers-title_red'] : ''}`}>Наші тренери</h1>
      {trainers.map((trainer: Trainer) => 
        <TrainerCard key={trainer.id} trainer={trainer} />
      )}
    </div>
  )
}

export default OurTrainers;