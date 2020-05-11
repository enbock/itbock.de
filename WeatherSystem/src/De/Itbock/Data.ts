import Position from "./GeoApi/Position";
import Sun from "./WeatherApi/Sun";
import Wind from "./WeatherApi/Wind";

export default class Data
{
	public position: Position;
	public sun: Sun;
	public wind: Wind;

	constructor()
	{
		this.position = new Position();
		this.sun = new Sun();
		this.wind = new Wind()
	}
}
