import useSettings from "@src/hooks/useSettings";
import calculateActualDepth from "@src/utils/calculateActualDepth";
import { HeadingCache, MarkdownView } from "obsidian";
import { FC, useEffect, useRef } from "react";
import { TocItem } from "../toc-item/TocItem";
import "./TocNavigator.css";

interface TocNavigatorProps {
	currentView: MarkdownView;
	headings: HeadingCache[];
	activeHeadingIndex: number;
}

export const TocNavigator: FC<TocNavigatorProps> = ({
	currentView,
	headings,
	activeHeadingIndex,
}) => {
	const settings = useSettings();
	const NTocContainerRef = useRef<HTMLDivElement>(null);
	const NTocGroupRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (NTocContainerRef.current) {
			const container = NTocContainerRef.current;
			container.classList.add(`NToc__container-${settings.toc.position}`);
			container.style[settings.toc.position] = `${settings.toc.offset}px`;
		}
	}, [settings.toc.position, settings.toc.offset]);

	return (
		<div ref={NTocContainerRef} className="NToc__container">
			NToc Component
			<div ref={NTocGroupRef}>
				<div className="NToc__group-resize"></div>
				<div className="NToc__group-content">
					<div className="NToc__toc-items">
						{headings.map((heading, index) => {
							const actualDepth = calculateActualDepth(
								index,
								headings
							);

							return (
								<TocItem
									currentView={currentView}
									heading={heading}
									headingIndex={index}
									headingActualDepth={actualDepth}
									headingNumber={""}
									headingActive={index === activeHeadingIndex}
									onHeadingClick={() => {}}
								/>
							);
						})}
					</div>
				</div>
			</div>
		</div>
	);
};
