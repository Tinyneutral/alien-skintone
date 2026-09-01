import type { SlotAction, SlotState } from "./wrapper.ts";
import type { Content, sContentType } from "./Wrapper.tsx";

import "./Tabs.css";

interface SlotTabsProps {
	init: Content;
	state: SlotState;
	dispatch: (action: SlotAction) => void;
}

export default function Tabs({ init, state, dispatch }: SlotTabsProps) {
	return (
		<div className="tabs">
			{state.contents.map((content: Content, index: number) => (
				<button
					key={index}
					className={index === state.activeIndex ? "tab active" : "tab"}
					onClick={() => dispatch({ type: "selected-slot", index })}>
					{index + 1}
					<Preview type={state.contentType} content={content} />
				</button>
			))}
			<button onClick={() => dispatch({ type: "added-slot", content: init })}>
				New Tab
			</button>
		</div>
	);
}

interface PreviewProps {
	type: sContentType;
	content: Content;
}

function Preview({ type, content }: PreviewProps) {
	switch (type) {
		case "palette":
			return (
				<div className="preview">
					{content.slice(0, 8).map((color, index) => (
						<div
							key={index}
							className="color"
							style={{ backgroundColor: color }}
						/>
					))}
				</div>
			);
		default:
			throw new Error("Invalid content type");
	}
}
