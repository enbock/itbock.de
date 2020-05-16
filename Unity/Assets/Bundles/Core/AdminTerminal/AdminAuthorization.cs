using System.Collections;
using System.Collections.Generic;
using Loader;
using Newtonsoft.Json;
using UnityEngine;
using UnityEngine.Networking;

namespace Admin
{
    public class AdminAuthorization : MonoBehaviour
    {
        public delegate void LoginChangedAction(bool loggedIn);

        public static event LoginChangedAction OnLoginChange;

        public SharedContent SharedContent;
        public TokenData Token;
        public bool LoggedIn = false;

        public void Login(string password)
        {
            StartCoroutine(DoLogin(password, ParseToken));
        }

        IEnumerator DoLogin(string password, System.Action<string> callback)
        {
            UnityWebRequest www = UnityWebRequest.Post(SharedContent.ProjectSettings.ApiUri + "/admin-login", password);
            yield return www.SendWebRequest();

            if (www.isNetworkError || www.isHttpError)
            {
                UnityEngine.Debug.Log(www.error);
                LoggedIn = false;
            }
            else
            {
                LoggedIn = true;
                callback(www.downloadHandler.text);
            }

            OnLoginChange?.Invoke(LoggedIn);
        }

        void ParseToken(string json)
        {
            this.Token = JsonConvert.DeserializeObject<TokenData>(json);
        }
    }
}