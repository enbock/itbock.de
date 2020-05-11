<?php
/**
 * Created by PhpStorm.
 * User: User
 * Date: 14.02.2015
 * Time: 17:33
 */

namespace De\Itbock\Network\Geo\Formatter;

use De\Itbock\Data\Position;

class PositionXMLToObject
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
	 * @return Position
	 */
	public function format()
	{
		$xpath = new \DOMXPath($this->data);
		$lon = $xpath->query('/Response/Longitude')->item(0);
		$lat = $xpath->query('/Response/Latitude')->item(0);

		return new Position($lat->nodeValue, $lon->nodeValue);
	}
}