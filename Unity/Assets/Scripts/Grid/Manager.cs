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
        public GameObject GridContainer;
        public Grid Grid = new Grid();

        [Space]
        [ReadOnly] public Asset.Manager AssetManager;
        [ReadOnly] public AdminAuthorization AdminAuthorization;

        private void OnEnable()
        {
            AssetManager = SharedContent.GetComponent<Asset.Manager>();
        }

        public override void Update()
        {
            base.Update();
            Container.SetActive(AdminAuthorization.LoggedIn);
        }
    }
}
