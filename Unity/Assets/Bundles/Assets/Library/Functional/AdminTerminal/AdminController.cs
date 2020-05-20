using Grid.Asset;
using UnityEngine;
using UnityEngine.UI;
using UnityTemplateProjects;

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
        private bool FocusOnField = false;

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

        public override void Update()
        {
            base.Update();

            if (FocusOnField && Input.GetKeyDown(KeyCode.Return))
            {
                OnLoginClick();
            }

            if (FocusOnField != PasswordField.isFocused)
            {
                SharedContent.Camera.gameObject.GetComponent<SimpleCameraController>().enabled =
                    PasswordField.isFocused == false;
                FocusOnField = PasswordField.isFocused;
            }
        }

        private void UpdateScreen(bool loggedin)
        {
            LoginScreen.SetActive(loggedin == false);
            SuccessScreen.SetActive(loggedin);
        }

        private void OnLoginClick()
        {
            SharedContent.Camera.gameObject.GetComponent<SimpleCameraController>().enabled = true;
            AdminAuthorization.Login(PasswordField.text);
        }
    }
}
