using System;
using System.Collections.Generic;
using Loader;
using UnityEngine;

namespace Grid.Asset
{
    public class Manager : MonoBehaviour
    {
        public LoadManager LoadManager;
        public SharedContent SharedContent;
        public string[] AssetLibrary = new string[0];

        public List<CatalogEntity> Catalog = new List<CatalogEntity>();
        public List<Entity> Assets = new List<Entity>();

        public void LoadAllLibraries()
        {
            foreach (string library in AssetLibrary)
            {
                if(IsLibraryLoaded(library)) continue;
                LoadLibrary(library);
            }
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
            LoadManager.LoadAsset(
                library,
                (GameObject asset) =>
                {
                    AddAsset(library, asset);
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
                Debug.LogError("Missing 'Library' component in '" + library + "'.");
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
                catalogEntity.Name = entity.Name;
                catalogEntity.Library = library;

                entity.SharedContent = SharedContent;
                entity.LoadManager = LoadManager;
                
                Catalog.Add(catalogEntity);
                Assets.Add(entity);
            }
        }
    }
}