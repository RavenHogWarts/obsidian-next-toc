import { FC } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
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
			<CircularProgressbar
				value={percentage}
				text={displayText}
				styles={buildStyles({
					// 路径颜色 (进度条)
					pathColor: "var(--interactive-accent)",
					// 文本颜色
					textColor: "var(--text-normal)",
					// 轨道颜色 (背景圆环)
					trailColor: "var(--background-modifier-border)",
					// 背景色
					backgroundColor: "transparent",
					// 文本大小 - 根据圆环大小动态调整
					textSize: `1.5rem`,
					// 路径线帽样式
					strokeLinecap: "round",
				})}
			/>
		</div>
	);
};
