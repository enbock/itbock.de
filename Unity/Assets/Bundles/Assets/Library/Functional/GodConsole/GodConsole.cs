using Core.Weather;
using Grid.Asset;
using UnityEngine;
using UnityEngine.UI;

public class GodConsole : Entity
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
        float range = (data.Sun.Set - data.Sun.Rise) / 2;
        TimeChangeSlider.minValue = data.Sun.Rise - range - DateTime.Now;
        TimeChangeSlider.maxValue = data.Sun.Set + range - DateTime.Now;
        TimeChangeSlider.value = 0;
    }

    public void SetValue(float value)
    {
        DateTime.TimeOffetInSeconds = (long) value;
    }

    public void ResetValue()
    {
        TimeChangeSlider.value = 0;
    }
}