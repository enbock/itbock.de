<?php
/**
 * Created by PhpStorm.
 * User: User
 * Date: 08.02.2015
 * Time: 17:40
 */

namespace De\Itbock\Weather\Formatter;

use De\Itbock\Data;

class WeatherObjectToXML
{
	/**
	 * @var Data
	 */
	protected $data;

	/**
	 * @param Data $data
	 */
	public function __construct(Data $data)
	{
		$this->data = $data;
	}

	/**
	 * Convert weather data to xml.
	 *
	 * @return \DOMDocument
	 */
	public function format()
	{
		$data = $this->data;
		$document = new \DOMDocument();

		$root = $document->createElement('data');
		$document->appendChild($root);

		$sun = $document->createElement('sun');
		$root->appendChild($sun);

		$rise = $document->createElement('rise');
		$rise->nodeValue = $data->getSun()->getRise();
		$sun->appendChild($rise);

		$set = $document->createElement('set');
		$set->nodeValue = $data->getSun()->getSet();
		$sun->appendChild($set);

		$position = $document->createElement('position');
		$root->appendChild($position);

		$set = $document->createElement('lon');
		$set->nodeValue = $data->getPosition()->getLon();
		$position->appendChild($set);

		$set = $document->createElement('lat');
		$set->nodeValue = $data->getPosition()->getLat();
		$position->appendChild($set);

		$wind = $document->createElement('wind');
		$root->appendChild($wind);

		$set = $document->createElement('speed');
		$set->nodeValue = $data->getWind()->getSpeed();
		$wind->appendChild($set);

		$set = $document->createElement('direction');
		$set->nodeValue = $data->getWind()->getDirection();
		$wind->appendChild($set);

		return $document;
	}
}