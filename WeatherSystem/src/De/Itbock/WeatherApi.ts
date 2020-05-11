import Sun from "./WeatherApi/Sun";
import Wind from "./WeatherApi/Wind";
import Position from "./GeoApi/Position";

export interface WeatherData {
    sun: Sun,
    wind: Wind
}

export interface WeatherApi {
    getCurrentWeather(position: Position): WeatherData
}
