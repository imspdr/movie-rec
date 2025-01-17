from fastapi import FastAPI
from pydantic import BaseModel
import pytz
import joblib
import requests
import time
import asyncio
import pandas as pd
import numpy as np
from contextlib import asynccontextmanager
from sklearn.metrics.pairwise import cosine_similarity
from model.build_movie_database import API_KEY, fetch_movie_details

tfidf = joblib.load("model/tfidf_model.joblib")
svd = joblib.load("model/svd_model.joblib")
embeddings_df = pd.read_csv("model/movie_embeddings.csv")
movie_df = pd.read_csv("model/filtered_movies.csv")
kst = pytz.timezone('Asia/Seoul')

new_movies = None
new_movies_embedding_df = None

class MovieRequest(BaseModel):
    ids: list[int]

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("start server")
    asyncio.create_task(schedule_movie_update())
    yield

    print("shutting down server")

app = FastAPI(lifespan=lifespan)

async def get_newly_released_movies():
    global new_movies, new_movies_embedding_df
    url = "https://api.themoviedb.org/3/movie/now_playing"
    new_movies_list = []
    for i in range(10):
        params = {
            "api_key": API_KEY,
            "language": "ko-KR",
            "region": "KR",
            "page": i + 1
        }

        response = requests.get(url, params=params)
        if response.status_code == 200:
            data = response.json()
            movies = data.get("results", [])
            for movie in movies:
                new_movies_list.append(fetch_movie_details(movie["id"]))
                time.sleep(0.1)
            if len(movies) < 1:
                break
        else:
            print(f"Error: {response.status_code}, {response.text}")
            break

    new_movies = pd.DataFrame(new_movies_list)
    new_tfidf = tfidf.transform(new_movies["words"])
    new_movies_embedding = svd.transform(new_tfidf)
    new_movies_embedding_df = pd.DataFrame(new_movies_embedding, columns=[f"dim_{i}" for i in range(50)])
    new_movies_embedding_df["id"] = new_movies["id"]

async def schedule_movie_update():
    while True:
        await get_newly_released_movies()
        await asyncio.sleep(82400)

@app.get("/movies/all")
def get_movies_all():
    return movie_df[["id", "title", "release_date"]].to_dict(orient="records")

@app.post("/movies/past/index/{index}/length/{length}")
def inference_from_ids(request: MovieRequest, index: int=0, length: int=10):
    text = ""
    for id in request.ids:
        text += get_movie_info(id)["words"]

    new_tfidf = tfidf.transform([text])
    movie_embedding = svd.transform(new_tfidf)

    movie_embeddings = embeddings_df.drop(columns=["id"]).values
    similarities = cosine_similarity(movie_embedding, movie_embeddings)

    top_indices = np.argsort(similarities[0])[::-1][index:]
    similar_movies = embeddings_df.iloc[top_indices][["id"]].values

    result = []
    now_length = 0
    for movie_id in similar_movies:
        if movie_id[0] in request.ids:
            continue
        movie = get_movie_info(movie_id[0])
        if movie:
            result.append(movie)
            now_length += 1
        if now_length >= length:
            break
    return {"data": result, "index": index + now_length}

@app.post("/movies/new")
def compare_new_movies(request: MovieRequest):
    text = ""
    for id in request.ids:
        text += get_movie_info(id)["words"]

    new_tfidf = tfidf.transform([text])
    movie_embedding = svd.transform(new_tfidf)

    similarities = cosine_similarity(movie_embedding, new_movies_embedding_df.drop(columns=["id"]).values)
    top_indices = np.argsort(similarities[0])[::-1]
    similar_movies = new_movies_embedding_df.iloc[top_indices][["id"]].values
    result = []
    for ind, id in enumerate(similar_movies):
        if id[0] in request.ids:
            continue

        selected_movie = new_movies[new_movies["id"] == id[0]]
        if len(selected_movie) > 0:
            movie = selected_movie.iloc[0].to_dict()
        else:
            movie = None
        if movie:
            result.append(movie)

    return result

def get_movie_info(movie_id: int):
    selected_movie = movie_df[movie_df["id"] == movie_id]
    if len(selected_movie) > 0:
        return selected_movie.iloc[0].to_dict()
    else:
        return None