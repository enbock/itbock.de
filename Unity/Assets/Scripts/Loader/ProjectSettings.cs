using UnityEngine;
using UnityEngine.Serialization;

namespace Loader
{
    public class ProjectSettings : MonoBehaviour
    {
        public string HostUri;
        public bool development = true;
    }
}