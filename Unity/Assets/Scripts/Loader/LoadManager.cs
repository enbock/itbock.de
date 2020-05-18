using System;
using System.Collections;
using System.Collections.Generic;
using Loader.FileIndex;
using UnityEngine;
using UnityEngine.Networking;

namespace Loader
{
    [Serializable]
    public struct OfflineAsset
    {
        public string BundleName;
        public GameObject Asset;
    }

    public class LoadManager : MonoBehaviour
    {
        public delegate void LoadAction(string assetBundleName, GameObject asset);

        public static event LoadAction OnLoad;

        public ProjectSettings Settings;
        public SharedContent SharedContent;
        public bool Offline = false;
        public OfflineAsset[] OfflineAssets;

        private Dictionary<string, GameObject> OfflineAssetList = new Dictionary<string, GameObject>();
        private Dictionary<string, GameObject> LoadedAssets = new Dictionary<string, GameObject>();
        private Dictionary<string, bool> Loading = new Dictionary<string, bool>();

        private Dictionary<string, List<Func<GameObject, GameObject>>> Queue =
            new Dictionary<string, List<Func<GameObject, GameObject>>>();

        private void OnEnable()
        {
            OnLoad += ApplyQueue;
            foreach (OfflineAsset offlineAsset in OfflineAssets)
            {
                OfflineAssetList.Add(offlineAsset.BundleName, offlineAsset.Asset);
            }
        }

        void Start()
        {
            LoadAsset("core/environment", 0U, (GameObject content) => { return Instantiate(content); });
        }

        void Update()
        {
        }

        public void LoadAsset(string assetBundleName, Func<GameObject, GameObject> callback)
        {
            LoadAsset(assetBundleName, 0U, callback);
        }

        void LoadAsset(ContentData file, Func<GameObject, GameObject> callback)
        {
            LoadAsset(file.Name, file.Crc, callback);
        }

        void LoadAsset(string assetBundleName, uint crc, Func<GameObject, GameObject> callback)
        {
            if (LoadedAssets.ContainsKey(assetBundleName))
            {
                callback(LoadedAssets[assetBundleName]);
                return;
            }

            if (Loading.ContainsKey(assetBundleName))
            {
                if (Queue.ContainsKey(assetBundleName) == false)
                {
                    Queue.Add(assetBundleName, new List<Func<GameObject, GameObject>>());
                }

                Queue[assetBundleName].Add(callback);

                return;
            }

            Loading.Add(assetBundleName, true);

            if (Offline)
            {
                if (OfflineAssetList.ContainsKey(assetBundleName))
                {
                    InitializeAsset(assetBundleName, OfflineAssetList[assetBundleName], callback);
                    return;
                }

                Debug.Log(
                    "Offline mode. Skip loading of '" +
                    assetBundleName +
                    "'." +
                    OfflineAssetList.ContainsKey(assetBundleName)
                );
                return;
            }

            StartCoroutine(LoadAssetData(assetBundleName, crc, callback));
        }

        private void ApplyQueue(string assetBundleName, GameObject asset)
        {
            if (Queue.ContainsKey(assetBundleName) == false) return;
            List<Func<GameObject, GameObject>> queue = Queue[assetBundleName];
            Queue.Remove(assetBundleName);

            foreach (Func<GameObject, GameObject> callback in queue)
            {
                callback(asset);
            }
        }

        IEnumerator LoadAssetData(string assetBundleName, uint version, Func<GameObject, GameObject> callback)
        {
            string url = Settings.HostUri + "/" + assetBundleName;
            using (UnityWebRequest request = UnityWebRequestAssetBundle.GetAssetBundle(url))
            {
                yield return request.SendWebRequest();

                if (request.isNetworkError || request.isHttpError)
                {
                    Debug.LogError("Error for " + url + " " + version + " " + request.error);
                }
                else
                {
                    AssetBundle bundle = DownloadHandlerAssetBundle.GetContent(request);

                    GameObject[] assets = bundle.LoadAllAssets<GameObject>();
                    if (assets.Length == 0)
                    {
                        Debug.LogError("No root game object not found in '" + assetBundleName + "'");
                        yield break;
                    }

                    if (assets.Length > 1)
                    {
                        Debug.LogWarning(
                            "More the one root game object found in '" +
                            assetBundleName +
                            "'. Only the first will be used!"
                        );
                    }

                    InitializeAsset(assetBundleName, assets[0], callback);
                }
            }
        }

        private void InitializeAsset(string assetBundleName, GameObject asset, Func<GameObject, GameObject> callback)
        {
            try
            {
                AssetContent[] assetContent = asset.GetComponents<AssetContent>();
                foreach (AssetContent content in assetContent)
                {
                    content.LoadManager = this;
                    content.SharedContent = SharedContent;
                }
            }
            catch (NullReferenceException exception)
            {
                Debug.LogWarning(
                    "Loaded Content of '" +
                    assetBundleName +
                    "' must have 'AssetContent' script.   " +
                    exception
                );
            }

            LoadedAssets.Add(assetBundleName, asset);
            Loading[assetBundleName] = false;

            callback(asset);

            OnLoad(assetBundleName, asset);
        }
    }
}
