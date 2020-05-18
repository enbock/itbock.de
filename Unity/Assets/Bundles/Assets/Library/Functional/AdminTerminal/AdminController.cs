using System;
using Grid.Asset;
using UnityEngine;
using UnityEngine.UI;

namespace Admin
{
    public class AdminController : Entity
    {
        public AdminAuthorization AdminAuthorization;
        public InputField PasswordField;
        public Button LoginButton;
        public Button LogoutButton;
        public GameObject LoginScreen;
        public GameObject SuccessScreen;

        private void OnDestroy()
        {
            AdminAuthorization.OnLoginChange -= UpdateScreen;
        }

        public override void Start()
        {
            base.Start();
            AdminAuthorization = SharedContent.gameObject.GetComponent<AdminAuthorization>();
            LoginButton.onClick.AddListener(OnLoginClick);
            LogoutButton.onClick.AddListener(AdminAuthorization.Logout);
            AdminAuthorization.OnLoginChange += UpdateScreen;
            UpdateScreen(AdminAuthorization.LoggedIn);
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
