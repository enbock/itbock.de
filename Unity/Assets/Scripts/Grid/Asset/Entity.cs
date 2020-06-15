using System;
using Loader;
using UnityEngine;

namespace Grid.Asset
{
    [Serializable]
    public class Entity : AssetContent
    {
        public CatalogEntity CatalogEntity;
        public Requirement[] Requirements;
        public Vector3 Position;
        public Vector3 Rotation;
        public EntitySnap Snap;
        public string Data;
    }
}
