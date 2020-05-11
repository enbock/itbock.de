<?php
/**
 * Created by PhpStorm.
 * User: User
 * Date: 13.02.2015
 * Time: 22:59
 */

namespace De\Itbock\Weather;

use De\Itbock\Data\Position;

/**
 * Calculate tile urls by position.
 * @package De\Itbock\Weather
 */
class TileGenerator
{
	/**
	 * @var Position
	 */
	protected $position;
	/**
	 * @var string
	 */
	protected $baseUrl;
	/**
	 * @var string
	 */
	protected $suffix;
	/**
	 * @var array
	 */
	protected $prefix;

	/**
	 * @param string   $baseUrl
	 * @param string   $suffix
	 * @param Position $position
	 * @param string[] $randomPrefix
	 */
	public function __construct($baseUrl, $suffix, Position $position, array $randomPrefix)
	{
		$this->position = $position;
		$this->baseUrl = $baseUrl;
		$this->suffix = $suffix;
		$this->prefix = $randomPrefix;
	}

	/**
	 * @param int $tileRadius
	 * @param int $zoom
	 *
	 * @return array
	 */
	public function getTileArray($tileRadius, $zoom = 11)
	{
		$xLowTile = $this->getXTile($zoom) - (int)$tileRadius;
		$xHighTile = $this->getXTile($zoom) + (int)$tileRadius;
		$yLowTile = $this->getYTile($zoom) - (int)$tileRadius;
		$yHighTile = $this->getYTile($zoom) + (int)$tileRadius;

		$result = array();
		$maxTile = pow(2, $zoom);

		$prefixLength = count($this->prefix);

		for($y = $yLowTile; $y <= $yHighTile; $y++)
		{
			for($x = $xLowTile; $x <= $xHighTile; $x++)
			{
				$realX = $x;
				if($realX >= $maxTile)
				{
					$realX -= $maxTile;
				}
				if($realX < 0)
				{
					$realX += $maxTile;
				}
				$realY = $y;
				if($realY >= $maxTile)
				{
					$realY -= $maxTile;
				}
				if($realY < 0)
				{
					$realY += $maxTile;
				}
				$result[] = $this->prefix[rand(0, $prefixLength - 1)] . $this->baseUrl . "$zoom/$realX/$realY" . $this->suffix;
			}
		}

		return $result;
	}

	/**
	 * @param $zoom
	 *
	 * @return int
	 */
	protected function getXTile($zoom)
	{
		return (int)floor((($this->position->getLon() + 180) / 360) * pow(2, $zoom));
	}

	/**
	 * @param $zoom
	 *
	 * @return int
	 */
	protected function getYTile($zoom)
	{
		return (int)floor((1 - log(tan(deg2rad($this->position->getLat())) + 1 / cos(deg2rad($this->position->getLat()))) / pi()) / 2 * pow(2, $zoom));
	}
}