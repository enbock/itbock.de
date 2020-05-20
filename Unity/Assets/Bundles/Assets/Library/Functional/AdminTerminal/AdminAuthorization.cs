using System.Collections;
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
        public static bool LoggedIn = false;
        public string AutoPassword = string.Empty;

        private void Start()
        {
            if (AutoPassword != string.Empty) Login(AutoPassword);
        }

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
            Token = JsonConvert.DeserializeObject<TokenData>(json);
        }

        public void Logout()
        {
            Token = null;
            LoggedIn = false;
            OnLoginChange?.Invoke(LoggedIn);
        }
    }
}
