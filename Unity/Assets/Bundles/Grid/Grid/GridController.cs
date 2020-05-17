using System;
using System.Collections;
using System.Collections.Generic;
using Bundles.UI.SelectList;
using Grid.Asset;
using UnityEngine;
using UnityEngine.UI;
using Manager = Grid.Manager;

public class GridController : MonoBehaviour
{
    public Manager GridManager;
    public Button LoadLibrariesButton;
    public Text GridName;
    public SelectList SelectList;
    [ReadOnly] public List<CatalogEntity> Entities = new List<CatalogEntity>();

    void Start()
    {
        LoadLibrariesButton.onClick.AddListener(LoadLibraries);
        GridManager.AssetManager.OnLoadEntity += NewEntity;
    }

    private void LoadLibraries()
    {
        GridManager.AssetManager.LoadAllLibraries();
    }

    void Update()
    {
        GridName.text = GridManager.Grid.Name;
    }

    private void NewEntity(Entity entity)
    {
        CatalogEntity catalogEntity = entity.CatalogEntity;
        Entities.Add(catalogEntity);
        SelectList.AddItem(Entities.IndexOf(catalogEntity), catalogEntity.Name);
    }
}
