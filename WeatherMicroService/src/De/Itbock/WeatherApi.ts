import Sun from './WeatherApi/Sun';
import Wind from './WeatherApi/Wind';
import Position from './GeoApi/Position';
import Cloud from './WeatherApi/Cloud';

export interface WeatherData {
    sun: Sun,
    wind: Wind
    cloud: Cloud
}

export interface WeatherApi {
    getCurrentWeather(position: Position): Promise<WeatherData>
}
