using System;
using System.Reflection;
using System.Runtime.CompilerServices;
using Grid.Asset;
using Loader;
using UnityEngine;

public class StartGridController : AssetContent
{
    public string EntityName = "StartGrid";
    public AssetContent DevOfflineAsset;

    public override void Start()
    {
        base.Start();
        if (LoadManager.Offline)
        {
            DevOfflineAsset.LoadManager = LoadManager;
            DevOfflineAsset.SharedContent = SharedContent;
            InstantiateModule(DevOfflineAsset.gameObject);
        }
    }

    protected override GameObject InstantiateModule(GameObject asset)
    {
        return CreateEntity(base.InstantiateModule(asset), EntityName);
    }

    private GameObject CreateEntity(GameObject asset, string entityName)
    {
        Entity entity = asset.GetComponent<Entity>();
        entity.Name = entityName;
        entity.gameObject.name = entityName;

        foreach (Requirement entityRequirement in entity.Requirements)
        {
            Component requirement = SharedContent.GetComponent(entityRequirement.Component);
            if (requirement == null)
            {
                Debug.LogError(
                    "Requierement '" +
                    entityRequirement.Component +
                    "' can not be found in shared content '" +
                    SharedContent +
                    "'."
                );
            }

            Type type = entity.GetType();
            FieldInfo field = type.GetField(entityRequirement.PropertyName);
            if (field != null)
            {
                field.SetValue(entity, requirement);
            }
            else
            {
                PropertyInfo property = type.GetProperty(entityRequirement.PropertyName);
                if (property != null)
                {
                    property.SetValue(entity, requirement);
                }
                else
                {
                    Debug.LogError(
                        "Field or property '" +
                        entityRequirement.PropertyName +
                        "' not found in entity '" +
                        entity +
                        "'."
                    );
                }
            }
        }

        return asset;
    }
}