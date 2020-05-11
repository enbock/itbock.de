<?php
/**
 * Created by PhpStorm.
 * User: User
 * Date: 08.02.2015
 * Time: 17:30
 */

namespace De\Itbock\Weather\Formatter;


use De\Itbock\Data;
use De\Itbock\Data\Sun;

class WeatherXMLToObject
{
	/**
	 * @var \DOMDocument
	 */
	protected $data;

	/**
	 * @param \DOMDocument $data
	 */
	public function __construct(\DOMDocument $data)
	{
		$this->data = $data;
	}

	/**
	 * Convert OpenWeather data to weather object.
	 *
	 * @return Data
	 */
	public function format()
	{
		$xpath = new \DOMXPath($this->data);

		$sunNode = $xpath->query('/current/city/sun')->item(0);
		$sun = new Sun(
			$sunNode->attributes->getNamedItem('rise')->nodeValue
			, $sunNode->attributes->getNamedItem('set')->nodeValue
		);

		$positionNode = $xpath->query('/current/city/coord')->item(0);
		$position = new Data\Position(
			$positionNode->attributes->getNamedItem('lat')->nodeValue
			, $positionNode->attributes->getNamedItem('lon')->nodeValue
		);

		$windSpeedNode = $xpath->query('/current/wind/speed')->item(0);
		$windDirNode = $xpath->query('/current/wind/direction')->item(0);
		$wind = new Data\Wind(
			$windSpeedNode->attributes->getNamedItem('value')->nodeValue
			, $windDirNode->attributes->getNamedItem('value')->nodeValue
		);

		return new Data($sun, $position, $wind);
	}
}