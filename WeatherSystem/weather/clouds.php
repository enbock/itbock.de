<?php
/**
 * Create cloud map of city.
 * User: User
 * Date: 13.02.2015
 * Time: 22:58
 */

include("../bootstrap.php");

use De\Itbock\Data\Position;
use De\Itbock\FileSystem\Storage;
use De\Itbock\Graphics\Image\Field;
use De\Itbock\Network\Curl;
use De\Itbock\Network\Http\Response\Image\Png;
use De\Itbock\Network\Image;
use De\Itbock\Weather\TileGenerator;

$position = new Position($_GET['lat'], $_GET['lon']);

$baseUrl = 'tile.openweathermap.org/map/clouds/';
//$baseUrl = 'tile.openweathermap.org/map/temp/';
//$baseUrl = 'tile.openstreetmap.org/';

$generator = new TileGenerator(
	$baseUrl
	, '.png'
	, $position
	, array('http://a.', 'http://b.', 'http://c.')
);

$urls = $generator->getTileArray(2, 9);

$images  = array();
$storage = new Storage(BASE_DIR . DIRECTORY_SEPARATOR . 'cache/Curl');

foreach($urls as $url)
{
	$image = new Image(
		new Curl\Cached(
			$url, $storage, 15*60
		)
	);
	$images[] = $image->loadResource();
}

$map = new Field($images, 5, 5);

$response = new Png($map->getImage()->cropCenter(1024, 1024));
$response->send();
