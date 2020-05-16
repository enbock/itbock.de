using System;
using UnityEngine;

namespace Core.Weather
{
    [System.Serializable]
    public class ColorSetup
    {
        public double SunRise = 3000D;
        public double MidDay = 5600D;
        public double SunSet = 6500D;
        public double MidNight = 20000D;
        public double CouldOffset = 2000D;
        public double WarmOffset = -1000D;

        public double[] DayRange = new double[2] {30D, 60D};
        public double[] NightRange = new double[2] {25D, 75D};

        public double Intensity = 2f;
        public double[] IntensityNightRange = new double[2] {5D, 95D}; // Sun off, between 5% and 95% of night
    }

    public class Sun : MonoBehaviour
    {
        public Light GlobalLight;
        public ColorSetup ColorSetup = new ColorSetup();
        public double AirTemperatur;
        public double Cloudiness = 100D;
        public Material SkyBox;

        public double SunColorTemperatur;
        public Color SunColor;
        public double SunIntensity = 2f;
        public bool IsDay = true;
        public float TimePercent = 0f;
        private float LastAngle = 0f;

        void Update()
        {
            if (GlobalLight == false) return;
            UpdateSunPosition();
            UpdateSunColor();
        }

        private void UpdateSunPosition()
        {
            Quaternion rotation = GlobalLight.transform.rotation;
            float sunAngle = CalculateAngle();

            Quaternion target = Quaternion.Euler(
                sunAngle,
                130f,
                90f
            );
            LastAngle = sunAngle;
            GlobalLight.transform.rotation = target; //Quaternion.Slerp(transform.rotation, target, 1f);
            GlobalLight.color = SunColor;
            float cloudinessPercent = 1f / 100f * (float) Cloudiness;
            float sunIntensity = (float) (SunIntensity * (0.3D + (0.7D / 100D * Cloudiness)));
            GlobalLight.intensity = sunIntensity;
            GlobalLight.shadowStrength = cloudinessPercent;

            float fogIntensity = sunIntensity * 0.8f;
            Color cloudTransmissionColor = new Color(
                SunColor.r * fogIntensity,
                SunColor.g * fogIntensity,
                SunColor.b * fogIntensity,
                1f
            );
            RenderSettings.fogColor = cloudTransmissionColor;

            SkyBox.SetFloat("_SunLightPower", sunIntensity / 2f);
            SkyBox.SetFloat("_CloudsDensity", cloudinessPercent);
            SkyBox.SetFloat("_CloudsThickness", 0.1f + (0.2f * cloudinessPercent));
            SkyBox.SetColor("_DayTransmissionColor", cloudTransmissionColor);
            SkyBox.SetColor("_NightTransmissionColor", cloudTransmissionColor);
        }

        private void UpdateSunColor()
        {
            double[] range = IsDay ? ColorSetup.DayRange : ColorSetup.NightRange;
            double startColor = IsDay ? ColorSetup.SunRise : ColorSetup.SunSet;
            double midColor = IsDay ? ColorSetup.MidDay : ColorSetup.MidNight;
            double endColor = IsDay ? ColorSetup.SunSet : ColorSetup.SunRise;

            bool isStart = TimePercent < 50D;
            double reachedAt = range[0];
            double reachedUntil = range[1];
            double domain = isStart ? reachedAt : 100D - reachedUntil;
            double cursor = (isStart ? TimePercent : TimePercent - reachedUntil);
            cursor = cursor >= domain ? domain : (cursor < 0 ? 0 : cursor); // clamp
            double domainPercent = 1D / domain * cursor;

            double sunColorTemperatur = isStart
                    ? (
                        TimePercent < reachedAt
                            ? (startColor * (1D - domainPercent) + midColor * domainPercent)
                            : midColor
                    )
                    : (
                        TimePercent <= reachedUntil
                            ? midColor
                            : (midColor * (1D - domainPercent) + endColor * domainPercent)
                    )
                ;

            double temperaturOffset = 0D;
            if (AirTemperatur < -10D) temperaturOffset = ColorSetup.CouldOffset;
            else if (AirTemperatur > 25D) temperaturOffset = ColorSetup.WarmOffset;
            else
            {
                if (AirTemperatur < 5D)
                {
                    domain = 15D;
                    cursor = AirTemperatur + 10D;
                    domainPercent = 1D / domain * cursor;
                    temperaturOffset = ColorSetup.CouldOffset * (1D - domainPercent);
                }
                else
                {
                    domain = 20D;
                    cursor = AirTemperatur - 5D;
                    domainPercent = 1D / domain * cursor;
                    temperaturOffset = ColorSetup.WarmOffset * domainPercent;
                }
            }

            sunColorTemperatur += temperaturOffset;
            SunColorTemperatur = sunColorTemperatur;
            SunColor = ColorHelper.ConvertColorTemperatureToColor(sunColorTemperatur);

            SunIntensity = ColorSetup.Intensity;
            if (IsDay == false)
            {
                reachedAt = ColorSetup.IntensityNightRange[0];
                reachedUntil = ColorSetup.IntensityNightRange[1];
                domain = isStart ? reachedAt : 100D - reachedUntil;
                cursor = (isStart ? TimePercent : TimePercent - reachedUntil);
                cursor = cursor >= domain ? domain : (cursor < 0 ? 0 : cursor); // clamp
                domainPercent = 1D / domain * cursor;

                SunIntensity = isStart
                        ? (
                            TimePercent < reachedAt
                                ? ColorSetup.Intensity * (1D - domainPercent)
                                : 0D
                        )
                        : (
                            TimePercent <= reachedUntil
                                ? 0D
                                : ColorSetup.Intensity * domainPercent
                        )
                    ;
            }
        }

        private float CalculateAngle()
        {
            float angleRange = 180f;
            float anglePercent = angleRange / 100f;

            float angleOffset = IsDay ? 0f : 180f;
            float angle = (anglePercent * TimePercent) - angleOffset;

            return angle < 0f ? angle + 360f : (angle > 360f ? angle - 360f : angle);
        }
    }
}