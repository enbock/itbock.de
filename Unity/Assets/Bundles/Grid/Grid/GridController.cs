using System.Collections.Generic;
using Bundles.UI.SelectList;
using Grid.Asset;
using UnityEngine;
using UnityEngine.UI;
using UnityTemplateProjects;
using Manager = Grid.Manager;

public class GridController : MonoBehaviour
{
    public Manager GridManager;
    public Button LoadLibrariesButton;
    public Text GridName;
    public Button GridNameEditButton;
    public InputField GridNameField;
    public SelectList SelectList;
    public GameObject Preview3D;
    public GameObject PreviewContainer;
    public GameObject PreviewUI;
    public Button AddToGridButton;
    public Button SaveGridButton;

    [ReadOnly] public Camera PlayerCamera;
    [ReadOnly] public List<CatalogEntity> Entities = new List<CatalogEntity>();

    private void OnEnable()
    {
        PlayerCamera = GridManager.SharedContent.Camera;
    }

    void Start()
    {
        LoadLibrariesButton.onClick.AddListener(LoadLibraries);
        GridManager.AssetManager.OnLoadEntity += NewEntity;
        SelectList.OnSelect += ShowPreview;
        SelectList.OnRemove += HidePreview;
        AddToGridButton.onClick.AddListener(InsertToGrid);
        GridNameEditButton.onClick.AddListener(SwitchToGridNameEdit);
        GridNameField.onEndEdit.AddListener(FinishGridNameEdit);
        GridNameField.onValueChanged.AddListener(ChangeGridName);
        SaveGridButton.onClick.AddListener(GridManager.SaveGrid);

        Preview3D.SetActive(false);
        PreviewUI.SetActive(false);
    }

    private void SwitchToGridNameEdit()
    {
        PlayerCamera.gameObject.GetComponent<SimpleCameraController>().enabled = false;
        GridNameField.text = GridManager.Grid.Name;
        GridNameField.gameObject.SetActive(true);
        GridNameField.ActivateInputField();
        GridName.gameObject.SetActive(false);
    }

    private void FinishGridNameEdit(string newName)
    {
        PlayerCamera.gameObject.GetComponent<SimpleCameraController>().enabled = true;
        GridNameField.gameObject.SetActive(false);
        GridName.gameObject.SetActive(true);
    }

    private void ChangeGridName(string newName)
    {
        GridManager.Grid.Name = newName;
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
        Entity entity = Instantiate(asset, PreviewContainer.transform);
        AssetHelper.AddRequirements(GridManager.SharedContent, entity);
        AssetHelper.SetLayerRecursive(PreviewContainer, 8);
        Preview3D.SetActive(true);
        PreviewUI.SetActive(true);
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
            (Entity entityPrefab) => { GridManager.AddToGrid(entityPrefab); }
        );
    }
}
