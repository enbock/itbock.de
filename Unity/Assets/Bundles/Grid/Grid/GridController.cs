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
    public GameObject Preview3D;
    public GameObject PreviewContainer;
    public GameObject PreviewUI;
    public Button AddToGridButton;
    [ReadOnly] public List<CatalogEntity> Entities = new List<CatalogEntity>();

    void Start()
    {
        LoadLibrariesButton.onClick.AddListener(LoadLibraries);
        GridManager.AssetManager.OnLoadEntity += NewEntity;
        SelectList.OnSelect += ShowPreview;
        SelectList.OnRemove += HidePreview;
        AddToGridButton.onClick.AddListener(InsertToGrid);
        Preview3D.SetActive(false);
        PreviewUI.SetActive(false);
    }

    private void LoadLibraries()
    {
        GridManager.AssetManager.LoadAllLibraries();
    }

    void Update()
    {
        GridName.text = GridManager.Grid.Name + "(" + GridManager.Grid.Identifier + ")";
    }

    private void NewEntity(Entity entity)
    {
        CatalogEntity catalogEntity = entity.CatalogEntity;
        Entities.Add(catalogEntity);
        SelectList.AddItem(Entities.IndexOf(catalogEntity), catalogEntity.Name);
    }

    private void ShowPreview(int index)
    {
        foreach (Transform child in PreviewContainer.transform)
        {
            GameObject.Destroy(child.gameObject);
        }

        GridManager.AssetManager.RequestEntity(Entities[index], ShowPreviewEntity);
    }

    private void ShowPreviewEntity(Entity asset)
    {
        Instantiate(asset, PreviewContainer.transform);
        SetPreviewlayerRecursive(PreviewContainer);
        Preview3D.SetActive(true);
        PreviewUI.SetActive(true);
    }

    private void SetPreviewlayerRecursive(GameObject preview)
    {
        foreach (Transform child in preview.transform)
        {
            child.gameObject.layer = 8;
            SetPreviewlayerRecursive(child.gameObject);
        }
    }

    private void HidePreview()
    {
        Preview3D.SetActive(false);
        PreviewUI.SetActive(false);
    }

    private void InsertToGrid()
    {
        GridManager.AssetManager.RequestEntity(
            Entities[SelectList.SelectedItem.Id],
            (Entity entityPrefab) => { GridManager.AddToGrid(GridManager.InstantiateEntity(entityPrefab)); }
        );
    }
}
