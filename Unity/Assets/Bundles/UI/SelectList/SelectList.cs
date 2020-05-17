using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

namespace Bundles.UI.SelectList
{
    public class SelectList : MonoBehaviour
    {
        [Serializable]
        public struct IDValueData
        {
            public int Id;
            public string Value;
        }

        public GameObject ContentPanel;
        public GameObject ListItemPrefab;
        public float ListItemHeight;
        public IDValueData[] UIInitList;
        [ReadOnly] public List<GameObject> List = new List<GameObject>();
        [ReadOnly] public ListItem SelectedItem = null;

        void Awake()
        {
            foreach (IDValueData item in UIInitList)
            {
                AddItem(item.Id, item.Value);
            }
            Update();
        }

        void Update()
        {
            float offset = 0f;
            RectTransform rectTransform;
            foreach (GameObject listView in List)
            {
                rectTransform = listView.GetComponent<RectTransform>();
                rectTransform.localPosition = new Vector3(0, -offset, 0);

                offset += ListItemHeight;
            }

            rectTransform = ContentPanel.GetComponent<RectTransform>();
            rectTransform.sizeDelta = new Vector2(1f, offset);
        }

        public void AddItem(int id, string value)
        {
            GameObject listView = Instantiate(ListItemPrefab, gameObject.transform);
            ListItem listItem = listView.GetComponent<ListItem>();
            Toggle toggle = listView.GetComponent<Toggle>();

            listItem.Id = id;
            listItem.Value = value;
            toggle.onValueChanged.AddListener((bool selected) => { SelectItem(listItem, selected); });

            List.Add(listView);
        }

        private void SelectItem(ListItem selectedListItem, bool selected)
        {
            if (selected == false)
            {
                if (SelectedItem == selectedListItem) SelectedItem = null;
                return;
            }
            SelectedItem = selectedListItem;
            foreach (GameObject listView in List)
            {
                ListItem listItem = listView.GetComponent<ListItem>();
                Toggle toggle = listView.GetComponent<Toggle>();

                if(listItem != selectedListItem) toggle.isOn = false;
            }
        }
    }
}
