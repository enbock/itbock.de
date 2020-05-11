<?php
/**
 * Created by PhpStorm.
 * User: User
 * Date: 13.02.2015
 * Time: 23:40
 */

namespace De\Itbock\Graphics;

/**
 * A image.
 * @package De\Itbock\Graphics
 */
/**
 * Class Image
 * @package De\Itbock\Graphics
 */
class Image
{
	/**
	 * @var resource
	 */
	protected $image;
	/**
	 * @var int
	 */
	protected $width;
	/**
	 * @var int
	 */
	protected $height;

	/**
	 * @param      $imageDataOrWidth
	 * @param null $height
	 */
	public function __construct($imageDataOrWidth, $height = null)
	{
		if(is_string($imageDataOrWidth) && $height === null)
		{
			$this->image = \imagecreatefromstring((string)$imageDataOrWidth);
			$this->width = \imagesx($this->image);
			$this->height = \imagesy($this->image);
		}
		else
		{
			$this->image = \imagecreatetruecolor((int)$imageDataOrWidth, (int)$height);
			$this->width = (int)$imageDataOrWidth;
			$this->height = (int)$height;
			\imagecolorallocatealpha($this->image, 255, 255, 255, 127);
			\imagealphablending($this->image, false);
		}
	}

	/**
	 *
	 */
	public function __destruct()
	{
		\imagedestroy($this->image);
	}

	/**
	 * @return int
	 */
	public function getWidth()
	{
		return $this->width;
	}

	/**
	 * @return int
	 */
	public function getHeight()
	{
		return $this->height;
	}

	/**
	 * @return bool
	 */
	public function getPng()
	{
		\imagesavealpha($this->image, true);
		return imagepng($this->image);
	}

	/**
	 * @param Image $image
	 * @param int   $toX
	 * @param int   $toY
	 * @param int   $fromX
	 * @param int   $fromY
	 */
	public function copyFromInto(Image $image, $toX, $toY, $fromX = 0, $fromY = 0)
	{
		\imagecopy(
			$this->image
			, $image->image
			, $toX, $toY
			, $fromX, $fromY
			, $image->getWidth(), $image->getHeight()
		);
	}

	/**
	 * @param $width
	 * @param $height
	 *
	 * @return Image
	 */
	public function cropCenter($width, $height)
	{
		$result = new Image($width, $height);
		$xOffset = floor(($this->width - $width) / 2);
		$yOffset = floor(($this->width - $width) / 2);
		$result->copyFromInto($this, 0, 0, $xOffset, $yOffset);
		return $result;
	}
}