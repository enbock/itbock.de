<?php
/**
 * Created by PhpStorm.
 * User: User
 * Date: 08.02.2015
 * Time: 17:50
 */

namespace De\Itbock\Network\Http\Response;


/**
 * Create XML response.
 *
 * @package De\Itbock\Network\Http\Response
 */
class XML
{
	/**
	 * @var \DOMDocument
	 */
	protected $document;

	/**
	 * @param \DOMDocument $document
	 */
	public function __construct(\DOMDocument $document)
	{
		$this->document = $document;
	}

	/**
	 * Send the response text.
	 */
	public function send()
	{

		header("Content-Type: text/xml");
		print $this->document->saveXML();
	}
}