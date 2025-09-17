// 将camelCase转换为kebab-case
export function camelToKebab(camelCase: string): string {
	return camelCase.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
}

// 将kebab-case转换为camelCase
export function kebabToCamel(kebabCase: string): string {
	return kebabCase.replace(/-([a-z])/g, (match, letter) =>
		letter.toUpperCase()
	);
}
