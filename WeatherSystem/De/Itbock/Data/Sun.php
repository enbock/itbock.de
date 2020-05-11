<?php
/**
 * Created by PhpStorm.
 * User: User
 * Date: 14.02.2015
 * Time: 17:25
 */

namespace De\Itbock\Data;


class Sun
{
	/**
	 * @var string
	 */
	protected $rise;
	/**
	 * @var string
	 */
	protected $set;

	/**
	 * @param string $rise
	 * @param string $set
	 */
	public function __construct($rise, $set)
	{
		$this->rise = (string) $rise;
		$this->set = (string) $set;
	}

	/**
	 * @return string
	 */
	public function getRise()
	{
		return $this->rise;
	}

	/**
	 * @param string $rise
	 */
	public function setRise($rise)
	{
		$this->rise = $rise;
	}

	/**
	 * @return string
	 */
	public function getSet()
	{
		return $this->set;
	}

	/**
	 * @param string $set
	 */
	public function setSet($set)
	{
		$this->set = $set;
	}
}