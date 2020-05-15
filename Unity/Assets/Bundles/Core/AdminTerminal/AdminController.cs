using System.Collections;
using System.Collections.Generic;
using Loader;
using UnityEngine;
using UnityEngine.UI;

namespace Admin
{
    public class AdminController : AssetContent
    {
        public AdminAuthorization AdminAuthorization;
        public InputField PasswordField;
        public Button LoginButton;
        public GameObject LoginScreen;
        public GameObject SuccessScreen;

        public override void Start()
        {
            base.Start();
            LoginButton.onClick.AddListener(OnLoginClick);
            AdminAuthorization.OnLoginChange += UpdateScreen;
        }

        private void UpdateScreen(bool loggedin)
        {
            LoginScreen.SetActive(loggedin == false);
            SuccessScreen.SetActive(loggedin);
        }

        private void OnLoginClick()
        {
            AdminAuthorization.Login(PasswordField.text);
        }
    }
}