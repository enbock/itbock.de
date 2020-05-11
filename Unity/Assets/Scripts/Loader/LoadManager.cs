using System;
using System.Collections;
using System.Collections.Generic;
using Loader.FileIndex;
using UnityEngine;
using UnityEngine.Networking;

namespace Loader
{
    public class LoadManager : MonoBehaviour
    {
        public ProjectSettings Settings;
        public SharedContent SharedContent;
        public FileIndex.FileIndex FileIndex;

        void Start()
        {
            if (FileIndex == null)
            {
                LoadAsset("loader/fileindex", 0U, LoadStartContent);
            }
        }

        void LoadStartContent(GameObject asset)
        {
            GameObject instance = Instantiate(asset, gameObject.transform);
            FileIndex = instance.GetComponent<FileIndex.FileIndex>();
            LoadAsset(
                FileIndex.StartContent,
                (GameObject content) => { Instantiate(content); }
            );
        }

        void Update()
        {
        }

        public void LoadAsset(string assetBundleName, System.Action<GameObject> callback)
        {
            foreach (ContentData contentData in FileIndex.ContentData)
            {
                if (contentData.Name == assetBundleName)
                {
                    LoadAsset(contentData, callback);
                    return;
                }
            }

            Debug.LogError("Can not find '" + assetBundleName + "' in file index.");
        }

        void LoadAsset(ContentData file, System.Action<GameObject> callback)
        {
            LoadAsset(file.Name, file.Crc, callback);
        }

        void LoadAsset(string assetBundleName, uint crc, System.Action<GameObject> callback)
        {
            Debug.Log("Start loading '" + assetBundleName + "'");
            StartCoroutine(LoadAssetData(assetBundleName, crc, callback));
        }

        IEnumerator LoadAssetData(string assetBundleName, uint version, System.Action<GameObject> callback)
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

                    GameObject asset = assets[0];
                    Debug.Log("Asset '" + asset.name + "' loaded.");
                    try
                    {
                        AssetContent assetContent = asset.GetComponent<AssetContent>();
                        assetContent.LoaderManager = this;
                        assetContent.SharedContent = SharedContent;
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

                    callback(asset);
                }
            }
        }
    }
}