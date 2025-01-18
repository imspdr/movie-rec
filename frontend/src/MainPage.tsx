import { css } from "@emotion/react";
import { observer } from "mobx-react";
import { useRootStore } from "@src/store/RootStoreProvider";
import MovieCard from "./components/MovieCard";
import DetailDialog from "./components/DetailDialog";
import { Tabs, Tab, Button } from "@mui/material";
import { useState, useRef } from "react";

function MainPage() {
  const rootStore = useRootStore();
  const layoutWidth = Math.min(1000, rootStore.width);
  const nCol = Math.floor(layoutWidth / 160);
  const cardWidth = Math.floor(layoutWidth / nCol) - 20;

  const [tab, setTab] = useState(0);
  const [openDetail, setOpenDetail] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  const horizontalDisplay = css`
    display: flex;
    flex-direction: row;
    overflow: auto;
    height: calc(100vh - 120px);
    max-width: 1000px;
    gap: 10px;
    flex-wrap: wrap;
    align-content: flex-start;
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
          width: 100%;
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
            <Button
              onClick={() => {
                rootStore.getGivenMovieResult();
              }}
              css={css`
                color: var(--highlight);
                display: flex;
                justify-self: center;
                width: 100%;
              `}
            >
              {"더 불러오기"}
            </Button>
          </div>
        )}
      </div>
    </>
  );
}

export default observer(MainPage);
