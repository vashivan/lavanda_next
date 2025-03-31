import Link from 'next/link';
import Form from "../Form/Form";
import styles from '../../styles/About.module.scss';
// import PricingSection from "../PricingSection/PricingSection";
import ScrollToTop from '../ScrollToTop/ScrollToTop';
import { useStudio } from '@/context/StudioContext';

const About: React.FC = () => {
const { studio } = useStudio();
const isLavandaRed = studio === "lavanda_red";

  return (
    <div className={styles['about']}>
      <ScrollToTop />
      <section className={styles['about-intro']}>
        <h1 className={`${styles['about-intro_title']} 
          ${isLavandaRed ? styles['about-intro_title_red'] : ''}
        `}
        >
          Про нашу студію
        </h1>
        <p className={styles['about-intro_text1']}>Ласкаво просимо до нашої студії, де ми допомагаємо людям досягати своїх бажаних цілей і покращувати здоров'я. Ми пропонуємо широкий спектр тренувань, які підходять для всіх рівнів фізичної підготовки. Наша мета - створити доброзичливу і підтримуючу атмосферу, де кожен може почувати себе комфортно і мотивовано.</p>
        <p className={styles['about-intro_text2']}>Наші тренери - це висококваліфіковані спеціалісти з багаторічним досвідом роботи у фітнес-індустрії. Вони постійно вдосконалюють свої знання та навички, відвідуючи тренінги та семінари, щоб бути в курсі останніх тенденцій і методик тренувань. Наші тренери готові допомогти вам розробити індивідуальну програму тренувань, яка буде максимально відповідати вашим потребам та цілям.</p>
        <p className={styles['about-intro_text3']}>Окрім стандартних групових занять, ми пропонуємо персональні тренування, які дозволяють більш детально працювати над вашими фітнес-цілями. Наші персональні тренери враховують ваші індивідуальні потреби, фізичні можливості та цілі, щоб створити програму, яка буде ефективною та безпечною для вас. Також у нас є спеціальні програми для вагітних жінок, літніх людей та дітей.</p>
        <div className={styles['about-intro_img']}></div>
      </section>

      <section className={styles['about-services']}>
        <h1 
        className={`${styles['about-services_title']}
        ${isLavandaRed ? styles['about-services_title_red'] : ''}
        `}
        >
          Наші послуги
        </h1>
        <p>Ми пропонуємо різноманітні тренування та послуги, включаючи:</p>
        <ul>
          <li>Групові заняття: від йоги до високоінтенсивних інтервальних тренувань (HIIT).</li>
          <li>Індивідуальні тренування з персональним тренером.</li>
          <li>Підготовка до спортивних змагань та марафонів.</li>
          <li>Фітнес-програми для схуднення та набору м'язової маси.</li>
          <li>Консультації з харчування та здорового способу життя.</li>
        </ul>
        <p>Незалежно від ваших цілей, наші тренери завжди готові допомогти вам розробити індивідуальний план тренувань та підтримати вас на кожному кроці досягнення ваших цілей.</p>
      </section>

      {/* <section className={styles['about-price']}>
        <PricingSection />
      </section> */}

      <section className={styles['about-team']}>
        <h1
        className={`${styles['about-team_title']}
          ${isLavandaRed ? styles['about-team_title_red'] : ''}
        `}
        >
          Наша команда
        </h1>
        <p>Наша команда складається з досвідчених та сертифікованих тренерів, які мають глибокі знання та велике бажання допомагати людям. Кожен з наших тренерів має свою спеціалізацію та підхід до тренувань, що дозволяє нам знайти ідеального тренера для кожного клієнта.</p>
        <p>Ми віримо, що успіх наших клієнтів - це наш успіх, тому ми завжди працюємо над тим, щоб надавати високоякісні послуги і підтримувати наших клієнтів на шляху до їхніх фітнес-цілей.</p>
        {/* <p>Знайти детальну інформацію про наших тренерів Ви можете на сторінці <Link href="/trainers"><a className={styles['navbar-list-item']}>наші тренери</a></Link></p> */}
      </section>

      <section className={styles['about-contact']}>
        <Form />
      </section>
    </div>
  );
};

export default About;
