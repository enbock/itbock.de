using UnityEngine;

namespace Scripts.Input
{
    public class MouseRaycaster
    {
        public static RaycastHit GetPointetObject(Camera camera)
        {
            RaycastHit hit;
            Ray ray = camera.ScreenPointToRay(UnityEngine.Input.mousePosition);

            Physics.Raycast(ray, out hit);

            return hit;
        }
    }
}
