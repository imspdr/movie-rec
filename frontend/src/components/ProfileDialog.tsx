import { observer } from "mobx-react";
import { useRootStore } from "@src/store/RootStoreProvider";
import { css } from "@emotion/react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { MovieSimple } from "@src/store/types";
import { useState } from "react";

function MovieCard(props: { title: string; onDelete: () => void }) {
  return (
    <div
      css={css`
        height: 20px;
        width: calc(100% - 20px);
        padding: 10px;
        border-radius: 10px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        background-color: var(--highlight);
      `}
    >
      <Typography
        css={css`
          width: 80%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        `}
      >
        {props.title}
      </Typography>
      <ClearIcon onClick={props.onDelete} />
    </div>
  );
}

function ProfileDialog(props: { open: boolean; setOpen: (v: boolean) => void }) {
  const rootStore = useRootStore();
  const [selectedMovies, setSelectedMovies] = useState<MovieSimple[]>(rootStore.favoriteMovies);
  const handleClose = () => {
    props.setOpen(false);
  };
  const handleComplete = () => {
    rootStore.setFavorites(selectedMovies);
    props.setOpen(false);
  };
  return (
    <>
      <IconButton onClick={() => props.setOpen(!props.open)}>
        <AccountCircleIcon />
      </IconButton>
      {props.open && (
        <Dialog
          open={props.open}
          onClose={handleClose}
          fullWidth={true}
          css={css`
            & .MuiDialog-paper {
              height: 80%;
              width: ${(Math.min(rootStore.width - 10), 500)}px;
              margin: 10px;
            }
          `}
        >
          <DialogTitle>
            <span>재밌게 본 영화를 선택하세요!</span>
          </DialogTitle>
          <DialogContent>
            <div
              css={css`
                display: flex;
                flex-direction: column;
                gap: 10px;
              `}
            >
              <Autocomplete
                disablePortal
                options={rootStore.moviePool.map((movie) => {
                  return {
                    label: movie.title,
                    id: movie.id,
                  };
                })}
                css={css`
                  .MuiOutlinedInput-root {
                    height: 50px;
                    border: 1px solid;
                    border-radius: 10px;
                  }
                `}
                renderInput={(params) => <TextField {...params} placeholder="영화 선택" />}
                onChange={(e, v) => {
                  if (v && v.id) {
                    const selected = rootStore.moviePool.find((movie) => movie.id == v.id);
                    if (selected && !selectedMovies.includes(selected)) {
                      setSelectedMovies((v) => [...v, selected]);
                    }
                  }
                }}
              />
              {selectedMovies.map((movie) => {
                return (
                  <MovieCard
                    title={movie.title}
                    onDelete={() => {
                      setSelectedMovies((v) => v.filter((mo) => mo.id !== movie.id));
                    }}
                  />
                );
              })}
            </div>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleClose}
              css={css`
                color: var(--foreground);
              `}
            >
              취소
            </Button>
            <Button
              onClick={handleComplete}
              variant="contained"
              autoFocus
              css={css`
                background-color: var(--highlight);
              `}
            >
              완료
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
}

export default observer(ProfileDialog);
