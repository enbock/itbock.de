using System;
using Loader;
using Unity.Collections;
using UnityEngine;
using UnityEngine.UIElements;

namespace Grid.Asset
{
    [Serializable]
    public class Entity : AssetContent
    {
        public string Name
        {
            get { return gameObject.name; }
        }

        public Requirement[] Requirements;
        public Vector3 Position;
        public Vector3 Rotation;
        public EntitySnap Snap;
    }
}