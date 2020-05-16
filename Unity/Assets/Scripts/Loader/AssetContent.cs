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

        virtual public void Update()
        {
        }

        private void LoadSubAssets()
        {
            foreach (string assetName in SubAssests)
            {
                LoadManager.LoadAsset(assetName, InstantiateModule);
            }
        }

        virtual protected GameObject InstantiateModule(GameObject asset)
        {
            return Instantiate(asset, gameObject.transform);
        }
    }
}