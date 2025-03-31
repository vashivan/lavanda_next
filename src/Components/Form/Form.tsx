import { useState } from "react";
import { FormData } from "../../Utils/Types";
import styles from '../../styles/Form.module.scss';
import axios from 'axios';
import MiniLoader from "../MiniLoader/MiniLoader";
import { useStudio } from "@/context/StudioContext";

const Form = () => {
  const { studio } = useStudio();
  const isLavandaRed = studio === "lavanda_red";
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [agreementChecked, setAgreementChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAgreement = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAgreementChecked(e.target.checked);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isFormValid = 
  formData.name &&
  formData.phone &&
  formData.message &&
  agreementChecked;

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      message: '',
    });
    setAgreementChecked(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    console.log(formData);

    const lavandaData = {
      service_id: 'service_4qzmcqt',
      template_id: 'template_4tzi8uz',
      user_id: 'JO5EenBZtLwYS-_-V',
      template_params: {
        'name': formData.name,
        'email': formData.email,
        'phone': formData.phone,
        'message': formData.message,
      }
    };

    try {
      const response2 = await axios.post('https://api.emailjs.com/api/v1.0/email/send', lavandaData);
      console.log(response2.data);
      
      setErrorMessage('Повідомлення надіслано! Дякуємо за звернення');
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
      resetForm();
      setIsLoading(false);
    } catch (error) {
      console.error('Error sending email:', error);
      setErrorMessage('Йой, сталася помилка..... Нам дуже прикро, спробуйте знову трохи пізніше ' + JSON.stringify(error));
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
      setIsLoading(false);
    }
  };

  return (
    <div className={styles['form-section']}>
      {errorMessage && (
        <div className={styles['form-section_notification']}>
          {errorMessage}
        </div>
      )}
      <h1 className={`${styles['form-section_title']}
        ${isLavandaRed ? styles['form-section_title_red'] : ''}`}
      >
        Зворотній зв'язок
      </h1>
      <p className={styles['form-section_text']}>
        Якщо у вас виникли питання або пропозиції, будь ласка, залиште заявку з вашим повідомленням. Наш менеджер зв'яжеться з вами якнайшвидше, щоб надати необхідну інформацію та допомогу. Ми завжди раді допомогти вам і відповісти на всі ваші запитання. Дякуємо, що обрали нашу студію!
      </p>
      <form className={`${styles['form-section_form']} 
        ${isLavandaRed ? styles['form-section_form_red'] : ''}`}
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Ім'я*"
          required
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Електронна пошта"
        />
        <input
          type="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Номер телефону*"
          required
        />
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="Ваше повідомлення*"
          required
        />
        <label>
          <input
            type="checkbox"
            name="agreement"
            checked={agreementChecked}
            onChange={handleAgreement}
            required
          />
          Я даю згоду на обробку моїх персональних даних відповідно до <a href="/privacy-policy">Політики конфіденційності</a>
        </label>
        <button
          type="submit"
          className={`${styles['form-section_form_btn']}
            ${isLavandaRed ? styles['form-section_form_btn_red'] : ''}`}
          disabled={!isFormValid || isLoading}
        >
          {isLoading ? <MiniLoader /> : 'Надіслати'}
        </button>

        {formData.message && (
          <button
          className={`${styles['form-section_form_btn']} 
            ${styles['form-section_form_btn_reset']}
            ${isLavandaRed ? styles['form-section_form_btn_reset_red'] : ''}
            `}
            type="reset"
            onClick={resetForm}
          >
            Скасувати
          </button>
        )}
      </form>
      <div className={styles['form-section_img']}></div>
    </div>
  );
};

export default Form;