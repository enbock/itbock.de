<?php
/**
 * Created by PhpStorm.
 * User: User
 * Date: 14.02.2015
 * Time: 17:11
 */

namespace De\Itbock\Data;


class Position
{
	/**
	 * @var float
	 */
	protected $lat;
	/**
	 * @var float
	 */
	protected $lon;

	/**
	 * @param float $lat
	 * @param float $lon
	 */
	public function __construct($lat = 0, $lon = 0)
	{
		$this->lat = (float)$lat;
		$this->lon = (float)$lon;
	}

	/**
	 * @return float
	 */
	public function getLat()
	{
		return $this->lat;
	}

	/**
	 * @param float $lat
	 */
	public function setLat($lat)
	{
		$this->lat = (float)$lat;
	}

	/**
	 * @return float
	 */
	public function getLon()
	{
		return $this->lon;
	}

	/**
	 * @param float $lon
	 */
	public function setLon($lon)
	{
		$this->lon = $lon;
	}

}