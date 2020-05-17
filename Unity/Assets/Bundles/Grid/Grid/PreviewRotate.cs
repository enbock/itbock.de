using System;
using UnityEngine;

namespace Bundles.Grid.Grid
{
    public class PreviewRotate : MonoBehaviour
    {
        private void Update()
        {
            gameObject.transform.Rotate(Vector3.up, 10f * Time.deltaTime);
        }
    }
}
