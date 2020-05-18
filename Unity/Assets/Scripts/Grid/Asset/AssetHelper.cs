using System;
using System.Reflection;
using Loader;
using UnityEngine;

namespace Grid.Asset
{
    public class AssetHelper : MonoBehaviour
    {
        public static void AddRequirements(SharedContent sharedContent, Entity entity)
        {
            foreach (Requirement entityRequirement in entity.Requirements)
            {
                Component requirement = sharedContent.GetComponent(entityRequirement.Component);
                if (requirement == null)
                {
                    requirement = entity.gameObject.GetComponentInParent(Type.GetType(entityRequirement.Component));
                }

                if (requirement == null)
                {
                    Debug.LogError(
                        "Requierement '" +
                        entityRequirement.Component +
                        "' can not be found in parents or shared content '" +
                        sharedContent +
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
        }

        public static void SetLayerRecursive(GameObject preview, int layer)
        {
            foreach (Transform child in preview.transform)
            {
                child.gameObject.layer = layer;
                SetLayerRecursive(child.gameObject, layer);
            }
        }
    }
}
