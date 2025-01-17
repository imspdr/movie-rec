import { css } from "@emotion/react";
import { observer } from "mobx-react";
import { useRootStore } from "@src/store/RootStoreProvider";
import MovieCard from "./components/MovieCard";
import DetailDialog from "./components/DetailDialog";
import { Divider, Typography, Tabs, Tab } from "@mui/material";
import { useState, useRef, useCallback, useEffect } from "react";
import sample from "./movieSample.json";

function MainPage() {
  const rootStore = useRootStore();
  const layoutWidth = Math.min(1000, rootStore.width);
  const nCol = Math.floor(layoutWidth / 160);
  const cardWidth = Math.floor(layoutWidth / nCol) - 20;

  const [tab, setTab] = useState(0);
  const [openDetail, setOpenDetail] = useState(false);
  const [getNew, setGetNew] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  const horizontalDisplay = css`
    display: flex;
    flex-direction: row;
    overflow: auto;
    height: calc(100vh - 120px);
    gap: 10px;
    width: ${(cardWidth + 20) * nCol - 5}px;
    flex-wrap: wrap;
  `;

  const onScroll = async () => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer || tab === 0) return;

    const { scrollTop, clientHeight, scrollHeight } = scrollContainer;

    if (scrollTop + clientHeight >= 0.95 * scrollHeight) {
      rootStore.getGivenMovieResult();
      if (rootStore.givenMovieList.length > 150) {
        rootStore.deletePrevMovies();
        scrollContainer.scrollTop =
          scrollContainer.scrollTop - (cardWidth * 1.6 + 10) * (30 / nCol);
      }
    }
  };

  useEffect(() => {
    if (getNew) {
      rootStore.getGivenMovieResult();
    }
  }, [getNew]);

  return (
    <>
      {openDetail && rootStore.selectedMovie && (
        <DetailDialog
          width={Math.min(rootStore.width - 20, 800)}
          movie={rootStore.selectedMovie}
          open={openDetail && !!rootStore.selectedMovie}
          onClose={() => {
            rootStore.setSelectedMovie(undefined);
            setOpenDetail(false);
          }}
        />
      )}
      <div
        css={css`
          display: flex;
          flex-direction: column;
          width: ${rootStore.width - 5}px;
          align-items: center;
          gap: 10px;
        `}
      >
        <Tabs value={tab} onChange={(e, v) => setTab(v)}>
          <Tab label="상영중" />
          <Tab label="평점이 높은 영화" />
        </Tabs>

        {tab === 0 ? (
          <div css={horizontalDisplay} key={"new movies"}>
            {rootStore.newMovieList.map((movie) => (
              <MovieCard
                movie={movie}
                width={cardWidth}
                onClick={() => {
                  rootStore.setSelectedMovie(movie);
                  setOpenDetail(true);
                }}
              />
            ))}
          </div>
        ) : (
          <div key={"old movies"} css={horizontalDisplay} ref={scrollRef} onScroll={onScroll}>
            {rootStore.givenMovieList.map((movie) => (
              <MovieCard
                movie={movie}
                width={cardWidth}
                onClick={() => {
                  rootStore.setSelectedMovie(movie);
                  setOpenDetail(true);
                }}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default observer(MainPage);
