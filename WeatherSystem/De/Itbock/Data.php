<?php
/**
 * Created by PhpStorm.
 * User: User
 * Date: 14.02.2015
 * Time: 17:23
 */

namespace De\Itbock;

use De\Itbock\Data\Position;
use De\Itbock\Data\Sun;
use De\Itbock\Data\Wind;

/**
 * Class Data
 * @package De\Itbock
 */
class Data
{
	/**
	 * @var Position
	 */
	protected $position;
	/**
	 * @var Sun
	 */
	protected $sun;

	/**
	 * @var Wind
	 */
	protected $wind;

	/**
	 * @param Sun      $sun
	 * @param Position $position
	 * @param Wind     $wind
	 */
	public function __construct(Sun $sun = null, Position $position = null,
		Wind $wind = null)
	{
		$this->position = $position;
		$this->sun = $sun;
		$this->wind = $wind;
	}

	/**
	 * @return Position
	 */
	public function getPosition()
	{
		return $this->position;
	}

	/**
	 * @param Position $position
	 */
	public function setPosition(Position $position)
	{
		$this->position = $position;
	}

	/**
	 * @return Sun
	 */
	public function getSun()
	{
		return $this->sun;
	}

	/**
	 * @param Sun $sun
	 */
	public function setSun(Sun $sun)
	{
		$this->sun = $sun;
	}

	/**
	 * @return Wind
	 */
	public function getWind()
	{
		return $this->wind;
	}

	/**
	 * @param Wind $wind
	 */
	public function setWind(Wind $wind)
	{
		$this->wind = $wind;
	}
}