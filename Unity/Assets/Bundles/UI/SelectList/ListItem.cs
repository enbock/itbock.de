using UnityEngine;
using UnityEngine.UI;

namespace Bundles.UI.SelectList
{
    public class ListItem : MonoBehaviour
    {
        public int Id;
        public Text Label;

        private string LabelText = "<<Label>>";

        public string Value
        {
            get { return LabelText; }
            set
            {
                LabelText = value;
                Label.text = LabelText;
            }
        }
    }
}
