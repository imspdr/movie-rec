import requests
from bs4 import BeautifulSoup

# TMDb 영화 목록 페이지 URL (예시 URL, 실제 URL은 TMDb에서 확인 필요)
url = "https://www.themoviedb.org/movie?year=1990&sort_by=popularity.desc"

# HTTP GET 요청
response = requests.get(url)
if response.status_code != 200:
    print("페이지를 불러오는 데 실패했습니다.")
    exit()

# BeautifulSoup 객체 생성
soup = BeautifulSoup(response.text, "html.parser")

# 영화들의 ID를 찾기 (TMDb에서 영화 ID는 링크의 'movie/{id}' 형식으로 존재)
movies = soup.find_all("a", href=True)

# 1990년 이후 영화 ID 추출
movie_ids = []
for movie in movies:
    href = movie['href']
    if 'movie/' in href:
        movie_id = href.split('movie/')[1]
        movie_ids.append(movie_id)

# 영화 ID 출력
print(f"1990년 이후 영화들의 ID: {movie_ids}")  # 상위 10개만 출력
