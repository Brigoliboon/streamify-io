import requests
class imdb:
    base_link="https://api.themoviedb.org/3"
    movie_sections = [{'title':'Popular Movies', 'path':"/movie/popular"},{'title': "Upcoming Movies",'path': "/movie/upcoming"},{'title': "This Week Trending Movies",'path': "/trending/movie/week"},{'title': "Top Rated Movies",'path': "/movie/top_rated"}]
    def __init__(self,headers, params:dict={'language':str, "page":str}):
        self.headers = headers
        self.params = params
    def fetch_movie_list(self, section_index:int) -> None:
        '''
        [0] Popular Movies \n
        [1] Upcoming Movies\n
        [2] This Week Trending Movies\n
        [3] Top Rated Movies\n
        '''
        movie_list = []
        link = f'{self.base_link}{self.movie_sections[section_index]["path"]}'
        response = requests.get(link,headers=self.headers, params=self.params).json()
        for movie in response['results']:
            movie_title = movie["original_title"]
            release_year = movie["release_date"]
            movie_list.append(f'{movie_title.replace(" ", "-")}-{release_year[:movie["release_date"].find("-")]}')
        return movie_list
    ffvfvfvffvddd