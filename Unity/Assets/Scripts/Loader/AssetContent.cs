using Grid.Asset;
using UnityEngine;

namespace Loader
{
    public class AssetContent : MonoBehaviour
    {
        public LoadManager LoadManager;
        public SharedContent SharedContent;
        public GameObject Container;

        public string[] SubAssests = new string[0];

        virtual public void Start()
        {
            if (Container == null) Container = gameObject;
            LoadSubAssets();
        }

        virtual public void Update()
        {
        }

        private void LoadSubAssets()
        {
            foreach (string assetName in SubAssests)
            {
                LoadManager.LoadAsset(assetName, InstantiateModule);
            }
        }

        virtual protected GameObject InstantiateModule(GameObject asset)
        {
            GameObject instance = Instantiate(asset, Container.gameObject.transform);
            AssetHelper.SetLayerRecursive(instance, Container.layer);

            return instance;
        }
    }
}
