using UnityEngine;
using UnityEngine.Serialization;

namespace Loader
{
    public class ProjectSettings : MonoBehaviour
    {
        public string HostUri;
        public string ApiUri;
        public bool development = true;
    }
}