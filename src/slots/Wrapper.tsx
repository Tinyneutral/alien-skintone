import { useReducer } from "react";
import {
	reducer,
	type SlotState,
	type SlotAction,
	type ContentAction,
} from "./wrapper.ts";

import Tabs from "./Tabs.tsx";
import { initialPalette, type PaletteData } from "../palette.ts";
import Palette from "../Palette.tsx";

type sSlotType = "tabs";
interface SlotsComponentProps {
	type: sSlotType;
	contentType: sContentType;
	state: SlotState;
	dispatch: (action: SlotAction) => void;
}

function SlotsComponent({
	type,
	contentType,
	state,
	dispatch,
}: SlotsComponentProps) {
	switch (type) {
		case "tabs":
			return (
				<Tabs
					init={initialValueOf(contentType)}
					state={state}
					dispatch={dispatch}
				/>
			);
		default:
			throw new Error("Invalid slot type");
	}
}

type sContentType = "palette";
type Content = PaletteData;
interface ContentComponentProps {
	type: sContentType;
	content: Content;
	setContent: (content: Content) => void;
}

function initialValueOf(type: sContentType): Content {
	switch (type) {
		case "palette":
			return initialPalette;
		default:
			throw new Error("Invalid content type");
	}
}
function ContentComponent({
	type,
	content,
	setContent,
}: ContentComponentProps) {
	switch (type) {
		case "palette":
			return <Palette colors={content} setColors={setContent} />;
		default:
			throw new Error("Invalid content type");
	}
}

interface WrapperSlotsProps {
	slotType: sSlotType;
	contentType: sContentType;
}

function WrapperSlots({ slotType, contentType }: WrapperSlotsProps) {
	const [state, dispatch] = useReducer(reducer, {
		contents: [initialValueOf(contentType)],
		contentType: contentType,
		activeIndex: 0,
	});

	const content = state.contents[state.activeIndex];
	const setContent = (nextContent: Content) => {
		dispatch({
			type: "changed-content",
			content: nextContent,
		} as ContentAction);
	};
	const slotDispatch = (action: SlotAction) => dispatch(action);

	return (
		<>
			<SlotsComponent
				type={slotType}
				contentType={contentType}
				state={state}
				dispatch={slotDispatch}
			/>
			<ContentComponent
				type={contentType}
				content={content}
				setContent={setContent}
			/>
		</>
	);
}

function WrapperTabs({ contentType }: { contentType: sContentType }) {
	return <WrapperSlots slotType="tabs" contentType={contentType} />;
}

export { WrapperTabs, WrapperSlots };
export type { Content, sContentType };
export default WrapperSlots;
