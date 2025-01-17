import { css } from "@emotion/react";
import { Typography } from "@mui/material";
import { Movie } from "@src/store/types";
import { useState } from "react";

export default function MovieCard(props: { movie: Movie; width: number; onClick: () => void }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      key={`${props.movie.id}`}
      css={css`
        display: flex;
        flex-direction: column;
        border-radius: 10px;
        padding: ${hover ? 0 : 5}px;
        width: ${props.width + (hover ? 10 : 0)}px;
        height: ${props.width * 1.6 + (hover ? 10 : 0)}px;
        background-color: var(--background);
      `}
      onMouseLeave={() => setHover(false)}
      onMouseEnter={() => setHover(true)}
      onClick={props.onClick}
    >
      <img
        src={props.movie.poster_url}
        css={css`
          border-radius: 10px;
          width: ${props.width + (hover ? 10 : 0)}px;
          height: ${props.width * 1.6 + (hover ? 10 : 0)}px;
        `}
      />
    </div>
  );
}
