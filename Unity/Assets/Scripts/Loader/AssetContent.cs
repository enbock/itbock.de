using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace Loader
{
    public class AssetContent : MonoBehaviour
    {
        public LoadManager LoadManager;
        public SharedContent SharedContent;

        public string[] SubAssests = new string[0];
        private GameObject container;

        virtual public void Start()
        {
            LoadSubAssets();
        }

        private void LoadSubAssets()
        {
            foreach (string assetName in SubAssests)
            {
                LoadManager.LoadAsset(assetName, InstantiateModule);
            }
        }

        private void InstantiateModule(GameObject asset)
        {
            Instantiate(asset, gameObject.transform);
        }
    }
}