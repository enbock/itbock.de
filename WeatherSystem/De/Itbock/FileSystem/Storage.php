<?php
/**
 * Created by PhpStorm.
 * User: User
 * Date: 13.02.2015
 * Time: 22:19
 */

namespace De\Itbock\FileSystem;

/**
 * Simple file system storage.
 *
 * @package De\Itbock\FileSystem
 */
class Storage
{
	/**
	 * Base directory.
	 *
	 * @var string
	 */
	protected $baseDir;

	/**
	 * Store injections.
	 *
	 * @param string $baseDir Base directory.
	 */
	public function __construct($baseDir)
	{
		$this->baseDir = $baseDir;
	}

	/**
	 * Generate filename.
	 * Use md5 to create the file name from key. So any key string is possible.
	 *
	 * @param string $key Data identifier.
	 *
	 * @return string
	 */
	protected function getFileName($key)
	{
		$fileName = md5($key);
		return $this->baseDir . DIRECTORY_SEPARATOR . $fileName;
	}

	/**
	 * Write data.
	 *
	 * @param string $key  Data identifier.
	 * @param string $data The data to write.
	 */
	public function write($key, $data)
	{
		file_put_contents($this->getFileName($key), $data);
	}

	/**
	 * Read data.
	 *
	 * @param string $key Data identifier.
	 *
	 * @return string
	 */
	public function read($key)
	{
		if (!file_exists($this->getFileName($key))) {
			return '';
		}
		return file_get_contents($this->getFileName($key));
	}

	/**
	 * Timestamp of last modification.
	 *
	 * @param string $key Data identifier
	 *
	 * @return int
	 */
	public function lastModified($key)
	{
		if (!file_exists($this->getFileName($key))) {
			return 0;
		}
		return filemtime($this->getFileName($key));
	}
}