using System;
using System.Collections.Generic;

namespace Grid
{
    [Serializable]
    public class Grid
    {
        public string Name = "No name";
        public List<GridEntity> Assets = new List<GridEntity>();
    }
}