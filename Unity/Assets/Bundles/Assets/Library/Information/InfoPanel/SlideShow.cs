using System.Collections;
using Grid.Asset;
using UnityEngine;
using UnityEngine.Networking;
using UnityEngine.UI;

public class SlideShow : MonoBehaviour
{
    public Entity Entity;
    public GameObject ImageSlide01;
    public GameObject ImageSlide02;
    public Sprite[] Slides;
    public Image[] FrontImages;
    public Image[] BackImages;

    public float DisplayTime = 10f;
    public float Zoom = 100f;
    public float ZoomFPS = 33f;
    public float BlendTime = 1f;

    private string Data;
    private int CurrentImage = -1;
    private bool FirstImageShown = false;
    private float NextSwitchTime = -1f;
    private float LastZoomFrame = -1f;

    private void Start()
    {
        UpdateData();
    }

    private void UpdateData()
    {
        Data = Entity.Data;

        if (Data.Length < 4 || Data.Substring(0, 4) != "DATA")
        {
            Slides = new Sprite[0];
            ImageSlide01.SetActive(false);
            ImageSlide02.SetActive(false);

            return;
        }

        ImageSlide01.SetActive(true);
        ImageSlide02.SetActive(true);

        string[] slideNames = Data.Split('\n');
        int index;
        Slides = new Sprite[slideNames.Length - 1];
        for (index = 0; index < Slides.Length; index++)
        {
            string slideName = slideNames[index + 1];
            StartCoroutine(LoadSlideImage(slideName, index));
        }
    }

    void Update()
    {
        if (Data != Entity.Data) UpdateData();
        if (Slides.Length == 0) return;

        if (NextSwitchTime < 0f || NextSwitchTime < Time.realtimeSinceStartup)
        {
            NextSwitchTime = Time.realtimeSinceStartup + DisplayTime;
            FirstImageShown = FirstImageShown == false;
            CurrentImage++;
            if (CurrentImage >= Slides.Length) CurrentImage = 0;
            int nextImage = CurrentImage + 1;
            if (nextImage >= Slides.Length) nextImage = 0;
            FrontImages[0].sprite = Slides[CurrentImage];
            FrontImages[1].sprite = Slides[nextImage];
            BackImages[0].sprite = Slides[CurrentImage];
            BackImages[1].sprite = Slides[nextImage];

            FrontImages[0].color = new Color(1f, 1f, 1f, 0f);
            FrontImages[1].color = new Color(1f, 1f, 1f, 1f);
            BackImages[0].color = new Color(1f, 1f, 1f, 0f);
            BackImages[1].color = new Color(1f, 1f, 1f, 1f);

            FrontImages[1].rectTransform.offsetMin = new Vector2(-Zoom, -Zoom);
            FrontImages[1].rectTransform.offsetMax = new Vector2(Zoom, Zoom);
            BackImages[1].rectTransform.offsetMin = new Vector2(-Zoom, -Zoom);
            BackImages[1].rectTransform.offsetMax = new Vector2(Zoom, Zoom);
        }

        float deltaTime = Time.realtimeSinceStartup + DisplayTime - NextSwitchTime;
        if (deltaTime <= BlendTime)
        {
            float offset = 1f / BlendTime * deltaTime;
            if (offset > 0.95f) offset = 1f;
            FrontImages[0].color = new Color(1f, 1f, 1f, offset);
            FrontImages[1].color = new Color(1f, 1f, 1f, 1f - offset);
            BackImages[0].color = new Color(1f, 1f, 1f, offset);
            BackImages[1].color = new Color(1f, 1f, 1f, 1f - offset);
        }

        float deltaZoomFPS = 1f / ZoomFPS;
        if (LastZoomFrame + deltaZoomFPS < Time.realtimeSinceStartup)
        {
            LastZoomFrame = Time.realtimeSinceStartup;
            float deltaZoom = Zoom / DisplayTime * deltaTime;
            FrontImages[0].rectTransform.offsetMin = new Vector2(-deltaZoom, -deltaZoom);
            FrontImages[0].rectTransform.offsetMax = new Vector2(deltaZoom, deltaZoom);
            BackImages[0].rectTransform.offsetMin = new Vector2(-deltaZoom, -deltaZoom);
            BackImages[0].rectTransform.offsetMax = new Vector2(deltaZoom, deltaZoom);
        }
    }

    IEnumerator LoadSlideImage(string imageUri, int index)
    {
        string url = Entity.SharedContent.ProjectSettings.HostUri + "/" + imageUri;
        using (UnityWebRequest request = UnityWebRequestTexture.GetTexture(url))
        {
            yield return request.SendWebRequest();

            if (request.isNetworkError || request.isHttpError)
            {
                Debug.LogError("Error for " + url + " " + request.error);
            }
            else
            {
                Texture2D texture = ((DownloadHandlerTexture) request.downloadHandler).texture;
                Slides[index] = Sprite.Create(
                    texture,
                    new Rect(0, 0, texture.width, texture.height),
                    new Vector2(0.5f, 0.5f)
                );

                CurrentImage = -1;
                FirstImageShown = false;
                NextSwitchTime = -1f;
            }
        }
    }
}
