<?php
/**
 * Created by PhpStorm.
 * User: User
 * Date: 14.02.2015
 * Time: 17:00
 */

namespace De\Itbock\Network\Http\Request;

use De\Itbock\Network\Curl;

class XML
{
	/**
	 * @var Curl
	 */
	protected $source;

	/**
	 * @param Curl $source
	 */
	public function __construct(Curl $source)
	{
		$this->source = $source;
	}

	/**
	 * @return \DOMDocument
	 */
	public function loadResource()
	{
		$response = $this->source->loadResource();
		$xml = new \DOMDocument();
		$xml->loadXML($response);
		return $xml;
	}
}