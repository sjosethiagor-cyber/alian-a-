export const OMDB_API_KEY = '9a318182'; // Free tier key (often used in examples, but user might need their own)

export interface OMDbSearchResult {
    Title: string;
    Year: string;
    imdbID: string;
    Type: string;
    Poster: string;
}

export interface OMDbMovieDetail {
    Title: string;
    Year: string;
    Rated: string;
    Released: string;
    Runtime: string;
    Genre: string;
    Director: string;
    Writer: string;
    Actors: string;
    Plot: string;
    Language: string;
    Country: string;
    Awards: string;
    Poster: string;
    Ratings: { Source: string; Value: string }[];
    Metascore: string;
    imdbRating: string;
    imdbVotes: string;
    imdbID: string;
    Type: string;
    Response: string;
    Error?: string;
}

export const omdbService = {
    searchMovie: async (title: string): Promise<OMDbSearchResult[]> => {
        try {
            const response = await fetch(`https://www.omdbapi.com/?s=${encodeURIComponent(title)}&apikey=${OMDB_API_KEY}`);
            const data = await response.json();
            if (data.Response === 'True') {
                return data.Search || [];
            }
            return [];
        } catch (error) {
            console.error('Error searching OMDb:', error);
            return [];
        }
    },

    getMovieDetails: async (imdbID: string): Promise<OMDbMovieDetail | null> => {
        try {
            const response = await fetch(`https://www.omdbapi.com/?i=${imdbID}&apikey=${OMDB_API_KEY}`);
            const data = await response.json();
            if (data.Response === 'True') {
                return data;
            }
            return null;
        } catch (error) {
            console.error('Error fetching movie details:', error);
            return null;
        }
    }
};
