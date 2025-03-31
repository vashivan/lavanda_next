export type Info = {
  years: string,
  study: string,
  accents: string
}

export type Trainer = {
  id?: number,
  name: string,
  surname: string,
  imgSrc: string,
  slogan: string,
  info: Info,
  images: string[]
  intro: string
};

export type ReviewType  = {
  id?: number,
  name: string,
  date: string,
  content: string
};

export type FormData = {
  name: string,
  email: string,
  phone: string,
  message: string
};

export type Participant = {
  name: string;
  images?: string[]; // Optional since not all participants have images
  outfit?: string; // Optional if outfit is not available for all
  performance: string;
  placement: string;
};

export type NewsItem = {
  id: number;
  date: string;
  title: string;
  image: string,
  participants: Participant[];
  message: string;
};

export type Studio = "lavanda_red" | "lavanda_purple";