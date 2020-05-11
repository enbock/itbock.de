<?php
/**
 * Created by PhpStorm.
 * User: User
 * Date: 13.02.2015
 * Time: 23:55
 */

namespace De\Itbock\Graphics\Image;


use De\Itbock\Graphics\Image;

class Field
{
	protected $images;
	protected $width;
	protected $height;
	protected $image;

	/**
	 * @param Image[] $images
	 * @param int     $width
	 * @param int     $height
	 */
	public function __construct(array $images, $width, $height)
	{
		$this->images = $images;
		$this->width  = $width;
		$this->height = $height;
	}

	/**
	 * @return Image
	 */
	public function getImage()
	{
		if ($this->image) {
			return $this->image;
		}

		$width  = $this->images[0]->getWidth();
		$height = $this->images[0]->getHeight();
		$this->image = new Image($width * $this->width, $height * $this->height);

		for($y = 0; $y < $this->height; $y++) {
			for($x = 0; $x < $this->width; $x++) {
				$this->image->copyFromInto(
					$this->images[$y * $this->width + $x], $x * $width, $y * $height
				);
			}
		}

		return $this->image;
	}
}