using System;
using System.Collections.Generic;

namespace Grid
{
    [Serializable]
    public class Grid
    {
        [ReadOnly] public string Identifier = Guid.NewGuid().ToString();
        public string Name = "No name";
        [ReadOnly] public List<GridEntity> Assets = new List<GridEntity>();
    }
}