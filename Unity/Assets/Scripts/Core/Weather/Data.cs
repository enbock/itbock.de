using UnityEngine;
using UnityEngine.UIElements;

namespace Core.Weather
{
    [System.Serializable]
    public class Data
    {
        public Position Position;
        public Sun Sun;
        public Wind Wind;
        public Cloud Cloud;
    }
}