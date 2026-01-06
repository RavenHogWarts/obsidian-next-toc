import { FC } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "./ProgressCircle.css";

interface ProgressCircleProps {
	percentage: number;
	showText?: boolean;
	customText?: string;
	showPercentageSymbol?: boolean;
}

export const ProgressCircle: FC<ProgressCircleProps> = ({
	percentage,
	showText = true,
	customText,
	showPercentageSymbol = true,
}) => {
	const roundedPercentage = Math.round(percentage);

	const getDisplayText = () => {
		if (customText) return customText;
		if (!showText) return "";
		return showPercentageSymbol
			? `${roundedPercentage}%`
			: `${roundedPercentage}`;
	};

	const displayText = getDisplayText();

	return (
		<div className="NToc__progress-circle-wrapper">
			<CircularProgressbar value={percentage} text={displayText} />
		</div>
	);
};
