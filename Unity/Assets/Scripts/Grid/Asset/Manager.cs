using System;
using System.Collections.Generic;
using Loader;
using UnityEngine;

namespace Grid.Asset
{
    public class Manager : MonoBehaviour
    {
        public delegate void LoadEntityAction(Entity entity);

        public event LoadEntityAction OnLoadEntity;

        public LoadManager LoadManager;
        public SharedContent SharedContent;
        public string[] AssetLibrary = new string[0];

        public List<CatalogEntity> Catalog = new List<CatalogEntity>();
        public List<Entity> Assets = new List<Entity>();

        private Dictionary<CatalogEntity, Action<Entity>> Queue =
            new Dictionary<CatalogEntity, Action<Entity>>();

        private Dictionary<string, bool> LoadingLibraries = new Dictionary<string, bool>();

        private void OnEnable()
        {
            OnLoadEntity += AddEntityToCatalog;
        }

        private void Update()
        {
            if (Queue.Count > 0) ApplyFromQueue();
        }

        public void LoadAllLibraries()
        {
            foreach (string library in AssetLibrary)
            {
                if (IsLibraryLoaded(library)) continue;
                LoadLibrary(library);
            }
        }

        public void RequestEntity(CatalogEntity catalogEntity, Action<Entity> callback)
        {
            Queue.Add(catalogEntity, callback);
            if (IsLibraryLoaded(catalogEntity.Library) == false) LoadLibrary(catalogEntity.Library);
        }

        private bool IsLibraryLoaded(string library)
        {
            foreach (CatalogEntity catalogEntity in Catalog)
            {
                if (catalogEntity.Library == library) return true;
            }

            return false;
        }

        private void LoadLibrary(string library, Action<string> callback = null)
        {
            if (LoadingLibraries.ContainsKey(library))
            {
                return;
            }

            LoadingLibraries.Add(library, true);

            LoadManager.LoadAsset(
                library,
                (GameObject asset) =>
                {
                    AddAsset(library, asset);
                    LoadingLibraries[library] = false;

                    callback?.Invoke(library);

                    return asset;
                }
            );
        }

        private void AddAsset(string library, GameObject asset)
        {
            AssetContent content = asset.GetComponent<AssetContent>();
            if (content == null)
            {
                Debug.LogError("Missing 'Library' component in '" + library + "'. Library skipped.");
                return;
            }

            for (int index = 0; index < asset.transform.childCount; index++)
            {
                asset.transform.GetChild(index).gameObject.SetActive(true);
            }

            Entity[] entities = asset.GetComponentsInChildren<Entity>();
            Debug.Log("Load " + entities.Length + " entities from '" + library + "'.");
            foreach (Entity entity in entities)
            {
                CatalogEntity catalogEntity = new CatalogEntity();
                catalogEntity.Name = entity.gameObject.name;
                catalogEntity.Library = library;

                entity.SharedContent = SharedContent;
                entity.LoadManager = LoadManager;
                entity.CatalogEntity = catalogEntity;

                OnLoadEntity(entity);
            }
        }

        private void AddEntityToCatalog(Entity entity)
        {
            Catalog.Add(entity.CatalogEntity);
            Assets.Add(entity);
        }

        private void ApplyFromQueue()
        {
            CatalogEntity catalogEntity = null;
            Action<Entity> callback = null;
            foreach (KeyValuePair<CatalogEntity, Action<Entity>> pair in Queue)
            {
                if (IsLibraryLoaded(pair.Key.Library) == false)
                {
                    continue;
                }

                catalogEntity = pair.Key;
                callback = pair.Value;
                break;
            }

            if (callback == null || catalogEntity == null) return;

            Queue.Remove(catalogEntity);
            foreach (Entity asset in Assets)
            {
                if (asset.CatalogEntity != catalogEntity) continue;
                callback(asset);
                return;
            }

            Debug.LogWarning(
                "Entity '" +
                catalogEntity.Name +
                "' in loaded libaray '" +
                catalogEntity.Library +
                "' not found. Entity request ignored."
            );
        }
    }
}
