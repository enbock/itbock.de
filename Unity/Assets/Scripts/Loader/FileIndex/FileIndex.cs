using UnityEngine;

namespace Loader.FileIndex
{
    [System.Serializable]
    public struct ContentData
    {
        public string Name;
        public uint Crc;
    }
    
    public class FileIndex : MonoBehaviour
    {
        public string StartContent;
        public ContentData[] ContentData;
    }
}