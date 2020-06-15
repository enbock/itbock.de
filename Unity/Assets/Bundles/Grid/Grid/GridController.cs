using System.Collections.Generic;
using Bundles.Grid.Grid;
using Bundles.UI;
using Bundles.UI.SelectList;
using Grid.Asset;
using UnityEngine;
using UnityEngine.UI;
using UnityTemplateProjects;
using Manager = Grid.Manager;

public class GridController : MonoBehaviour
{
    public Manager GridManager;
    public GridEditController EditController;
    public Button LoadLibrariesButton;
    public Text GridName;
    public Button GridNameEditButton;
    public InputField GridNameField;
    public SelectList SelectList;
    public GameObject Preview3D;
    public GameObject PreviewContainer;
    public GameObject PreviewUI;
    public Camera PreviewCamera;
    public RawImage PreviewImage;
    public Button AddToGridButton;
    public Button SaveGridButton;
    public Button ReloadGridButton;
    public InputField DataInput;
    public InputFieldFocusObserver DataInputFocus;

    [ReadOnly] public Camera PlayerCamera;
    [ReadOnly] public List<CatalogEntity> Entities = new List<CatalogEntity>();
    [ReadOnly] public Entity SelectedEntity;

    private void OnEnable()
    {
        PlayerCamera = GridManager.SharedContent.Camera;
        GridManager.AssetManager.OnLoadEntity += NewEntity;
        RenderTexture cameraOutput = new RenderTexture(PreviewCamera.targetTexture);
        cameraOutput.wrapMode = TextureWrapMode.Clamp;
        cameraOutput.filterMode = FilterMode.Bilinear;
        PreviewCamera.targetTexture = cameraOutput;
        PreviewImage.texture = cameraOutput;
        EditController.OnEntityChange += SwitchLayout;
        LoadLibrariesButton.onClick.AddListener(LoadLibraries);
        SelectList.OnSelect += ShowPreview;
        SelectList.OnRemove += HidePreview;
        AddToGridButton.onClick.AddListener(InsertToGrid);
        GridNameEditButton.onClick.AddListener(SwitchToGridNameEdit);
        GridNameField.onEndEdit.AddListener(FinishGridNameEdit);
        GridNameField.onValueChanged.AddListener(ChangeGridName);
        SaveGridButton.onClick.AddListener(GridManager.SaveGrid);
        ReloadGridButton.onClick.AddListener(delegate { GridManager.LoadGrid(GridManager.Grid.Identifier); });
        DataInputFocus.OnFocusChange += SwitchDataEdit;
    }

    private void OnDestroy()
    {
        GridManager.AssetManager.OnLoadEntity -= NewEntity;
    }

    void Start()
    {
        Preview3D.SetActive(false);
        PreviewUI.SetActive(false);
        FillAssetList();
        SwitchLayout(null);
    }

    private void FillAssetList()
    {
        foreach (Entity asset in GridManager.AssetManager.Assets)
        {
            NewEntity(asset);
        }
    }

    private void SwitchToGridNameEdit()
    {
        SetPlayerCameraEnabling(false);
        GridNameField.text = GridManager.Grid.Name;
        GridNameField.gameObject.SetActive(true);
        GridNameField.ActivateInputField();
        GridName.gameObject.SetActive(false);
    }

    private void FinishGridNameEdit(string newName)
    {
        SetPlayerCameraEnabling(true);
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
        if (
            PlayerCamera.gameObject.GetComponent<SimpleCameraController>().enabled == false ||
            GridManager.IsActive == false
        ) return;

        GridName.text = GridManager.Grid.Name + " (" + GridManager.Grid.Identifier + ")";

        float newSize = 0f;
        foreach (BoxCollider collider in PreviewContainer.GetComponentsInChildren<BoxCollider>())
        {
            Vector3 boundsSize = collider.size;
            float size = ((boundsSize.x + boundsSize.z) / 2.2f + boundsSize.y) / 1.4f;
            if (newSize < size) newSize = size;
        }

        PreviewCamera.gameObject.transform.localPosition = new Vector3(0f, 0.091f, -0.1f * newSize);
    }

    private bool SetPlayerCameraEnabling(bool isEnabled)
    {
        return PlayerCamera.gameObject.GetComponent<SimpleCameraController>().enabled = isEnabled;
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

    private void SwitchLayout(Entity entity)
    {
        SelectedEntity = entity;
        DataInput.gameObject.SetActive(entity != null);
        if (SelectList.SelectedItem != null && entity == null)
        {
            ShowPreview(SelectList.SelectedItem.Id);
        }
        else
        {
            HidePreview();
        }
    }

    private void SwitchDataEdit(bool isFocussed)
    {
        SetPlayerCameraEnabling(isFocussed == false);
    }
}
