using System;
using UnityEngine;
using UnityEngine.Rendering.Universal;

namespace Loader
{
    public class SharedContent : MonoBehaviour
    {
        public Light GlobalLight;
        public Camera Camera;
        public GameObject PostProcessVolume;
        public ProjectSettings ProjectSettings;
    }
}