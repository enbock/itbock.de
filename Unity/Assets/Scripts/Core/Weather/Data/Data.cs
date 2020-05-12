using UnityEngine;
using UnityEngine.UIElements;

namespace Core.Weather.Data
{
    [System.Serializable]
    public class Data
    {
        public bool IsLoaded = false;
        public Position Position;
        public Sun Sun;
        public Wind Wind;
        public Cloud Cloud;
    }
}