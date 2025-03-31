import React, { useState } from 'react';
import { Trainer } from '../../Utils/Types';
import styles from '../../styles/TrainersInfo.module.scss';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Carousel from './Carousel';
import { useStudio } from '@/context/StudioContext';

type Props = {
  trainer: Trainer
}

const TrainerInfo: React.FC<Props> = ({ trainer }) => {
  const { studio } = useStudio();
  const isLavandaRed = studio === "lavanda_red";
  const { name, surname, imgSrc, info, images, intro } = trainer;
  const [showModal, setShowModal] = useState(false);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  return (
    <div className={styles['trainerInfo']}>
      <img
        src={imgSrc}
        alt={`${name} ${surname}`}
        className={styles['trainerInfo__image']}
      />
      <div className={styles['trainerInfo__details']}>
        <h2 className={`${styles['trainerInfo__name']} 
          ${isLavandaRed ? styles['trainerInfo__name_red'] : ''}`}>
          {name} {surname}
        </h2>
        <p className={styles['trainerInfo__years']}>Досвід: {info.years} р.</p>
        <p className={styles['trainerInfo__study']}>Освіта: {info.study}</p>
        <p className={styles['trainerInfo__accents']}>Напрямки: {info.accents}</p>
        <Modal
          className={`${styles.modal} ${showModal ? styles['modal-show'] : ''}`}
          show={showModal}
          onHide={handleClose}
        >
          <div className={styles['modal-content']}>
            <Modal.Header>
              <h3>Інформація про тренера</h3>
            </Modal.Header>
            <Modal.Body className={styles['modal-content_body']}>
              <p>{intro.split('\n').map((line, index) => (
                <React.Fragment key={index}>
                  {line}
                  <br />
                </React.Fragment>
              ))}
              </p>
              <Carousel images={images} />
            </Modal.Body>
            <Modal.Footer className={styles['modal-footer']}>
              <Button
                className={`${styles['modal-button']}
              ${isLavandaRed ? styles['modal-button_red'] : ""}`}
                onClick={handleClose}
              >
                Закрити
              </Button>
            </Modal.Footer>
          </div>
        </Modal>
      </div>
      <Button
        className={`${styles['trainerInfo-button']}
          ${isLavandaRed ? styles['trainerInfo-button_red'] : ''}`}
        onClick={handleShow}
      >
        Детальніше
      </Button>
    </div>
  );
};


export default TrainerInfo;
