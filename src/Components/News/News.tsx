import React, { useState, useEffect } from 'react';
import { NewsItem } from '../../Utils/Types';
import Carousel from '../TrainerInfo/Carousel';
import styles from '../../styles/News.module.scss';
import { useStudio } from '@/context/StudioContext';

type Props = {
  news: NewsItem[];
};

const News: React.FC<Props> = ({ news }) => {
  const { studio } = useStudio();
  const islavandaRed = studio == "lavanda_red";
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);

  const cutMessage = (text: string, maxLength: number) => {
    return text.length <= maxLength ? text : `${text.slice(0, maxLength)}...`;
  };

  const handleClose = () => setSelectedNews(null);
  const handleShow = (newsItem: NewsItem) => setSelectedNews(newsItem);

  useEffect(() => {
    if (selectedNews) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = ''; // Забезпечення очищення, якщо компонент буде демонтовано
    };
  }, [selectedNews]);

  return (
    <div className={styles.news}>
      {news.map((newsItem: NewsItem) => {
        const { id, title, date, image, message } = newsItem;
        const shortMsg = cutMessage(message, 200);

        return (
          <div key={id} className={styles['news-item']}>
            <h3 
              className={`${styles['news-item_title']}
              ${islavandaRed ? styles['news-item_title_red'] : ''}`}
            >
              {title}
            </h3>
            <p className={styles['news-item_date']}>{date}</p>
            <p className={styles['news-item_message']}>{shortMsg}</p>
            <img className={styles['news-item_img']} src={image} alt="діти на конкурсі" />
            <button 
              className={`${styles['news-item_button']}
              ${islavandaRed ? styles['news-item_button_red'] : ""}`}
              onClick={() => handleShow(newsItem)}
            >
              Деталі
            </button>
          </div>
        );
      })}

      {selectedNews && (
        <div className={styles.modalOverlay} onClick={handleClose}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalCloseButton} onClick={handleClose}>
              &times;
            </button>
            <h4 className={styles.modalTitle}>{selectedNews.message}</h4>
            <div className={styles.modalBody}>
              {selectedNews.participants.map((participant, index) => (
                <div key={index} className={styles.modalParticipant}>
                  <h3>{participant.name}</h3>
                  <p><strong>Номер:</strong> {participant.performance}</p>
                  {participant.outfit && <p><strong>Костюм:</strong> {participant.outfit}</p>}
                  <p><strong>Місце:</strong> {participant.placement}</p>
                  <Carousel images={participant.images || []} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default News;
