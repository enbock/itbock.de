using System.Collections;
using System.Collections.Generic;
using Loader;
using UnityEngine;

namespace Core.Environment
{
    public class LoadSubModules : MonoBehaviour
    {
        public AssetContent AssetContent;

        protected bool LoadingStarted = false;

        void Start()
        {
        }

        void Update()
        {
            if (AssetContent.LoaderManager != null && LoadingStarted == false)
            {
                LoadingStarted = true;
                AssetContent.LoaderManager.LoadAsset("core/startarea", InstantiateModule);
                AssetContent.LoaderManager.LoadAsset("core/weather", InstantiateModule);
            }
        }

        void InstantiateModule(GameObject asset)
        {
            Instantiate(asset, gameObject.transform);
        }
    }
}