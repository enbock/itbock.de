using System.Collections.Generic;
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
        [ReadOnly] public Material[] OriginalMaterials;

        private void OnEnable()
        {
            PlayerCamera = GridManger.SharedContent.Camera;
            GridManger.OnAddToGrid += SelectEntity;
        }

        private void Update()
        {
            if (
                PlayerCamera.gameObject.GetComponent<SimpleCameraController>().enabled == false ||
                GridManger.AdminAuthorization.LoggedIn == false
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

            if (SelectedEntity)
            {
                if (Input.GetKey(KeyCode.RightArrow))
                {
                    GridManger.Move(SelectedEntity, new Vector3(-1f, 0f, 0f));
                }

                if (Input.GetKey(KeyCode.LeftArrow))
                {
                    GridManger.Move(SelectedEntity, new Vector3(1f, 0f, 0f));
                }

                if (Input.GetKey(KeyCode.UpArrow))
                {
                    GridManger.Move(SelectedEntity, new Vector3(0f, 0f, -1f));
                }

                if (Input.GetKey(KeyCode.DownArrow))
                {
                    GridManger.Move(SelectedEntity, new Vector3(0f, 0f, 1f));
                }

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
            }
        }

        private void SelectEntity(Entity entity)
        {
            if (SelectedEntity != null && entity != SelectedEntity) UnselectEntity();
            if (SelectedEntity == entity) return;
            MeshRenderer renderer = entity.gameObject.GetComponentInChildren<MeshRenderer>();
            OriginalMaterials = renderer.materials;
            List<Material> materials = new List<Material>(OriginalMaterials);
            materials.Add(SelectMaterial);
            renderer.materials = materials.ToArray();
            SelectedEntity = entity;
        }

        private void UnselectEntity()
        {
            if (SelectedEntity == null) return;
            SelectedEntity.gameObject.GetComponentInChildren<MeshRenderer>().materials = OriginalMaterials;
            SelectedEntity = null;
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