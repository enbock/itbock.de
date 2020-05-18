using System;
using System.Collections.Generic;
using System.Net;
using System.Reflection;
using Admin;
using Grid.Asset;
using Loader;
using UnityEngine;
using UnityEngine.UI;

namespace Grid
{
    public class Manager : Entity
    {
        public GameObject GridContainer;
        public Grid Grid = new Grid();

        [Space] [ReadOnly] public Asset.Manager AssetManager;
        [ReadOnly] public AdminAuthorization AdminAuthorization;

        public Dictionary<Entity, GridEntity> EntityMap = new Dictionary<Entity, GridEntity>();

        private void OnEnable()
        {
            AssetManager = SharedContent.GetComponent<Asset.Manager>();
        }

        public override void Update()
        {
            base.Update();
            Container.SetActive(AdminAuthorization.LoggedIn);
        }

        public Entity InstantiateEntityPrefab(Entity entityPrefab)
        {
            GameObject instance = Instantiate(entityPrefab.gameObject, GridContainer.transform);
            Entity entity = instance.GetComponent<Entity>();

            foreach (Requirement entityRequirement in entity.Requirements)
            {
                Component requirement = SharedContent.GetComponent(entityRequirement.Component);
                if (requirement == null)
                {
                    Debug.LogError(
                        "Requierement '" +
                        entityRequirement.Component +
                        "' can not be found in shared content '" +
                        SharedContent +
                        "'."
                    );
                }

                Type type = entity.GetType();
                FieldInfo field = type.GetField(entityRequirement.PropertyName);
                if (field != null)
                {
                    field.SetValue(entity, requirement);
                }
                else
                {
                    PropertyInfo property = type.GetProperty(entityRequirement.PropertyName);
                    if (property != null)
                    {
                        property.SetValue(entity, requirement);
                    }
                    else
                    {
                        Debug.LogError(
                            "Field or property '" +
                            entityRequirement.PropertyName +
                            "' not found in entity '" +
                            entity +
                            "'."
                        );
                    }
                }
            }

            return entity;
        }

        public Entity AddToGrid(Entity entityPrefab)
        {
            Entity entity = InstantiateEntityPrefab(entityPrefab);
            GridEntity gridEntity = new GridEntity();
            gridEntity.Name = entity.gameObject.name;
            gridEntity.CatalogEntity = entityPrefab.CatalogEntity;
            Grid.Assets.Add(gridEntity);
            EntityMap.Add(entity, gridEntity);

            return entity;
        }

        public bool IsEntityInGrid(Entity instance)
        {
            foreach (Entity entity in EntityMap.Keys)
            {
                if (entity == instance) return true;
            }

            return false;
        }

        public void Move(Entity selectedEntity, Vector3 move)
        {
            GridEntity gridEntity = EntityMap[selectedEntity];
            Vector3 newPosition = new Vector3(
                gridEntity.Position.x + move.x * selectedEntity.Snap.Horizontal,
                gridEntity.Position.y + move.y * selectedEntity.Snap.Vertical,
                gridEntity.Position.z + move.z * selectedEntity.Snap.Horizontal
            );
            MoveTo(selectedEntity, newPosition);
        }

        private void MoveTo(Entity selectedEntity, Vector3 newPosition)
        {
            GridEntity gridEntity = EntityMap[selectedEntity];
            gridEntity.Position = newPosition;
            selectedEntity.gameObject.transform.localPosition = newPosition;
        }

        public void Rotate(Entity selectedEntity, float direction)
        {
            GridEntity gridEntity = EntityMap[selectedEntity];
            Vector3 newRotation = new Vector3(
                0f,
                gridEntity.Rotation.y + direction * selectedEntity.Snap.Rotation,
                0f
            );
            RotateTo(selectedEntity, newRotation);
        }

        private void RotateTo(Entity selectedEntity, Vector3 newRotation)
        {
            GridEntity gridEntity = EntityMap[selectedEntity];
            gridEntity.Rotation = newRotation;
            selectedEntity.gameObject.transform.localRotation = Quaternion.Euler(newRotation);
        }

        public void Remove(Entity selectedEntity)
        {
            GridEntity gridEntity = EntityMap[selectedEntity];
            EntityMap.Remove(selectedEntity);
            Grid.Assets.Remove(gridEntity);
            GameObject.Destroy(selectedEntity.gameObject);
        }

        public void Duplicate(Entity selectedEntity, Action<Entity> callback)
        {
            AssetManager.RequestEntity(
                selectedEntity.CatalogEntity,
                (Entity entityPrefab) =>
                {
                    Entity entity = AddToGrid(entityPrefab);
                    GridEntity gridEntity = EntityMap[selectedEntity];
                    MoveTo(entity, gridEntity.Position);
                    RotateTo(entity, gridEntity.Rotation);
                    callback(entity);
                }
            );
        }
    }
}
