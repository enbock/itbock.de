using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using Admin;
using Grid.Asset;
using Newtonsoft.Json;
using UnityEngine;
using UnityEngine.Networking;

namespace Grid
{
    public class Manager : Entity
    {
        public delegate void AddToGridAction(Entity entity);

        public event AddToGridAction OnAddToGrid;
        public GameObject GridContainer;
        public bool DemoMode = false;

        public bool IsActive
        {
            get { return Container.activeSelf; }
        }

        [ReadOnly] public Grid Grid = new Grid();
        [ReadOnly] public Asset.Manager AssetManager;
        [ReadOnly] public AdminAuthorization AdminAuthorization;

        public Dictionary<Entity, GridEntity> EntityMap = new Dictionary<Entity, GridEntity>();

        private void OnEnable()
        {
            AssetManager = SharedContent.GetComponent<Asset.Manager>();
        }

        public override void Update()
        {
            base.Update();
            if (DemoMode == false && IsActive != AdminAuthorization.LoggedIn)
                Container.SetActive(AdminAuthorization.LoggedIn);
            if (DemoMode == true && IsActive == false) Container.SetActive(true);
        }

        public Entity InstantiateEntityPrefab(Entity entityPrefab)
        {
            GameObject instance = Instantiate(entityPrefab.gameObject, GridContainer.transform);
            Entity entity = instance.GetComponent<Entity>();

            AssetHelper.AddRequirements(SharedContent, entity);

            return entity;
        }

        private Entity InstantiateEntityPrefabForGrid(Entity entityPrefab, GridEntity gridEntity)
        {
            Entity entity = InstantiateEntityPrefab(entityPrefab);
            entity.gameObject.name = gridEntity.Name;
            EntityMap.Add(entity, gridEntity);
            MoveTo(entity, gridEntity.Position);
            RotateTo(entity, gridEntity.Rotation);
            entity.Data = gridEntity.Data;
            entity.OnDataChange += (string data) => { gridEntity.Data = data; };

            // Sub-Grid Initialization
            Manager gridManager = entity.gameObject.GetComponent<Manager>();
            if (gridManager != null)
            {
                gridManager.LoadGrid(gridEntity.Identifier);
            }

            Collider helpCollider = entity.gameObject.GetComponent<Collider>();
            if (helpCollider != null) Destroy(helpCollider);

            return entity;
        }

        public Entity AddToGrid(Entity entityPrefab)
        {
            if (DemoMode && entityPrefab.CatalogEntity.Name == "Grid") return null;

            GridEntity gridEntity = new GridEntity();
            gridEntity.Name = entityPrefab.CatalogEntity.Name + "(" + gridEntity.Identifier + ")";
            gridEntity.CatalogEntity = entityPrefab.CatalogEntity;
            Grid.Assets.Add(gridEntity);
            Entity entity = InstantiateEntityPrefabForGrid(entityPrefab, gridEntity);

            OnAddToGrid?.Invoke(entity);

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

        public void RotateHorizontal(Entity selectedEntity, float direction)
        {
            GridEntity gridEntity = EntityMap[selectedEntity];

            Vector3 newRotation = new Vector3(
                gridEntity.Rotation.x,
                gridEntity.Rotation.y + direction * selectedEntity.Snap.Rotation,
                gridEntity.Rotation.z
            );

            RotateTo(selectedEntity, newRotation);
        }

        public void RotateVertical(Entity selectedEntity, float direction)
        {
            GridEntity gridEntity = EntityMap[selectedEntity];

            Vector3 newRotation = new Vector3(
                gridEntity.Rotation.x + direction * selectedEntity.Snap.Rotation,
                gridEntity.Rotation.y,
                gridEntity.Rotation.z
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

        private void RemoveGrid()
        {
            Entity[] entities = EntityMap.Keys.ToArray();
            EntityMap.Clear();
            foreach (Entity entity in entities)
            {
                GameObject.Destroy(entity.gameObject);
            }
        }

        public void Duplicate(Entity selectedEntity)
        {
            AssetManager.RequestEntity(
                selectedEntity.CatalogEntity,
                (Entity entityPrefab) =>
                {
                    Entity entity = AddToGrid(entityPrefab);
                    GridEntity gridEntity = EntityMap[selectedEntity];
                    MoveTo(entity, gridEntity.Position);
                    RotateTo(entity, gridEntity.Rotation);
                }
            );
        }

        public void SaveGrid()
        {
            if (DemoMode) return;
            StartCoroutine(UploadGridData(JsonConvert.SerializeObject(Grid)));

            EntityMap.Keys.ToList<Entity>()
                .FindAll((Entity entity) => entity is Manager)
                .ForEach(
                    (Entity entity) => (entity as Manager).SaveGrid()
                );
        }

        IEnumerator UploadGridData(string gridData)
        {
            if (AdminAuthorization.LoggedIn == false) yield break;

            UnityWebRequest www = UnityWebRequest.Put(
                SharedContent.ProjectSettings.ApiUri + "/grid",
                System.Text.Encoding.UTF8.GetBytes(gridData)
            );

            www.SetRequestHeader("admin-token", AdminAuthorization.Token.Token);
            yield return www.SendWebRequest();
            if (www.isNetworkError || www.isHttpError)
            {
                UnityEngine.Debug.Log(www.error);
                AdminAuthorization.Logout();
            }
        }

        public void LoadGrid(string gridIdentifier)
        {
            Grid grid = new Grid();
            grid.Identifier = gridIdentifier;

            ReplaceGrid(grid);
            if (DemoMode) return;
            StartCoroutine(LoadGridData(gridIdentifier, ReplaceGrid));
        }

        IEnumerator LoadGridData(string identifier, Action<String> callback)
        {
            string gridUrl = SharedContent.ProjectSettings.HostUri + "/grid-data/" + identifier + ".json";
            UnityWebRequest www = UnityWebRequest.Get(gridUrl);
            yield return www.SendWebRequest();
            if (www.isNetworkError || www.isHttpError)
            {
                UnityEngine.Debug.LogError("Not able to load '" + gridUrl + "'. " + www.error);
                yield break;
            }

            callback(www.downloadHandler.text);
        }

        private void ReplaceGrid(string gridData)
        {
            Grid grid = JsonConvert.DeserializeObject<Grid>(gridData);
            ReplaceGrid(grid);
        }

        private void ReplaceGrid(Grid grid)
        {
            RemoveGrid();
            Grid = grid;
            GridContainer.name = Grid.Name;
            foreach (GridEntity gridEntity in Grid.Assets)
            {
                AssetManager.RequestEntity(
                    gridEntity.CatalogEntity,
                    (Entity entityPrefab) => { InstantiateEntityPrefabForGrid(entityPrefab, gridEntity); }
                );
            }
        }
    }
}
