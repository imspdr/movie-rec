import pandas as pd
import requests
import time

API_KEY = "use_your_own_tmdb_api_key"
DISCOVER_URL = "https://api.themoviedb.org/3/discover/movie"
MOVIE_DETAILS_URL = "https://api.themoviedb.org/3/movie/{movie_id}"
KEYWORDS_URL = "https://api.themoviedb.org/3/movie/{movie_id}/keywords"
POSTER_BASE_URL = "https://image.tmdb.org/t/p/w500"

def fetch_movie_ids(after_year=1980, min_rating=7.0, max_pages=500):
    """Fetch movie IDs from the TMDb Discover API."""
    movie_ids = []
    for page in range(1, max_pages + 1):
        params = {
            "api_key": API_KEY,
            "language": "ko-KR",
            "sort_by": "vote_average.desc",
            "primary_release_date.gte": f"{after_year}-01-01",
            "primary_release_date.lte": f"2025-01-01",
            "vote_count.gte": 500,
            "vote_average.gte": min_rating,
            "page": page
        }
        response = requests.get(DISCOVER_URL, params=params)
        if response.status_code == 200:
            data = response.json()
            if len(data.get("results")) < 1:
                break
            for movie in data.get("results", []):
                movie_ids.append(movie["id"])

            print(f"fetched page {page}")
        else:
            print(f"Failed to fetch page {page}: {response.status_code}")
            break  # Exit if there's an error
        time.sleep(0.1)  # Avoid hitting rate limits
    return movie_ids

def fetch_movie_details(movie_id):
    """Fetch detailed information for a single movie."""
    response_kr = requests.get(MOVIE_DETAILS_URL.format(movie_id=movie_id), params={"api_key": API_KEY, "language": "ko-KR"})
    #response = requests.get(MOVIE_DETAILS_URL.format(movie_id=movie_id), params={"api_key": API_KEY})

    if response_kr.status_code == 200:
        kr_data = response_kr.json()
        keywords = fetch_movie_keywords(movie_id)
        url = get_movie_trailer_url(movie_id)
        keywords_string = ", ".join(keywords)
        genre_string = ", ".join(genre["name"] for genre in kr_data.get("genres", []))
        return {
            "id": kr_data.get("id"),
            "title": kr_data.get("title"),
            "genre": genre_string,
            "poster_url": f"{POSTER_BASE_URL}{kr_data.get('poster_path')}" if kr_data.get("poster_path") else None,
            "release_date": kr_data.get("release_date"),
            "rating": kr_data.get("vote_average"),
            "words": keywords_string,
            "description": kr_data.get("overview", "").replace("\n", " ").replace("\r", " "),
            "url": url if url else "no trailer"
        }
    else:
        print(f"Failed to fetch details for movie ID {movie_id}: {response_kr.status_code}")
        return None


def get_movie_trailer_url(movie_id):
    base_url = f"https://api.themoviedb.org/3/movie/{movie_id}/videos"
    params = {"api_key": API_KEY, "language": "ko-KR"}

    try:
        response = requests.get(base_url, params=params)
        response.raise_for_status()
        videos = response.json().get("results", [])

        # Filter for trailers hosted on YouTube
        for video in videos:
            if video["type"] == "Trailer" and video["site"] == "YouTube":
                return f"https://www.youtube.com/watch?v={video['key']}"

        new_response = requests.get(base_url, params={"api_key": API_KEY})
        new_response.raise_for_status()
        videos = new_response.json().get("results", [])

        # Filter for trailers hosted on YouTube
        for video in videos:
            if video["type"] == "Trailer" and video["site"] == "YouTube":
                return f"https://www.youtube.com/watch?v={video['key']}"
        return None  # No trailer found
    except requests.exceptions.RequestException as e:
        print(f"An error occurred: {e}")
        return None

def fetch_movie_keywords(movie_id):
    """Fetch keywords (tags) for a movie."""
    response = requests.get(KEYWORDS_URL.format(movie_id=movie_id), params={"api_key": API_KEY})
    if response.status_code == 200:
        data = response.json()
        return [keyword["name"] for keyword in data.get("keywords", [])]
    else:
        print(f"Failed to fetch keywords for movie ID {movie_id}: {response.status_code}")
        return []

def main():
    # Step 1: Fetch movie IDs
    print("Fetching movie IDs...")
    movie_ids = fetch_movie_ids(max_pages=500)
    print(f"Fetched {len(movie_ids)} movie IDs.")

    # Step 2: Fetch movie details
    print("Fetching movie details...")
    movies = []
    for i, movie_id in enumerate(movie_ids):
        movie = fetch_movie_details(movie_id)
        if movie:
            movies.append(movie)
        # Print progress every 100 movies
        if (i + 1) % 100 == 0:
            print(f"Fetched details for {i + 1} movies.")
        time.sleep(0.1)

    # Step 3: Save data to CSV
    print("Saving data to CSV...")
    pd.DataFrame(movies).to_csv("movies.csv", index=False)
    movies = pd.read_csv("movies.csv")
    movies = movies[movies["words"].notna() & movies["description"].notna() & movies["genre"].notna()]
    movies.to_csv("filtered_movies.csv", index=False)

if __name__ == "__main__":
    main()