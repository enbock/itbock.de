using System;

namespace Grid.Asset
{
    [Serializable]
    public class CatalogEntity
    {
        public string Name = "";
        public string Library = "";

        public static bool operator ==(CatalogEntity left, CatalogEntity right)
        {
            return left?.Name == right?.Name && left?.Library == right?.Library;
        }

        public static bool operator !=(CatalogEntity left, CatalogEntity right)
        {
            return left?.Name != right?.Name || left?.Library != right?.Library;
        }
    }
}
