import {
	applyCSSStyles,
	convertCamelCaseToKebab,
} from "../src/utils/convertCamelCaseToKebab";

describe("convertCamelCaseToKebab", () => {
	test("converts camelCase to kebab-case", () => {
		expect(convertCamelCaseToKebab("backgroundColor")).toBe(
			"background-color"
		);
		expect(convertCamelCaseToKebab("borderRadius")).toBe("border-radius");
		expect(convertCamelCaseToKebab("fontSize")).toBe("font-size");
		expect(convertCamelCaseToKebab("fontWeight")).toBe("font-weight");
		expect(convertCamelCaseToKebab("boxShadow")).toBe("box-shadow");
		expect(convertCamelCaseToKebab("maxWidth")).toBe("max-width");
		expect(convertCamelCaseToKebab("padding")).toBe("padding"); // 单词应该保持不变
		expect(convertCamelCaseToKebab("margin")).toBe("margin"); // 单词应该保持不变
	});

	test("handles edge cases", () => {
		expect(convertCamelCaseToKebab("")).toBe("");
		expect(convertCamelCaseToKebab("a")).toBe("a");
		expect(convertCamelCaseToKebab("A")).toBe("-a");
		expect(convertCamelCaseToKebab("aB")).toBe("a-b");
		expect(convertCamelCaseToKebab("aBc")).toBe("a-bc");
		expect(convertCamelCaseToKebab("ABC")).toBe("-a-b-c");
	});
});

describe("applyCSSStyles", () => {
	let mockElement: HTMLElement;

	beforeEach(() => {
		// 创建一个模拟的 HTMLElement
		mockElement = {
			style: {
				setProperty: jest.fn(),
			},
		} as any;
	});

	test("applies CSS styles with camelCase conversion", () => {
		const styles = {
			backgroundColor: "red",
			fontSize: "16px",
			padding: "10px",
		};

		applyCSSStyles(mockElement, styles);

		expect(mockElement.style.setProperty).toHaveBeenCalledWith(
			"background-color",
			"red"
		);
		expect(mockElement.style.setProperty).toHaveBeenCalledWith(
			"font-size",
			"16px"
		);
		expect(mockElement.style.setProperty).toHaveBeenCalledWith(
			"padding",
			"10px"
		);
		expect(mockElement.style.setProperty).toHaveBeenCalledTimes(3);
	});

	test("skips null and undefined values", () => {
		const styles = {
			backgroundColor: "red",
			fontSize: null as any,
			padding: undefined as any,
			margin: "5px",
		};

		applyCSSStyles(mockElement, styles);

		expect(mockElement.style.setProperty).toHaveBeenCalledWith(
			"background-color",
			"red"
		);
		expect(mockElement.style.setProperty).toHaveBeenCalledWith(
			"margin",
			"5px"
		);
		expect(mockElement.style.setProperty).toHaveBeenCalledTimes(2);
	});
});
