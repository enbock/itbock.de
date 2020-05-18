using Grid.Asset;
using Loader;
using UnityEngine;
using GridManager = Grid.Manager;

public class StartGridController : AssetContent
{
    public string EntityName = "StartGrid";

    protected override GameObject InstantiateModule(GameObject asset)
    {
        return CreateEntity(base.InstantiateModule(asset), EntityName);
    }

    private GameObject CreateEntity(GameObject instance, string entityName)
    {
        Entity entity = instance.GetComponent<Entity>();
        entity.gameObject.name = entityName;

        AssetHelper.AddRequirements(SharedContent, entity);
        GridManager gridManager = instance.GetComponent<GridManager>();
        gridManager.Grid.Name = EntityName;
        gridManager.LoadGrid("0a5fbaf8-b6c2-4f49-8d94-4e58e63c4618");

        return instance;
    }
}