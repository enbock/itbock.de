using System;
using System.Net;
using Admin;
using Grid.Asset;
using Loader;
using UnityEngine;
using UnityEngine.UI;

namespace Grid
{
    public class Manager : Entity
    {
        public AdminAuthorization AdminAuthorization;
        public Text GridName;
        public Asset.Manager AssetManager;

        private void OnEnable()
        {
            AssetManager = SharedContent.GetComponent<Asset.Manager>();
        }

        public override void Start()
        {
            base.Start();
            GridName.text = Name;
        }

        public override void Update()
        {
            base.Update();
            Container.SetActive(AdminAuthorization.LoggedIn);
        }
    }
}