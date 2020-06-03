using System.Collections.Generic;
using System.Linq;
using Admin;
using Grid.Asset;
using Scripts.Input;
using UnityEngine;
using UnityEngine.EventSystems;
using UnityTemplateProjects;
using Manager = Grid.Manager;

namespace Bundles.Grid.Grid
{
    public class GridEditController : MonoBehaviour
    {
        public Manager GridManger;
        public Material SelectMaterial;
        [ReadOnly] public Camera PlayerCamera;
        [ReadOnly] public Entity SelectedEntity;
        Dictionary<MeshRenderer, Material[]> OriginalMaterials = new Dictionary<MeshRenderer, Material[]>();
        private float NextKeyRepeatTime = 0f;

        private void OnEnable()
        {
            PlayerCamera = GridManger.SharedContent.Camera;
            GridManger.OnAddToGrid += SelectEntity;
            AdminAuthorization.OnLoginChange += (
                (bool loggedIn) =>
                {
                    if (loggedIn == false) UnselectEntity();
                }
            );
        }

        private void Update()
        {
            if (
                PlayerCamera.gameObject.GetComponent<SimpleCameraController>().enabled == false ||
                GridManger.IsActive == false
            ) return;

            if (Input.GetMouseButtonDown(0))
            {
                if (EventSystem.current.IsPointerOverGameObject() == false)
                {
                    RaycastHit hit = MouseRaycaster.GetPointetObject(PlayerCamera);
                    if (hit.transform != null && hit.transform.gameObject != null)
                    {
                        GameObject hittedGameObject = hit.transform.gameObject;
                        Entity entity = FindEntity(hittedGameObject);
                        if (entity && GridManger.IsEntityInGrid(entity) && entity != SelectedEntity)
                        {
                            SelectEntity(entity);
                        }
                        else
                        {
                            UnselectEntity();
                        }
                    }
                    else
                    {
                        UnselectEntity();
                    }
                }
            }

            if (
                SelectedEntity &&
                (Time.realtimeSinceStartup >= NextKeyRepeatTime || Input.anyKeyDown || Input.GetKey(KeyCode.LeftShift))
            )
            {
                Vector3 move = Vector3.zero;
                if (Input.GetKey(KeyCode.RightArrow))
                {
                    move = Vector3.right;
                }

                if (Input.GetKey(KeyCode.LeftArrow))
                {
                    move = Vector3.left;
                }

                if (Input.GetKey(KeyCode.UpArrow))
                {
                    move = Vector3.forward;
                }

                if (Input.GetKey(KeyCode.DownArrow))
                {
                    move = Vector3.back;
                }

                if (move != Vector3.zero)
                {
                    Vector3 gridDirection = gameObject.transform.forward;
                    Vector3 playerDirection = PlayerCamera.transform.forward;

                    // Round to full direction and clamp to y axis
                    gridDirection.x = Mathf.Round(gridDirection.x);
                    gridDirection.y = 0f; // Remove Look up/down
                    gridDirection.z = Mathf.Round(gridDirection.z);
                    playerDirection.x = Mathf.Round(playerDirection.x);
                    playerDirection.y = 0f; // Remove Look up/down
                    playerDirection.z = Mathf.Round(playerDirection.z);

                    float signedAngle = Vector3.SignedAngle(gridDirection, playerDirection, Vector3.up);
                    signedAngle += signedAngle % 90f; // clamp to 4 directions
                    GridManger.Move(SelectedEntity, Quaternion.Euler(0f, signedAngle, 0f) * move);
                }

                if (Input.GetKey(KeyCode.PageUp))
                {
                    if (Input.GetKey(KeyCode.LeftControl))
                    {
                        GridManger.RotateVertical(SelectedEntity, 1f);
                    }
                    else
                    {
                        Vector3 gridDirection = gameObject.transform.forward;
                        Vector3 playerDirection = PlayerCamera.transform.forward;

                        gridDirection.x = Mathf.Round(gridDirection.x);
                        gridDirection.y = 0f; // Remove Look up/down
                        gridDirection.z = Mathf.Round(gridDirection.z);
                        playerDirection.x = Mathf.Round(playerDirection.x);
                        playerDirection.y = 0f; // Remove Look up/down
                        playerDirection.z = Mathf.Round(playerDirection.z);

                        float signedAngle = Vector3.SignedAngle(gridDirection, playerDirection, Vector3.up);
                        signedAngle += signedAngle % 90;
                        GridManger.Move(SelectedEntity, new Vector3(0f, 1f, 0f));
                    }
                }

                if (Input.GetKey(KeyCode.PageDown))
                {
                    if (Input.GetKey(KeyCode.LeftControl))
                    {
                        GridManger.RotateVertical(SelectedEntity, -1f);
                    }
                    else
                    {
                        GridManger.Move(SelectedEntity, new Vector3(0f, -1f, 0f));
                    }
                }

                if (Input.GetKey(KeyCode.Home))
                {
                    GridManger.RotateHorizontal(SelectedEntity, -1f);
                }

                if (Input.GetKey(KeyCode.End))
                {
                    GridManger.RotateHorizontal(SelectedEntity, 1f);
                }

                if (Input.GetKeyDown(KeyCode.Delete))
                {
                    GridManger.Remove(SelectedEntity);
                    UnselectEntity();
                }

                if (Input.GetKeyDown(KeyCode.Insert))
                {
                    GridManger.Duplicate(SelectedEntity);
                }

                NextKeyRepeatTime = Time.realtimeSinceStartup + 1f / 10f;
            }
        }

        private void SelectEntity(Entity entity)
        {
            if (SelectedEntity != null && entity != SelectedEntity) UnselectEntity();
            if (SelectedEntity == entity) return;
            SelectedEntity = entity;
            ReplaceMertials(entity);
        }

        private void ReplaceMertials(Entity entity)
        {
            foreach (MeshRenderer renderer in entity.gameObject.GetComponentsInChildren<MeshRenderer>())
            {
                Material[] originalMaterials = renderer.materials;
                OriginalMaterials.Add(renderer, originalMaterials);

                Material[] materials = new Material[originalMaterials.Length];
                for (int index = 0; index < materials.Length; index++)
                {
                    materials[index] = SelectMaterial;
                }

                renderer.materials = materials.ToArray();
            }
        }

        private void UnselectEntity()
        {
            if (SelectedEntity == null) return;
            foreach (KeyValuePair<MeshRenderer, Material[]> pair in OriginalMaterials)
            {
                if (pair.Key == null) continue;
                pair.Key.materials = pair.Value;
            }

            SelectedEntity = null;
            OriginalMaterials.Clear();
        }

        private Entity FindEntity(GameObject gameObject)
        {
            GameObject pointer = gameObject;
            while (pointer.transform.parent != null && pointer != transform.parent.gameObject)
            {
                Entity entity = pointer.GetComponent<Entity>();
                if (entity == null)
                {
                    pointer = pointer.transform.parent.gameObject;
                    continue;
                }

                return entity;
            }

            return null;
        }
    }
}
