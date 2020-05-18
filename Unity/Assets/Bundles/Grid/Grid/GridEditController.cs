using System.Collections.Generic;
using Admin;
using Grid.Asset;
using Scripts.Input;
using UnityEngine;
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
        [ReadOnly] public Material[] OriginalMaterials = null;
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
                AdminAuthorization.LoggedIn == false
            ) return;

            if (Input.GetMouseButtonDown(0))
            {
                GameObject hit = MouseRaycaster.GetPointetObject(PlayerCamera);
                if (hit != null)
                {
                    Entity entity = FindEntity(hit);
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

            Vector3 relativeDirection = PlayerCamera.transform.forward - (gameObject.transform.forward * -2f);

            Vector3 lockAt = Vector3.forward;
            if (
                relativeDirection.x >= 0.5 &&
                relativeDirection.x <= 1.5 &&
                relativeDirection.z >= 1.5 &&
                relativeDirection.z <= 2.5
            )
            {
                lockAt = Vector3.left;
            }
            else if (
                relativeDirection.x >= -1.5 &&
                relativeDirection.x <= -0.5 &&
                relativeDirection.z >= 1.5 &&
                relativeDirection.z <= 2.5
            )
            {
                lockAt = Vector3.right;
            }
            else if (relativeDirection.z >= 2.5)
            {
                lockAt = Vector3.back;
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
                    if (lockAt == Vector3.right) move = Vector3.back;
                    if (lockAt == Vector3.back) move = Vector3.left;
                    if (lockAt == Vector3.left) move = Vector3.forward;
                    move *= -1;
                }

                if (Input.GetKey(KeyCode.LeftArrow))
                {
                    move = Vector3.left;
                    if (lockAt == Vector3.right) move = Vector3.forward;
                    if (lockAt == Vector3.back) move = Vector3.right;
                    if (lockAt == Vector3.left) move = Vector3.back;
                    move *= -1;
                }

                if (Input.GetKey(KeyCode.UpArrow))
                {
                    move = lockAt * -1;
                }

                if (Input.GetKey(KeyCode.DownArrow))
                {
                    move = lockAt;
                }

                if (move != Vector3.zero) GridManger.Move(SelectedEntity, move);

                if (Input.GetKey(KeyCode.PageUp))
                {
                    GridManger.Move(SelectedEntity, new Vector3(0f, 1f, 0f));
                }

                if (Input.GetKey(KeyCode.PageDown))
                {
                    GridManger.Move(SelectedEntity, new Vector3(0f, -1f, 0f));
                }

                if (Input.GetKey(KeyCode.Home))
                {
                    GridManger.Rotate(SelectedEntity, -1f);
                }

                if (Input.GetKey(KeyCode.End))
                {
                    GridManger.Rotate(SelectedEntity, 1f);
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
            MeshRenderer renderer = entity.gameObject.GetComponentInChildren<MeshRenderer>();
            OriginalMaterials = null;
            if (renderer == null) return;
            OriginalMaterials = renderer.materials;
            List<Material> materials = new List<Material>(OriginalMaterials);
            materials.Add(SelectMaterial);
            renderer.materials = materials.ToArray();
        }

        private void UnselectEntity()
        {
            if (SelectedEntity == null) return;
            if (OriginalMaterials != null)
                SelectedEntity.gameObject.GetComponentInChildren<MeshRenderer>().materials = OriginalMaterials;
            SelectedEntity = null;
            OriginalMaterials = null;
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
