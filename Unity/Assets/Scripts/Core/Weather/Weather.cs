using System.Collections;
using System.Collections.Generic;
using Loader;
using Newtonsoft.Json;
using UnityEngine;
using UnityEngine.Networking;

namespace Core.Weather
{
    public class Weather : AssetContent
    {
        public delegate void LoadAction(Data.Data data);
        public static event LoadAction OnLoad;
        
        public DateTime DateTime;
        public Sun Sun;
        public float DataRefreshTimer = 900f; // 15min
        public Data.Data Data = new Data.Data();
        
        private bool IsDay = true;
        private float TimePercent = 0f;

        override public void Start()
        {
            base.Start();
            
            Sun.GlobalLight = SharedContent.GlobalLight;
            Sun.SkyBox = SharedContent.SkyBox;
            DateTime = SharedContent.gameObject.GetComponent<DateTime>();
            StartCoroutine(LoadDataFrequenly(FromJson));
        }

        override public void Update()
        {
            base.Update();
            if (Data.IsLoaded)
            {
                CalculateAndUpdateTimePercent();
                Sun.IsDay = IsDay;
                Sun.TimePercent = TimePercent;
                Sun.AirTemperatur = Data.Wind.Temperature;
                Sun.Cloudiness = Data.Cloud.Cloudiness;
            }
        }

        IEnumerator LoadDataFrequenly(System.Action<string> callback)
        {
            while (true)
            {
                StartCoroutine(LoadWeatherData(callback));
                yield return new WaitForSecondsRealtime(DataRefreshTimer);
            }
        }

        IEnumerator LoadWeatherData(System.Action<string> callback)
        {
            UnityWebRequest www =
                UnityWebRequest.Get(SharedContent.ProjectSettings.ApiUri + "/weather-data");
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
            OnLoad?.Invoke(this.Data);
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
                ? (Data.Sun.Rise - nightTimeRange) // start sunset yesterday
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