using System.Collections;
using System.Collections.Generic;
using Loader;
using UnityEngine;

namespace Core.Environment
{
    public class LoadStartArea : MonoBehaviour
    {
        public AssetContent AssetContent;

        protected bool StartAreaLoading = false;

        void Start()
        {
            Debug.Log("Load Start Area activated.");
        }

        void Update()
        {
            if (AssetContent.LoaderManager != null && StartAreaLoading == false)
            {
                StartAreaLoading = true;
                AssetContent.LoaderManager.LoadAsset(
                    "core/startarea",
                    (GameObject asset) => Instantiate(asset, gameObject.transform)
                );
            }
        }
    }
}