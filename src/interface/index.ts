// NAv Links
export interface NavLinkProps {
    href: string
    children: React.ReactNode
    active?: boolean
}
interface MultilingualText {
    uz: string;
    en: string;
    ru: string;
}

//Magazine props

export interface MagazineProps {
    title: string
    coverImage: string
    dateRange: string
    year: string
}
export interface MagazineItem {
    id: number;
    title: MultilingualText;
    description: MultilingualText;
    file: string;
    year: number;
    month: string;
    card: string;
}
export interface MagazineMap {
    [year: string]: MagazineItem[];
}


export interface MagazineDetailType {
    id: number;
    title: MultilingualText;
    description: MultilingualText;
    file: string;
    year: number;
    month: string;
    card: string;
}
export interface MagazineImage {
    id: number;
    image: string;

}
export interface MagazineImageResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: MagazineImage[];
}


// export interface Hotel {
//     id: string
//     name: string
//     type: string
//     location: string
//     description: string
//     imageUrl: string
//     features: string[]
// }






// --------------------------------------------------------------------








export interface HotelsProps {
    id: number;
    name: string;
    description: {
        uz: string;
        en: string;
        ru: string;
    };
    rating?: number;
    images: {
        id: number;
        image: [];
    }[];
}

export interface ArticleProps {
    id: number;
    title: {
        uz: string;
        en: string;
        ru: string;
    };
    description: {
        uz: string;
        en: string;
        ru: string;
    };
    body?: {
        uz: string;
        en: string;
        ru: string;
    };
    article_image: string;
    author?: string;
    author_photo?: string;
}

export interface TravelProps {
    id: number;
    title: {
        uz?: string;
        ru?: string;
        en?: string;
    };
    description: {
        uz?: string;
        ru?: string;
        en?: string;
    };
    image: string;
    city?: string;
}

export interface GetToursParams {
    city?: number | null;
    search?: string;
    page?: number;
}




// Tour
export interface CityName {
    name_uz: string;
    name_ru: string;
    name_en: string;
}

export interface TourById {
    id: number;
    name: string;
    city: CityName;
    latitude: number;
    longitude: number;
    body:MultilangText;
    address:MultilangText;
    images: {
        id: number;
        photo: string;
    }[];
}

export interface Tour {
    id: number;
    name: string;
    city: CityName;
    latitude: number;
    longitude: number;
    body:MultilangText;
    address:MultilangText;
    image: {
        id: number;
        photo: string;
    }[];
}


export interface ToursResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: Tour[];
}

//tourdetail
export interface MultilangText {
    uz?: string;
    ru?: string;
    en?: string;
}





// City
export interface City {
    id: number;
    name: string
}

export interface Hotel {
    id: number;
    name: string;
    description: {
        uz: string;
        en: string;
        ru: string;
    };
    images: {
        id: number;
        image: string
    };
    rating: string;
}

export interface HotelsResponse {
    count: number;
    results: Hotel[];
}

//Map

export interface MapPoint {
    id: number;
    name: string;
    position: [number, number]; // [latitude, longitude]
    description: {
        uz: string;
        en: string;
        ru: string;
    };
    city: {
        uz: string;
        en: string;
        ru: string;
    };
}



export type Category = {
    id: number;
    name: { uz: string; ru: string; en: string };
};

export type DocumentItem = {
    id: number;
    title: { uz: string; ru: string; en: string };
    file: string | null;
    url: string | null;
    date: string;
    number: string;
};


export interface GetDocumentsParams {
    search?: string;
    category?: number | null;
}

export interface DocumentDetailType {
    id: number;
    title: { uz: string; ru: string; en: string };
    file: string | null;
    url: string | null;
    date: string;
    number: string;
}



export type HotelData = {
    id: number;
    name: string;
    address: Record<string, string>;
    phone: string;
    description: Record<string, string>;
    body: Record<string, string>;
    latitude: number;
    longitude: number;
    city: number;
    rating: number;
    images: {
        id:number;
        image:string;
    }[];
    amenities: { id: number; name: Record<string, string> }[];
};

//Resorts
export interface ResortCity {
    uz: string
    ru: string
    en: string
}
export interface Resort {
    id: number;
    name: string;
    description: MultilangText;
    type: string;
    city: ResortCity;
    images: {
        id: number;
        photo: string;
    }[];
}

