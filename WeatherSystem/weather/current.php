<?php
/**
 * Load weather data from open weather map and sent the converted result back.
 */

include("../bootstrap.php");

use De\Itbock\Data\Position;
use De\Itbock\FileSystem\Storage;
use De\Itbock\Network\Curl;
use De\Itbock\Network\Geo\Formatter\PositionXMLToObject;
use De\Itbock\Network\Http;
use De\Itbock\Weather\Formatter\WeatherXMLToObject;
use De\Itbock\Weather\Formatter\WeatherObjectToXML;

$storage = new Storage(BASE_DIR . DIRECTORY_SEPARATOR . 'cache/Curl');

$geoIpNet = new Http\Request\XML(
	new Curl\Cached(
		'https://freegeoip.net/xml/' . $_SERVER['REMOTE_ADDR']
		, $storage
		, 30 * 24 * 60 * 60
	)
);
$geoIpFormatter = new PositionXMLToObject(
	$geoIpNet->loadResource()
);
$position = $geoIpFormatter->format();


/* Debug * /
$position = new Position(60, -161);
//*/

$weatherNet =  new Http\Request\XML(
	new Curl\Cached(
		"http://api.openweathermap.org/data/2.5/weather?lat="
		. $position->getLat() . "&lon=" . $position->getLon()
		. "&mode=xml&lang=de&units=metric&APPID=ba2108508a668211c01cc7df40790aed"
		, $storage, 15 * 60
	)
);
$weatherInput = new WeatherXMLToObject($weatherNet->loadResource());
$data = $weatherInput->format();

//$data->setPosition($position);

$weatherOutput = new WeatherObjectToXML($data);


$response = new Http\Response\XML($weatherOutput->format());
$response->send();
