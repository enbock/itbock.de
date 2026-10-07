export function createElement(
    tagName: string,
    attributes?: Record<string, string>,
    children?: Array<Node | string>
): HTMLElement {
    const element: HTMLElement = document.createElement(tagName);

    if (attributes) {
        Object.keys(attributes).forEach((key: string): void => {
            element.setAttribute(key, attributes[key]);
        });
    }

    if (children) {
        element.append(...children);
    }

    return element;
}
