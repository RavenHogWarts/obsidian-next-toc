import { CardConfig } from "@src/types/cards";
import { App } from "obsidian";
import { FC, useRef, useState } from "react";

interface CardFormProps {
	app: App;
	cardConfig: CardConfig;
	onSubmit: (cardConfig: CardConfig) => void;
}

export const CardForm: FC<CardFormProps> = ({ app, cardConfig, onSubmit }) => {
	const previewContainerRef = useRef<HTMLDivElement>(null);
	const [formData, setFormData] = useState<CardConfig>(cardConfig);

	const handleSubmit = () => {
		onSubmit(formData);
	};

	return <></>;
};
