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
        public GameObject Container;
        public Text GridName;

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