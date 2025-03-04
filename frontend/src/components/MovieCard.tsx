import { css } from "@emotion/react";
import { Skeleton, Typography } from "@mui/material";
import { Movie } from "@src/store/types";
import { useState } from "react";

export default function MovieCard(props: { movie: Movie; width: number; onClick: () => void }) {
  const [hover, setHover] = useState(false);
  const [loaded, setLoaded] = useState(false);
  return (
    <div
      key={`${props.movie.id}`}
      css={css`
        display: flex;
        flex-direction: column;
        border-radius: 10px;
        position: relative;
        padding: ${hover ? 0 : 5}px;
        width: ${props.width + (hover ? 10 : 0)}px;
        height: ${props.width * 1.6 + (hover ? 10 : 0)}px;
        background-color: var(--background);
      `}
      onMouseLeave={() => setHover(false)}
      onMouseEnter={() => setHover(true)}
      onClick={props.onClick}
    >
      {!loaded && (
        <Skeleton
          variant="rectangular"
          css={css`
            border-radius: 10px;
            position: absolute;
            top: 0;
            width: ${props.width + (hover ? 10 : 0)}px;
            height: ${props.width * 1.6 + (hover ? 10 : 0)}px;
          `}
        ></Skeleton>
      )}
      <img
        src={props.movie.poster_url}
        css={css`
          border-radius: 10px;
          position: absolute;
          width: ${props.width + (hover ? 10 : 0)}px;
          height: ${props.width * 1.6 + (hover ? 10 : 0)}px;
        `}
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}
