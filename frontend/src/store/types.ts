export type MovieSimple = {
  id: number;
  title: string;
  release_date: string;
};

export type Movie = {
  id: number;
  title: string;
  genre: string;
  poster_url: string;
  release_date: string;
  rating: number;
  words: string;
  description: string;
  url: string;
};
