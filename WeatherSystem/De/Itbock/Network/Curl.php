<?php
/**
 * Created by PhpStorm.
 * User: User
 * Date: 08.02.2015
 * Time: 17:04
 */

namespace De\Itbock\Network;


/**
 * Simple curl implementation.
 * @package De\Itbock\Network
 */
class Curl
{
	/**
	 * @var string
	 */
	protected $url;

	/**
	 * @param string $url Url of resource to load.
	 */
	public function __construct($url)
	{
		$this->url = $url;
	}

	/**
	 * Getting content of url.
	 *
	 * @return string
	 */
	public function loadResource()
	{
		$curl = curl_init($this->url);
		curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
		$result = curl_exec($curl);
		curl_close($curl);

		return (string) $result;
	}

	/**
	 * Change url.
	 * @param string $url
	 */
	public function setUrl($url)
	{
		$this->url = $url;
	}
}