using System.Collections;
using System.Collections.Generic;
using Core.Weather;
using Loader;
using UnityEngine;
using UnityEngine.Rendering.UI;
using UnityEngine.UI;

public class GodConsole : AssetContent
{
    public Slider TimeChangeSlider;
    public Button ResetButton;
    public DateTime DateTime;
    public Weather Weather;
    public Canvas Canvas;

    override public void Start()
    {
        base.Start();
        
        DateTime = SharedContent.GetComponent<DateTime>();
        Weather = GetComponentInParent<Weather>();
        Weather.OnLoad += OnWeatherDataLoad;
        Canvas.worldCamera = SharedContent.Camera;
        TimeChangeSlider.onValueChanged.AddListener(SetValue);
        ResetButton.onClick.AddListener(ResetValue);

        if (Weather.Data.IsLoaded)
        {
            OnWeatherDataLoad(Weather.Data);
        }
    }
    
    public void OnWeatherDataLoad(Core.Weather.Data.Data data)
    {
        TimeChangeSlider.minValue = data.Sun.Rise - DateTime.Now;
        TimeChangeSlider.maxValue = (TimeChangeSlider.minValue + (60L * 60L * 24L)) * 0.99f ;
        TimeChangeSlider.value = 0;
    }
    
    public void SetValue(float value)
    {
        DateTime.TimeOffetInSeconds = (long)value;
    }

    public void ResetValue()
    {
        TimeChangeSlider.value = 0;
    }
}
