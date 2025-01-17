import { runInAction, makeAutoObservable } from "mobx";
import { MovieSimple, Movie } from "./types";
import { moviesAPI } from "./apis";

export class RootStore {
  width: number;
  favoriteMovies: MovieSimple[];
  moviePool: MovieSimple[];
  givenMovieList: Movie[];
  newMovieList: Movie[];

  nowIndex: number;
  selectedMovie: Movie | undefined;

  loading: boolean;

  constructor() {
    this.width = 800;
    this.favoriteMovies = [];
    this.givenMovieList = [];
    this.newMovieList = [];
    this.moviePool = [];
    this.nowIndex = 0;

    this.loading = false;
    makeAutoObservable(this);
  }

  setWidth = (width: number) => {
    runInAction(() => {
      this.width = width;
    });
  };

  setFavorites = (movies: MovieSimple[]) => {
    runInAction(() => {
      this.favoriteMovies = movies;
      this.nowIndex = 0;

      this.givenMovieList = [];
      this.newMovieList = [];
    });
    this.getGivenMovieResult();
    this.getNewMovieResult();
  };

  setSelectedMovie = (movie: Movie | undefined) => {
    runInAction(() => {
      this.selectedMovie = movie;
    });
  };

  generateMovieList = async () => {
    if (this.moviePool.length > 0) {
      return;
    } else {
      const movies = await moviesAPI.getMovieAll();
      runInAction(() => {
        this.moviePool = movies;
      });
    }
  };
  getNewMovieResult = async () => {
    const movies = await moviesAPI.postMovieNew(this.favoriteMovies.map((movie) => movie.id));
    runInAction(() => {
      this.newMovieList = movies;
    });
  };

  getGivenMovieResult = async () => {
    if (this.loading) return false;
    runInAction(() => {
      this.loading = true;
    });
    const res = await moviesAPI.postMoviesPast(
      this.favoriteMovies.map((movie) => movie.id),
      this.nowIndex,
      30
    );
    const movies = res.data;
    runInAction(() => {
      this.givenMovieList = [...this.givenMovieList, ...movies];
      this.nowIndex = res.index;
      this.loading = false;
    });
    return true;
  };
  deletePrevMovies = () => {
    runInAction(() => {
      this.givenMovieList = this.givenMovieList.slice(-150);
    });
  };
}
