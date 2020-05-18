using UnityEngine;

namespace Scripts.Input
{
    public class MouseRaycaster
    {
        public static GameObject GetPointetObject(Camera camera)
        {
            Ray ray = camera.ScreenPointToRay(UnityEngine.Input.mousePosition);

            RaycastHit hit;
            Physics.Raycast(ray, out hit);
            if (hit.collider == null) return null;

            return hit.collider.gameObject;
        }
    }
}
