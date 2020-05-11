import {GeoApi} from "./De/Itbock/GeoApi";
import {WeatherApi, WeatherData} from "./De/Itbock/WeatherApi";
import Data from "./De/Itbock/Data";
import Position from "./De/Itbock/GeoApi/Position";

const geoApi:GeoApi;
const weatherApi:WeatherApi;

const position:Position = geoApi.getGeoData(ClientAddress);
const weather:WeatherData = weatherApi.getCurrentWeather(position);

const data:Data = new Data();
data.position = position;
data.sun = weather.sun;
data.wind = weather.wind;

const result:string = JSON.stringify(data);
