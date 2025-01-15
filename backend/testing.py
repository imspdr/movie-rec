import requests

def get_newly_released_movies(api_key, region="KR"):
    """
    Fetches newly released movies in the specified region (default: South Korea).

    :param api_key: Your TMDB API key.
    :param region: Region code (e.g., "KR" for South Korea).
    :return: List of newly released movies.
    """
    url = "https://api.themoviedb.org/3/movie/now_playing"
    params = {
        "api_key": api_key,
        "language": "ko-KR",  # Korean language for metadata
        "region": region,     # South Korea region
        "page": 5             # Page number for pagination
    }

    response = requests.get(url, params=params)
    if response.status_code == 200:
        data = response.json()
        movies = data.get("results", [])
        return movies
    else:
        print(f"Error: {response.status_code}, {response.text}")
        return []

# Replace with your TMDB API key
api_key = "d4f799e86e9e5da8855a6a3db4a9dbe7"

# Get newly released movies in South Korea
movies = get_newly_released_movies(api_key)

# Print movie titles
if movies:
    print("Newly Released Movies in South Korea:")
    for movie in movies:
        print(f"- {movie['title']} (Release Date: {movie['release_date']})")
else:
    print("No movies found.")