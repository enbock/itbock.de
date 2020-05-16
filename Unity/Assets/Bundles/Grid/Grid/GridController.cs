using System.Collections;
using System.Collections.Generic;
using Grid;
using UnityEngine;
using UnityEngine.UI;

public class GridController : MonoBehaviour
{
    public Manager GridManager;
    public Button LoadLibrariesButton;
    
    void Start()
    {
        LoadLibrariesButton.onClick.AddListener(LoadLibraries);
    }

    private void LoadLibraries()
    {
        GridManager.AssetManager.LoadAllLibraries();
    }

    void Update()
    {
        
    }
}
