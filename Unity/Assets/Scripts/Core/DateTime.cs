using System;
using UnityEngine;

namespace Core.Weather
{
    public class DateTime : MonoBehaviour
    {
        public long TimeOffetInSeconds = 0L;

        public long Now
        {
            get { return ToUnixTimeStamp(System.DateTime.UtcNow) + TimeOffetInSeconds; }
        }

        public long CurrentDayStart
        {
            get
            {
                System.DateTime utcNow = System.DateTime.UtcNow;
                System.DateTime date = new System.DateTime(utcNow.Year, utcNow.Month, utcNow.Day, 0, 0, 0, 0);

                return ToUnixTimeStamp(date);
            }
        }

        private long ToUnixTimeStamp(System.DateTime date)
        {
            return ((DateTimeOffset) date).ToUnixTimeSeconds();
        }
    }
}