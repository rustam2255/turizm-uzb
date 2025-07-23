import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { type ArticlesResponse, type Category, type DocumentDetailType, type DocumentItem, type GetDocumentsParams, type GetToursParams, type Hotel, type HotelData, type MagazineDetailType, type MagazineMap, type City, type NewsItem, type ToursResponse,  type MapPoint, type ResortsResponse, type ResortDetail, BanksResponse, ClinicsResponse, ShopsResponse, ShopDetail, ClinicDetail, BankDetail, MagazineImageResponse, NewsCategory, ArticleDetail, TourById } from '@/interface';

interface HotelsResponse {
  count: number;
  results: Hotel[];
}

export interface GetResortsParams {
  city?: string;
  search?: string;
  page?: number;
}
export interface GetBanksParams {
  city?: string;
  search?: string;
  page?: number;
}

export interface GetClinicsParams {
  city?: string;
  search?: string;
  page?: number;
}
export interface GetShopsParams {
  page?: number;
  city?: string;
  search?: string;
}

interface GetHotelsParams {
  page?: number;
  city?: string | null;
  search?: string;
  rating?: number | null;
}

export const API = createApi({
  reducerPath: 'API',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL,
  }),
  endpoints: (builder) => ({


    getCitiesHotel: builder.query<City[], void>({
      query: () => '/services/cities/',
    }),

    getTours: builder.query<ToursResponse, GetToursParams>({
      query: ({ city, search, page = 1 }) => {
        const params = new URLSearchParams();

        params.append("page", page.toString());

        if (city !== undefined && city !== null) {
          params.append("city", city.toString());
        }

        if (search && search.trim() !== "") {
          params.append("search", search.trim());
        }

        return `/services/tours/?${params.toString()}`;
      },
    }),
    getResorts: builder.query<ResortsResponse, GetResortsParams>({
      query: ({ city, search, page = 1 }) => {
        const params = new URLSearchParams();
        params.append('page', page.toString());

        if (city !== undefined && city !== null) {
          params.append('city', city.toString());
        }

        if (search && search.trim() !== '') {
          params.append('search', search.trim());
        }

        return `/services/resorts/?${params.toString()}`;
      },
    }),
    getNewsById: builder.query<NewsItem, number>({
      query: (id) => `media/news/detail/${id}/`,
    }),
    getBanks: builder.query<BanksResponse, GetBanksParams>({
      query: ({ city, search, page = 1 }) => {
        const params = new URLSearchParams();
        params.append('page', page.toString());

        if (city !== undefined && city !== null) {
          params.append('city', city.toString());
        }

        if (search && search.trim() !== '') {
          params.append('search', search.trim());
        }

        return `/services/banks/?${params.toString()}`;
      },
    }),
    getResortDetail: builder.query<ResortDetail, number>({
      query: (id) => `/services/resort/${id}/`,
    }),
    getArticleById: builder.query<ArticleDetail, number>({
      query: (id) => `/media/article/detail/${id}/`,
    }),
    getPlaceById: builder.query<TourById, number | string>({
      query: (id) => `/services/tour/${id}/`,
    }),

    getNews: builder.query<NewsItem[], { search?: string; category?: number }>({
      query: ({ search, category }) => {
        const params = new URLSearchParams();
        if (search) params.append("search", search);
        if (category) params.append("category", String(category));
        return `/media/news/?${params.toString()}`;
      }
    }),
    getNewsCategories: builder.query<NewsCategory[], void>({
      query: () => "media/news/category-list/",
    }),


    getMagazines: builder.query<MagazineMap, void>({
      query: () => "/magazines/",
    }),

    getNewsDetail: builder.query<NewsItem, number>({
      query: (id) => `/media/news/detail/${id}/`,
    }),

    getMagazineById: builder.query<MagazineDetailType, number>({
      query: (id) => `/magazines/magazine/${id}/`,
    }),
    getClinics: builder.query<ClinicsResponse, GetClinicsParams>({
      query: ({ city, search, page = 1 }) => {
        const params = new URLSearchParams();
        params.append('page', page.toString());

        if (city !== undefined && city !== null) {
          params.append('city', city.toString());
        }

        if (search && search.trim() !== '') {
          params.append('search', search.trim());
        }

        return `/services/clinics/?${params.toString()}`;
      },
    }),

    getHotels: builder.query<HotelsResponse, GetHotelsParams>({
      query: ({ page = 1, city, search, rating }) => {
        const params = new URLSearchParams();
        params.append('page', page.toString());
        if (city !== undefined && city !== null) params.append('city', city.toString());
        if (search && search.trim() !== '') params.append('search', search.trim());
        if (rating !== undefined && rating !== null) params.append('rating', rating.toString());
        return `/services/hotels/?${params.toString()}`;
      },
    }),
    getDocumentCategories: builder.query<Category[], void>({
      query: () => '/documents/category-list/',
    }),

    getDocuments: builder.query<DocumentItem[], GetDocumentsParams>({
      query: ({ search, category }) => {
        let url = '/documents/list/?';
        if (search) url += `search=${encodeURIComponent(search)}&`;
        if (category) url += `category=${category}&`;
        return url;
      },
    }),
    getDocumentDetail: builder.query<DocumentDetailType, number>({
      query: (id) => `/documents/detail/${id}/`,
    }),

    getArticles: builder.query<ArticlesResponse, { search?: string; page?: number; page_size?: number }>({
      query: ({ search, page = 1, page_size = 10 }) => {
        const params = new URLSearchParams();
        if (search) params.append("search", search);
        params.append("page", String(page));
        params.append("page_size", String(page_size));
        return `/media/articles/?${params.toString()}`;
      },
    }),

    getHotelsDetail: builder.query<HotelsResponse, { page: number }>({
      query: ({ page }) => `hotels/?page=${page}`,
    }),
    getArticlesDetail: builder.query<ArticlesResponse, number>({
      query: (page = 1) => `hotels/articles/?page=${page}`,
    }),
    getHotelById: builder.query<HotelData, number>({
      query: (id) => `services/hotel/${id}/`,
    }),
    getMarketbyId: builder.query<ShopDetail, number>({
      query: (id) => `services/shop/${id}`
    }),
    getClinicbyId: builder.query<ClinicDetail, number>({
      query: (id) => `services/clinic/${id}`
    }),
    getBankbiId: builder.query<BankDetail, number>({
      query: (id) => `services/bank/${id}`
    }),
    getNearTravels: builder.query({
      query: (hotelId) => `hotels/hotel/near-travels/${hotelId}/`,
    }),
    getHotelsMap: builder.query<MapPoint[], void>({
      query: () => '/services/hotels-map/',
    }),
    getBanksMap: builder.query<MapPoint[], void>({
      query: () => '/services/bank-map/',
    }),

    getClinicsMap: builder.query<MapPoint[], void>({
      query: () => '/services/clinic-map/',
    }),
    getResortsMap: builder.query<MapPoint[], void>({
      query: () => '/services/resort-map/',
    }),
    getShopsMap: builder.query<MapPoint[], void>({
      query: () => '/services/shop-map/',
    }),
    getToursMap: builder.query<MapPoint[], void>({
      query: () => '/services/tour-map/',
    }),

    getShops: builder.query<ShopsResponse, GetShopsParams>({
      query: ({ page = 1, city, search }) => {
        const params = new URLSearchParams();
        params.append("page", page.toString());
        if (city !== undefined && city !== null) params.append("city", city.toString());
        if (search && search.trim() !== "") params.append("search", search.trim());
        return `/services/shops/?${params.toString()}`;
      },
    }),
    getMagazineImages: builder.query<
      MagazineImageResponse,
      { id: string | number; page?: number; page_size?: number }>({
        query: ({ id, page = 1, page_size = 1000 }) => {
          const params = new URLSearchParams();
          params.append("page", String(page));
          params.append("page_size", String(page_size));
          return `/magazines/magazine/image/${id}/?${params.toString()}`;
        },
      }),
  }),
});

export const {
  useGetMagazineImagesQuery,
  useGetNewsByIdQuery,
  useGetArticleByIdQuery,
  useGetNewsCategoriesQuery,
  useGetBankbiIdQuery,
  useGetBanksMapQuery,
  useGetClinicsMapQuery,
  useGetResortsMapQuery,
  useGetShopsMapQuery,
  useGetToursMapQuery,
  useGetClinicbyIdQuery,
  useGetMarketbyIdQuery,
  useGetShopsQuery,
  useGetCitiesHotelQuery,
  useGetToursQuery,
  useGetPlaceByIdQuery,
  useGetNewsQuery,
  useGetMagazinesQuery,
  useGetNewsDetailQuery,
  useGetMagazineByIdQuery,
  useGetHotelsQuery,
  useGetDocumentCategoriesQuery,
  useGetDocumentsQuery,
  useGetDocumentDetailQuery,
  useGetArticlesQuery,
  useGetArticlesDetailQuery,
  useGetHotelsDetailQuery,

  useGetHotelByIdQuery,
  useGetNearTravelsQuery,
  useGetHotelsMapQuery,
  useGetResortsQuery,
  useGetResortDetailQuery,
  useGetBanksQuery,
  useGetClinicsQuery
} = API;
