using System;
using UnityEngine;

namespace Core.Weather
{
    public class ColorHelper
    {
        public static Color ConvertColorTemperatureToColor(double colorTemperatur)
        {
            double temp = colorTemperatur / 100.0;
            double red, green, blue;

            if (temp <= 66.0)
            {
                red = 255;
                green = temp;
                green = 99.4708025861 * Math.Log(green) - 161.1195681661;

                if (temp <= 19.0)
                {
                    blue = 0;
                }
                else
                {
                    blue = temp - 10.0;
                    blue = 138.5177312231 * Math.Log(blue) - 305.0447927307;
                }
            }
            else
            {
                red = temp - 60.0;
                red = 329.698727446 * Math.Pow(red, -0.1332047592);

                green = temp - 60.0;
                green = 288.1221695283 * Math.Pow(green, -0.0755148492);

                blue = 255;
            }

            return new Color(
                ClampAndShift(red, 0D, 255D),
                ClampAndShift(green, 0D, 255D),
                ClampAndShift(blue, 0D, 255D)
            );
        }

        protected static float ClampAndShift(double value, double min, double max)
        {
            float clampedValue = (float) (value < min ? min : (value > max ? max : value));
            return 1f / 255f * clampedValue;
        }
    }
}