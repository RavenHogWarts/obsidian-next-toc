import { Notice } from "obsidian";
import { FC, useCallback } from "react";
import "./InlineCodeBlock.css";

interface InlineCodeBlockProps {
	code: string;
	label?: string;
}

export const InlineCodeBlock: FC<InlineCodeBlockProps> = ({ code, label }) => {
	const handleCopy = useCallback(async () => {
		try {
			await navigator.clipboard.writeText(code);
			new Notice(`Copied: ${code}`);
		} catch (error) {
			console.error("Failed to copy code:", error);
			new Notice("Failed to copy code");
		}
	}, [code]);

	return (
		<code
			className="ntoc-inline-code-block"
			onClick={() => {
				handleCopy();
			}}
		>
			{label || code}
		</code>
	);
};
