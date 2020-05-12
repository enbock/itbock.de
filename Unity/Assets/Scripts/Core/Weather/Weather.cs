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
        public DateTime DateTime;
        public Sun Sun;
        public Data.Data Data = new Data.Data();
        
        private bool IsDay = true;
        private float TimePercent = 0f;
        private bool Started = false;

        void Start()
        {
            if (AssetContent.LoaderManager == null) return;
            Started = true;
            Sun.GlobalLight = AssetContent.SharedContent.GlobalLight;
            StartCoroutine(LoadWeatherData(FromJson));
        }

        void Update()
        {
            if (AssetContent.LoaderManager != null && Started == false) Start();

            if (Data.IsLoaded)
            {
                CalculateAndUpdateTimePercent();
                Sun.IsDay = IsDay;
                Sun.TimePercent = TimePercent;
                Sun.AirTemperatur = Data.Wind.Temperature;
            }
        }

        IEnumerator LoadWeatherData(System.Action<string> callback)
        {
            UnityWebRequest www =
                UnityWebRequest.Get(AssetContent.SharedContent.ProjectSettings.ApiUri + "/weather-data");
            yield return www.SendWebRequest();

            if (www.isNetworkError || www.isHttpError)
            {
                UnityEngine.Debug.Log(www.error);
                yield break;
            }

            callback(www.downloadHandler.text);
        }

        void FromJson(string json)
        {
            this.Data = JsonConvert.DeserializeObject<Data.Data>(json);
            this.Data.IsLoaded = true;
        }

        void CalculateAndUpdateTimePercent()
        {
            long dayTime = (60L * 60L * 24L);
            long dayTimeRange = Data.Sun.Set - Data.Sun.Rise;
            long nightTimeRange = dayTime - dayTimeRange;

            long now = DateTime.Now;
            bool isMorning = now < Data.Sun.Rise;
            IsDay = now >= Data.Sun.Rise && now <= Data.Sun.Set;

            long timeRange = IsDay ? dayTimeRange : nightTimeRange;
            long timeOffset = isMorning
                ? (Data.Sun.Set - nightTimeRange) // start sunset yesterday
                : (
                    IsDay
                        ? Data.Sun.Rise // day start at rise
                        : Data.Sun.Set // night start a set
                );
            long time = now - timeOffset;
            TimePercent = 100f / timeRange * time;
        }
    }
}