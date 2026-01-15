// Replace with a valid key. For development/demo, users often need their own.
// Using a placeholder or temporary key is common practice in scaffolds.
const TMDB_API_KEY = '69cab7e94d64e0799191efbfe64e56ce';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

export interface TmdbMovie {
    id: number;
    title?: string; // Movies
    name?: string; // TV
    release_date?: string; // Movies
    first_air_date?: string; // TV
    poster_path: string | null;
    vote_average: number;
    genre_ids?: number[];
    media_type?: 'movie' | 'tv';
}

export interface TmdbMovieDetails extends TmdbMovie {
    genres: { id: number; name: string }[];
    runtime: number;
    overview: string;
    imdb_id: string | null;
}

export interface WatchProvider {
    provider_id: number;
    provider_name: string;
    logo_path: string;
}

export const tmdbService = {
    searchMulti: async (query: string): Promise<TmdbMovie[]> => {
        try {
            // if (TMDB_API_KEY === 'YOUR_TMDB_API_KEY_HERE') {
            //     console.warn('TMDB API Key missing');
            //     return [];
            // }
            const res = await fetch(`${TMDB_BASE_URL}/search/multi?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&language=pt-BR`);
            const data = await res.json();
            // Filter only movies and tv
            return (data.results || []).filter((i: any) => i.media_type === 'movie' || i.media_type === 'tv');
        } catch (error) {
            console.error(error);
            return [];
        }
    },

    // Deprecated specific search, aliased to multi for backward comp or updated if needed
    searchMovie: async (query: string): Promise<TmdbMovie[]> => {
        return tmdbService.searchMulti(query);
    },

    getMovieDetails: async (id: number, type: 'movie' | 'tv' = 'movie'): Promise<TmdbMovieDetails | null> => {
        try {
            const res = await fetch(`${TMDB_BASE_URL}/${type}/${id}?api_key=${TMDB_API_KEY}&language=pt-BR`);
            const data = await res.json();
            return {
                ...data,
                media_type: type // Ensure media_type is present in details
            };
        } catch (error) {
            console.error(error);
            return null;
        }
    },

    getWatchProviders: async (id: number, type: 'movie' | 'tv' = 'movie'): Promise<WatchProvider[]> => {
        try {
            const res = await fetch(`${TMDB_BASE_URL}/${type}/${id}/watch/providers?api_key=${TMDB_API_KEY}`);
            const data = await res.json();
            // Get Brazil providers (flatrate usually means streaming subscription)
            const br = data.results?.BR;
            if (br && br.flatrate) {
                return br.flatrate;
            }
            return [];
        } catch (error) {
            console.error(error);
            return [];
        }
    },

    getImageUrl: (path: string | null) => {
        if (!path) return '';
        return `${IMAGE_BASE_URL}${path}`;
    },

    getProviderLogoUrl: (path: string | null) => {
        if (!path) return '';
        return `${IMAGE_BASE_URL}${path}`;
    }
};
