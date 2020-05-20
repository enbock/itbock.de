using System;
using Grid.Asset;
using UnityEngine;

namespace Grid
{
    [Serializable]
    public class GridEntity
    {
        [ReadOnly] public string Identifier = Guid.NewGuid().ToString();
        public string Name = "No entity name";
        public CatalogEntity CatalogEntity = new CatalogEntity();
        public Vector3 Position = new Vector3();
        public Vector3 Rotation = new Vector3();
        public string Data = "";
    }
}