export interface ResortsResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: Resort[];
}

export interface ResortDetail {
    id: number;
    name: string;
    address: MultilangText;
    description: MultilangText;
    body: MultilangText;
    latitude: number;
    longitude: number;
    type: MultilangText;
    city: MultilangText;
    images: {
        id: number;
        photo: string;
    }[];
}

//Banks
export interface BankDetailBody {
    en: string,
    ru: string,
    uz: string
}
export interface BankDetailDescription {
    en: string,
    ru: string,
    uz: string,
}
export interface BankDetail {
    id: number;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    body: BankDetailBody;
    description: BankDetailDescription;
    images: {
        id: number;
        photo: string;
    }[];
}
export interface BankCity {
    name_uz: string;
    name_ru: string;
    name_en: string;
}
export interface Bank {
    id: number;
    name: string;
    city: BankCity;
    latitude: number;
    longitude: number;
    images: {
        id: number;
        photo: string;
    }[]
}


export interface BanksResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: Bank[];
}

//clinics

export interface ClinicCity {
    name_uz: string;
    name_ru: string;
    name_en: string;
}

export interface Clinic {
    id: number;
    name: string;
    city: ClinicCity;
    latitude: number;
    longitude: number;
    images:   {
        id: number;
        photo: string;
    }[];
}
export interface ClinicDetailAddress {
    address_en: string,
    address_uz: string,
    address_ru: string
}
export interface ClinicDetailBody {
    body_en: string,
    body_ru: string,
    body_uz: string
}
export interface ClinicDetailDescription {
    description_en: string,
    description_ru: string,
    description_uz: string,
}
export interface ClinicDetail {
    id: number;
    name: string;
    address: ClinicDetailAddress;
    latitude: number;
    longitude: number;
    body: ShopDetailBody;
    description: ShopDetailDescription;
    images: {
        id: number;
        photo: string;
    }[];
}

export interface ClinicsResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: Clinic[];
}

//shops

export interface ShopCity {
    name_uz: string;
    name_ru: string;
    name_en: string;
}
export interface Shop {
    id: number;
    name: string;
    city: ShopCity;
    latitude: number;
    longitude: number;
    images: {
        id: number;
        photo: string;
    }[];
}
export interface ShopDetailBody {
    body_en: string,
    body_ru: string,
    body_uz: string
}
export interface ShopDetailDescription {
    description_en: string,
    description_ru: string,
    description_uz: string,
}
export interface ShopDetailAddress {
    address_en: string,
    address_uz: string,
    address_ru: string
}
export interface ShopDetail {
    id: number;
    name: string;
    address: ShopDetailAddress;
    latitude: number;
    longitude: number;
    body: ShopDetailBody;
    description: ShopDetailDescription;
    images: {
        id: number;
        photo: string
    }[];
}
export interface ShopsResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: Shop[];
}

//media-c
export interface NewsCategory {
    id: number;
    name: MultilangText;
}
export interface NewsItem {
    id: number;
    title: MultilingualText;
    image: string | null;
    description: MultilingualText;
    category: NewsCategory;
    body: MultilingualText
}

export interface newsDetail {
      id: number;
  title: {
    uz: string;
    en: string;
    ru: string;
  };
  image: string | null;
  description: {
    uz: string;
    en: string;
    ru: string;
  };
  body: {
    uz: string;
    en: string;
    ru: string;
  };

}
//article


export interface ArticleItem {
    id: number;
    title: MultilangText;
    article_image: string | null;
    author: string;
    author_photo: string | null;
    created_at: string;
}

export interface ArticlesResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: ArticleItem[];
}
export type Lang = "uz" | "ru" | "en";

export interface ArticleDetail {
    id: number;
    title: Record<Lang, string>;
    description: Record<Lang, string>;
    body: Record<Lang, string>;
    article_image: string | null;
    author: string;
    author_photo: string | null;
    created_at: string;
}

//magazine images
export interface MagazineImage {
  id: number;
  image: string;
}

export interface MagazineImageResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: MagazineImage[];
}

//home-list
export interface HomeList{
    id: number;
    title: MultilangText;
    home_file: string;
    
}
//services-list
export interface DashboardList{
    id: number;
    title: MultilangText;
    file: string
}