/**
 * Converts camelCase CSS property names to kebab-case format for use with setProperty()
 * @param camelCaseKey - The camelCase CSS property name (e.g., 'backgroundColor')
 * @returns The kebab-case CSS property name (e.g., 'background-color')
 */
export function convertCamelCaseToKebab(camelCaseKey: string): string {
	return camelCaseKey.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
}

/**
 * Applies CSS styles from a CSSStyleDeclaration-like object to a DOM element
 * Automatically converts camelCase property names to kebab-case for proper CSS application
 * @param element - The DOM element to apply styles to
 * @param styles - Object containing CSS styles (can use camelCase property names)
 */
export function applyCSSStyles(
	element: HTMLElement,
	styles: Partial<CSSStyleDeclaration>
): void {
	Object.entries(styles).forEach(([key, value]) => {
		if (value != null) {
			const kebabKey = convertCamelCaseToKebab(key);
			element.style.setProperty(kebabKey, String(value));
		}
	});
}
