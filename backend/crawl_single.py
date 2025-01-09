import requests
from bs4 import BeautifulSoup


code = "49017"
url = f'https://www.themoviedb.org/movie/{code}?language=ko-KR'

result = requests.get(url, headers={"User-agent": "Mozilla/5.0"}).text
soup = BeautifulSoup(result, "html.parser")


img = str(soup.find(class_="poster w-full")["src"])
try:
    info = soup.find(class_="title ott_true").find_all("a")
except AttributeError:
    info = soup.find(class_="title ott_false").find_all("a")
title = str(info[0].text)
tags = list(map(lambda a: str(a.text), info[1:]))
release = str(soup.find(class_="release").text).strip()
description = str(soup.find(class_="overview").text).strip()

print(title)
print(tags)
print(img)
print(release)
print(description)