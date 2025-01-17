import axios from "axios";
import { MovieSimple, Movie } from "./types";
const BACKURL = "/back";

export const moviesAPI = {
  getMovieAll: async () => {
    const ret = await axios
      .get(BACKURL + `/movies/all`)
      .then((data: any) => {
        return data.data;
      })
      .catch((e) => {
        return [];
      });
    return ret as MovieSimple[];
  },
  postMoviesPast: async (ids: number[], index: number, length: number) => {
    const ret = await axios
      .post(BACKURL + `/movies/past/index/${index}/length/${length}`, {
        ids: ids,
      })
      .then((data: any) => {
        return data.data;
      })
      .catch((e) => {
        return {
          data: [],
          index: 0,
        };
      });
    return ret as {
      data: Movie[];
      index: number;
    };
  },
  postMovieNew: async (ids: number[]) => {
    const ret = await axios
      .post(BACKURL + `/movies/new`, {
        ids: ids,
      })
      .then((data: any) => {
        return data.data;
      })
      .catch((e) => {
        return [];
      });
    return ret as Movie[];
  },
};
