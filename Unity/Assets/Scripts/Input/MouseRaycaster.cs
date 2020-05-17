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

            Debug.Log(hit.collider.gameObject.name);
            return hit.collider.gameObject;
        }
    }
}
