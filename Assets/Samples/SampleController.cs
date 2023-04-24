using System.Collections;
using System.Collections.Generic;
using UnityEngine;

using UnityEngine.Tilemaps;
using UnityEngine.UI;
using GrippedWebGLTemplate;

public class SampleController : MonoBehaviour
{
    [SerializeField]
    private Camera mainCamera = null;

    [SerializeField]
    private RawImage image = null;

    [SerializeField]
    private Tilemap tilemap = null;

    [SerializeField]
    private Tile tile = null;

    [Header("AspectRatio")]
    [SerializeField] private Toggle keepAspectRatioToggle = null;
    [SerializeField] private Dropdown aspectRatioDropdown = null;

    [Header("Zoom")]
    [SerializeField] private Dropdown zoomDropdown = null;

    [Space]
    [SerializeField] private Button submitButton = null;
    [SerializeField] private Text fpsText = null;

    private int frameCount;
    private float lastTime;
    private int lastHeight;

    private RenderTexture renderTexture;
    private RectTransform imageTransform;

    private const int tileRange = 63;

    private void Start()
    {
        //NewRenderTexture(new Vector2Int(1920, 1080), 1);

        tilemap.BoxFill(Vector3Int.one * -tileRange, tile, -tileRange, -tileRange, tileRange, tileRange);
        tilemap.BoxFill(Vector3Int.one * tileRange, tile, -tileRange, -tileRange, tileRange, tileRange);

        submitButton.onClick.AddListener(() =>
        {
            var keepAspectRatio = keepAspectRatioToggle.isOn;
            if (keepAspectRatio)
            {
                var option = aspectRatioDropdown.options[aspectRatioDropdown.value];
                var sizeTexts = option.text.Split(':');
                var width = float.Parse(sizeTexts[0]);
                var height = float.Parse(sizeTexts[1]);
                GrippedWebGL.LockAspectRatio(width / height);
                Debug.Log($"Lock aspect ratio {width} x {height}");
            }
            else
            {
                GrippedWebGL.FreeAspectRatio();
                Debug.Log($"Free aspect ratio");
            }
        });

        frameCount = 0;
        lastTime = Time.time;
    }

    private void Update()
    {
        frameCount++;
        var now = Time.time;
        if (now >= lastTime + 1f)
        {
            fpsText.text = frameCount.ToString();
            frameCount = 0;
            lastTime = now;
        }

        var screenSize = new Vector2Int(Screen.width, Screen.height);
        if (screenSize.y != lastHeight)
        {
            NewRenderTexture(screenSize);
            lastHeight = screenSize.y;
        }
    }

    private void NewRenderTexture(Vector2Int screenSize, int zoom = -1)
    {
        if (zoom == -1) { zoom = int.Parse(zoomDropdown.options[zoomDropdown.value].text); }

        if (image != null && image.enabled)
        {
            if (renderTexture != null) { RenderTexture.ReleaseTemporary(renderTexture); }
            renderTexture = RenderTexture.GetTemporary(screenSize.x, screenSize.y);
            renderTexture.autoGenerateMips = false;
            renderTexture.filterMode = FilterMode.Point;
            mainCamera.targetTexture = renderTexture;
            image.texture = renderTexture;
            imageTransform = image.rectTransform;
            imageTransform.sizeDelta = screenSize;

            imageTransform.localScale = new Vector3(zoom, zoom, 1f);
            mainCamera.orthographicSize = screenSize.y / tile.sprite.pixelsPerUnit * .5f;
        }
        else
        {
            mainCamera.orthographicSize = screenSize.y / tile.sprite.pixelsPerUnit * .5f / zoom;
        }
    }
}
