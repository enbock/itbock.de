<?php
/**
 * Created by PhpStorm.
 * User: User
 * Date: 13.02.2015
 * Time: 23:37
 */

namespace De\Itbock\Network;

/**
 * Image from the internet.
 * @package De\Itbock\Network
 */
class Image
{
	/**
	 * @var
	 */
	protected $image;
	/**
	 * @var Curl
	 */
	protected $curl;

	public function __construct(Curl $curl)
	{
		$this->curl = $curl;
	}

	public function loadResource()
	{
		return new \De\Itbock\Graphics\Image($this->curl->loadResource());
	}
}