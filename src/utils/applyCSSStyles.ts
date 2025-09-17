import { camelToKebab } from "./caseConverter";

export default function (
	element: HTMLElement,
	styles: Partial<CSSStyleDeclaration>
): void {
	Object.entries(styles).forEach(([key, value]) => {
		if (value != null) {
			const kebabKey = camelToKebab(key);
			element.style.setProperty(kebabKey, String(value));
		}
	});
}
