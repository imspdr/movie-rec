import ReactPlayer from "react-youtube";
import { css } from "@emotion/react";
import { Dialog, Typography, Chip, Box, CircularProgress } from "@mui/material";
import { Movie } from "@src/store/types";
import { useState } from "react";

function RatingBox(props: { rating: number }) {
  return (
    <Box
      css={css`
        position: relative;
        width: 40px;
        height: 40px;
      `}
    >
      <CircularProgress
        variant="determinate"
        value={props.rating}
        size={40}
        thickness={6}
        css={css`
          color: ${props.rating >= 75 ? "#4caf50" : props.rating >= 50 ? "#ffb74d" : "#f44336"};
        `}
      />
      <Box
        css={css`
          position: absolute;
          display: flex;
          align-items: center;
          justify-content: center;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          font-size: 10px;
          font-weight: bold;
          color: var(--foreground);
        `}
      >
        {props.rating}
      </Box>
    </Box>
  );
}

export default function DetailDialog(props: {
  width: number;
  movie: Movie;
  open: boolean;
  onClose: () => void;
}) {
  const extractVideoId = (url: string) => {
    const regExp =
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regExp);
    return match ? match[1] : null;
  };

  const videoId = extractVideoId(props.movie.url);
  const opts = {
    width: `100%`,
    playerVars: {
      autoplay: 1,
      controls: 0,
      modestbranding: 1,
      rel: 0,
      showinfo: 0,
      disablekb: 1,
    },
    height: `${Math.round(props.width / 1.6)}px`,
  };
  return (
    <Dialog
      open={props.open}
      onClose={props.onClose}
      css={css`
        & .MuiDialog-paper {
          background-color: var(--paper);
          margin: 10px;
          width: ${props.width}px;
        }
      `}
    >
      {!(props.movie.url == "no trailer") && videoId ? (
        <ReactPlayer videoId={videoId} opts={opts} />
      ) : (
        <div
          css={css`
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: ${Math.round(props.width / 1.6)}px;
          `}
        >
          {"no trailer"}
        </div>
      )}
      <div
        css={css`
          padding: 10px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        `}
      >
        <div
          css={css`
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            width: 100%;
          `}
        >
          {/* Title */}
          <Typography
            variant="h6"
            css={css`
              font-weight: bold;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            `}
          >
            {props.movie.title}
          </Typography>

          {/* Rating */}
          <RatingBox rating={Math.round(props.movie.rating * 10)} />
        </div>
        {/* Release Date */}
        <Typography
          variant="body2"
          css={css`
            color: #666;
          `}
        >
          개봉일: {props.movie.release_date}
        </Typography>

        {/* Description */}
        <Typography
          variant="body2"
          css={css`
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 5;
            -webkit-box-orient: vertical;
          `}
        >
          {props.movie.description}
        </Typography>

        {/* Genres */}
        <Box
          css={css`
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
          `}
        >
          {props.movie.genre.split(",").map((genre, index) => (
            <Chip
              key={index}
              label={genre}
              css={css`
                background-color: #f0f0f0;
                font-size: 12px;
                font-weight: bold;
                color: #555;
              `}
            />
          ))}
        </Box>
      </div>
    </Dialog>
  );
}
