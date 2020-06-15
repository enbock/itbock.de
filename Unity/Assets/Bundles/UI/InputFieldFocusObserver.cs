using UnityEngine;
using UnityEngine.UI;

namespace Bundles.UI
{
    public class InputFieldFocusObserver : MonoBehaviour
    {
        public delegate void FocusAction(bool isFocused);

        public event FocusAction OnFocusChange;
        public InputField InputField;
        [ReadOnly] public bool lastFocus;

        private void OnEnable()
        {
            lastFocus = InputField.isFocused;
        }

        private void Update()
        {
            if (lastFocus != InputField.isFocused)
            {
                lastFocus = InputField.isFocused;
                OnFocusChange?.Invoke(lastFocus);
            }
        }
    }
}
