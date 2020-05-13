import Position from './GeoApi/Position';

export interface GeoApi {
    getGeoData(lookupAddress): Promise<Position>
}
