import Position from './GeoApi/Position';
import Sun from './WeatherApi/Sun';
import Wind from './WeatherApi/Wind';
import Cloud from './WeatherApi/Cloud';

export default class Data {
    public position: Position;
    public sun: Sun;
    public wind: Wind;
    public cloud: Cloud;

    constructor() {
        this.position = new Position();
        this.sun = new Sun();
        this.wind = new Wind();
        this.cloud = new Cloud();
    }
}
