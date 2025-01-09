import axios from "axios";
import { TimeseriesData, NewsData, StockData } from "./types";
const BACKURL = "/back";

export const predictAPI = {
  getKospi200: async () => {
    const ret = await axios
      .get(BACKURL + `/kospi200`)
      .then((data: any) => {
        return data.data;
      })
      .catch((e) => {
        return [];
      });
    return ret as StockData[];
  },
  getNews: async (keyword: string) => {
    const ret = await axios
      .get(BACKURL + `/crawl_news/${keyword}`)
      .then((data: any) => {
        return data.data;
      })
      .catch((e) => {
        return [];
      });
    return ret as NewsData[];
  },
  getTimeseriesData: async (code: string, length: number, period: number) => {
    const ret = await axios
      .get(BACKURL + `/stock/${code}/length/${length}/period/${period}`)
      .then((data: any) => {
        return data.data;
      })
      .catch((e) => {
        return [];
      });
    return ret as TimeseriesData;
  },
};
