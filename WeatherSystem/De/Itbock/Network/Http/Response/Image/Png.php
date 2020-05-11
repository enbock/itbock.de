<?php
/**
 * Created by PhpStorm.
 * User: User
 * Date: 14.02.2015
 * Time: 00:17
 */

namespace De\Itbock\Network\Http\Response\Image;


use De\Itbock\Graphics\Image;

class Png {

	/**
	 * @var Image
	 */
	protected $image;

	/**
	 * @param Image $image
	 */
	public function __construct(Image $image)
	{
		$this->image = $image;
	}

	/**
	 * Send the response image.
	 */
	public function send()
	{
		header("Content-Type: image/png");
		print $this->image->getPng();
	}
}