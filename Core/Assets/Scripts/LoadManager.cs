using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Networking;

public class LoadManager : MonoBehaviour
{
    public ProjectSettings Settings;

    // Start is called before the first frame update
    void Start()
    {
        LoadAsset(
            "core/environment",
            0,
            (GameObject content) =>
            {
                Instantiate(content);
            }
        );
    }

    // Update is called once per frame
    void Update()
    {
    }

    void LoadAsset(string assetBundleName, uint version, System.Action<GameObject> callback)
    {
        StartCoroutine(LoadAssetData(assetBundleName, version, callback));
    }

    IEnumerator LoadAssetData(string assetBundleName, uint version, System.Action<GameObject> callback)
    {
        string url = Settings.HostUri + "/" + assetBundleName;
        using (UnityWebRequest request = UnityWebRequestAssetBundle.GetAssetBundle(url, version))
        {
            yield return request.SendWebRequest();

            if (request.isNetworkError || request.isHttpError)
            {
                Debug.LogError("Error for " + url + " " + version + " " + request.error);
            }
            else
            {
                AssetBundle bundle = DownloadHandlerAssetBundle.GetContent(request);
                
                /*
                Material[] materials = bundle.LoadAllAssets<Material>();
                Debug.Log("Loaded Materials: " + materials.Length);
                foreach(Material material in materials)
                {
                    string shaderName = material.shader.name;
                    Shader newShader = Shader.Find(shaderName);
                    if(newShader != null)
                    {
                        material.shader = newShader;
                        Debug.Log("refresh shader: "+ shaderName + " in material " + material.name);
                    }
                    else
                    {
                        Debug.LogWarning("unable to refresh shader: "+ shaderName + " in material " + material.name);
                    }
                }
                */
                
                GameObject asset = bundle.LoadAsset<GameObject>("AssetContent");
                try
                {
                    AssetContent assetContent = asset.GetComponent<AssetContent>();
                    assetContent.LoaderManager = this;
                }
                catch (NullReferenceException exception)
                {
                    Debug.LogError("Loaded Content must have 'AssetContent' script.   " + exception);
                }

                callback(asset);
            }
        }
    }
}