import type { ProfilerOnRenderCallback } from "react";

export const onRender: ProfilerOnRenderCallback = (
	id,
	phase,
	actualDuration,
	baseDuration,
	startTime,
	commitTime
) => {
	console.log({
		id,
		phase, // "mount" | "update" | "nested-update"
		actualDuration, // 今回の描画にかかった時間 (ms)
		baseDuration, // 最適化なしで再描画した場合の見積もり (ms)
		startTime,
		commitTime,
	});
};
export default onRender;
