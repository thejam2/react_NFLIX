const API_KEY = "10923b261ba94d897ac6b81148314a3f";
const BASE_PATH = "https://api.themoviedb.org/3";

interface IMovie {
    id: number;
    backdrop_path: string;
    poster_path: string;
    title: string;
    overview: string;
    release_date:string;
    popularity:number;
}

export interface IGetMoviesResult {
    dates: {
        maximum: string;
        minimum: string;
    };
    page: number;
    results: IMovie[];
    total_pages: number;
    total_results: number;
}

export interface IGetTopRatedMoviesResult {
    page: number;
    results: IMovie[];
    total_pages: number;
    total_results: number;
}

export function getMovies() {
    return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}&language=ko`).then(
        (response) => response.json()
    );
}

export function getTopRatedMovies() {
    return fetch(`${BASE_PATH}/movie/top_rated?api_key=${API_KEY}&language=ko`).then(
        (response) => response.json()
    );
}

export function getUpComingMovies() {
    return fetch(`${BASE_PATH}/movie/upcoming?api_key=${API_KEY}&language=ko`).then(
        (response) => response.json()
    );
}

export function getLatestTV() {
    return fetch(`${BASE_PATH}/tv/latest?api_key=${API_KEY}&language=ko`).then(
        (response) => response.json()
    );
}
export function getAiringTV() {
    return fetch(`${BASE_PATH}/tv/airing_today?api_key=${API_KEY}&language=ko`).then(
        (response) => response.json()
    );
}
export function getPopularTV() {
    return fetch(`${BASE_PATH}/tv/popular?api_key=${API_KEY}&language=ko`).then(
        (response) => response.json()
    );
}
export function getTopRatedTV() {
    return fetch(`${BASE_PATH}/tv/top_rated?api_key=${API_KEY}&language=ko`).then(
        (response) => response.json()
    );
}

export function getSearch(keyword:any) {
    return fetch(`${BASE_PATH}/search/multi?api_key=${API_KEY}&language=ko&query=${keyword}`).then(
        (response) => response.json()
    );
}