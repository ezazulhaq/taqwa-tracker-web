export interface OpenStreetMapResponse {
    place_id: number;
    licence: string;
    osm_type: string;
    osm_id: number;
    lat: string;
    lon: string;
    class: string;
    type: string;
    place_rank: number;
    importance: number;
    addresstype: string;
    name: string;
    display_name: string;
    address: Address;
    boundingbox: string[];
}

interface Address {
    neighbourhood?: string;
    suburb?: string;
    city?: string;
    state_district?: string;
    state: string;
    'ISO3166-2-lvl4': string;
    postcode: string;
    country: string;
    country_code: string;
}

export interface OpenStreetMapErrorResponse {
    error: {
        code: number;
        message: string;
    };
}

