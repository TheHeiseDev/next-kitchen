type Messenger = {
    telegram?: string;
    max?: string;
    whatsApp?: string;
  };
  
  type Service = {
    name: string;
    description: string;
    price: number;
  };
  
  type Review = {
    [key: string]: unknown;
  };
  
  type User = {
    id: string;
    /** Номер телефона */
    email: string;
    phone: number;
    /** Фамилия */
    lastName: string;
    /** Имя */
    firstName: string;
    /** Дата регистрации в системе */
    registeredAt: Date;
    /** Район, в котором работает мастер */
    // ["Центр", "Ногина", "Чернышевского", "Борисовское шоссе", "Высоцкий район"]
    district: string;  
    /** Список услуг мастера */
    services: Service[];
    /** Отзывы клиентов */
    reviews: Review[];
       /** После оплаты по этому флагу отображаем мастера в поиске */
    isMaster: boolean
    /** Верифицирован ли аккаунт */
    isVerify: boolean;
    /**  Если купил возможность публикации услуг */
    topMaster: boolean;
    masterCategory: string //enum
    /** Контакты в мессенджерах */
    messengers: Messenger;
    /** Информация о мастере */
    about: string;
    /** График работы */
    workSchedule: string;
    /** Стаж работы */
    experience: string;
  };

  type UserRegistrationForm = {
    email: string
    password: string
    confirmPassword: string
    lastName: string;
    firstName: string;
  }