<?php
/**
 * Created by PhpStorm.
 * User: User
 * Date: 14.02.2015
 * Time: 19:08
 */

namespace De\Itbock\Data;


class Wind
{
	/**
	 * @var float
	 */
	protected $speed;

	/**
	 * @var float
	 */
	protected $direction;

	/**
	 * @param float $speed
	 * @param float $direction
	 */
	public function __construct($speed, $direction)
	{
		$this->speed  = (float) $speed;
		$this->direction = (float) $direction;
	}

	/**
	 * @return float
	 */
	public function getSpeed()
	{
		return $this->speed;
	}

	/**
	 * @param float $speed
	 */
	public function setSpeed($speed)
	{
		$this->speed = $speed;
	}

	/**
	 * @return float
	 */
	public function getDirection()
	{
		return $this->direction;
	}

	/**
	 * @param float $direction
	 */
	public function setDirection($direction)
	{
		$this->direction = $direction;
	}

}