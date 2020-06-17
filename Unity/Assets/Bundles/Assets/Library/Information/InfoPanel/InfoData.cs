using Grid.Asset;
using UnityEngine;
using UnityEngine.UI;

public class InfoData : MonoBehaviour
{
    public Entity Entity;
    public Text[] Texts;
    protected string Data;

    private void Start()
    {
        UpdateText();
    }

    private void Update()
    {
        if (Data != Entity.Data) UpdateText();
    }

    private void UpdateText()
    {
        Data = Entity.Data;
        foreach (Text text in Texts)
        {
            text.text = Data.Length >= 4 && Data.Substring(0, 4) == "DATA" ? "" : Data;
        }
    }
}
