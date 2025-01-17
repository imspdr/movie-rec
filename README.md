# movie-rec

## Description

영화를 추천해주는 프로젝트. 

TMDB API를 이용해 영화 정보를 수집한 후 TF-IDF 모델을 이용해 영화 키워드를 기반으로 임베딩을 진행한다. 

사용자가 흥미롭게 생각하는 영화 목록을 입력하면, 해당 영화들의 키워드를 이용해 선호도 벡터를 만들고 코사인 유사도를 계산하여 저장한 영화 풀 내에서 유사도 순서대로 영화를 반환한다.

현재 상영중인 영화 정보는 별도로 저장한 후, 위와 같은 과정을 진행한다. 

프론트엔드 기능으로는 유튜브 영상을 임베딩하는 기능, 무한 스크롤 등을 구현했다. 

## Points

### 1. 모델, 백엔드 

영화를 추천해주는 프로젝트는 이전에 한번 진행해 본 적이 있다. BERT 모델에 MovieLens 데이터를 학습시켰었는데, 모델 자체가 무거운 데에 비해 시퀀셜한 추론을 하다보니 영화 추천 결과가 납득이 가지 않는 경우가 많았고, MovieLens 데이터에 2018년도까지의 영화 밖에 주어지지 않고 고전 영화 정보가 많아 실효성이 떨어진다는 느낌이 강했다.

이번에는 이런 점들을 보완하여 상대적으로 가벼운 모델을 선정하였고, 키워드를 기반으로 임베딩하여 추천 결과가 직관적이도록 했다. 모델로 상용한 TF-IDF는 주어진 텍스트 내에 포함된 단어의 빈도와, 해당 단어가 다른 텍스트에 비해 얼마나 희귀한지를 이용해 텍스트를 임베딩하는 방식이다.

또한, 영화 정보도 백엔드에서 하루에 한번 실시간으로 상영중인 영화 정보를 받아오도록 했고, 모델에는 TMDB 데이터 중 평점 7.0 이상, 1980년도 이후의 영화만을 이용해서 추천 결과가 상대적으로 실효성이 있도록했다.  


### 2. 무한 스크롤

프론트엔드 기능으로서는 대부분 외부 모듈을 이용하여 쉽게 구현했다. Youtube영상을 임베딩하는 부분은 react-youtube 모듈을, 영화를 검색하여 취향을 저장하는 부분에는 Autocomplete를 사용하였다. 

직접 구현한 부분은 무한 스크롤 기능이 기술적으로 유의미한데, 스크롤 동작 중 scrollTop 값과, scrollHeight, clientHeight 등을 비교하여 스크롤 위치를 파악하고, 충분히 아래에 있을 때 추가 데이터를 불러오도록했다. 

데이터가 일정량 이상 쌓일 경우 앞부분의 데이터를 삭제하고, 그만큼 스크롤 위치를 조절하여 자연스럽게 보이면서도 메모리 효율을 높일 수 있도록 구현했다.

## Dependency

- 프론트
    - react 18, mui 6 - 자세한 버전은 frontend/package.json
- 백엔드
    - fastAPI, sklearn - 자세한 버전은 backend/requirements.txt