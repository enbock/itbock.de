using System;
using Grid.Asset;
using UnityEngine;

namespace Grid
{
    [Serializable]
    public class GridEntity
    {
        public CatalogEntity CatalogEntity = new CatalogEntity();
        public Vector3 Position = new Vector3();
        public Vector3 Rotation = new Vector3();
        public EntitySnap Snap = new EntitySnap();
    }
}