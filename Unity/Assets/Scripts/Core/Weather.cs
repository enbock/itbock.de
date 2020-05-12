using System.Collections;
using System.Collections.Generic;
using Loader;
using Newtonsoft.Json;
using UnityEngine;
using UnityEngine.Networking;

namespace Core.Weather
{
    public class Weather : MonoBehaviour
    {
        public AssetContent AssetContent;
        private bool Started = false;
        public Data Data;


        void Start()
        {
            Debug.Log(AssetContent.LoaderManager);
            if (AssetContent.LoaderManager == null) return;
            Started = true;
            StartCoroutine(LoadWeatherData(FromJson));
        }

        void Update()
        {
            if (AssetContent.LoaderManager != null && Started == false) Start();
        }

        IEnumerator LoadWeatherData(System.Action<string> callback)
        {
            UnityWebRequest www =
                UnityWebRequest.Get(AssetContent.SharedContent.ProjectSettings.ApiUri + "/weather-data");
            yield return www.SendWebRequest();

            if (www.isNetworkError || www.isHttpError)
            {
                Debug.Log(www.error);
            }

            callback(www.downloadHandler.text);
        }

        void FromJson(string json)
        {
            this.Data = JsonConvert.DeserializeObject<Data>(json);
        }
    }
}