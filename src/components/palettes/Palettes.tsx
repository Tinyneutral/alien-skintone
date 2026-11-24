import { useState } from "react";
import { useAppSelector, useAppDispatch } from "@/app/hooks";
import { addPalette, deletePalette } from "@/features/palettes/palettes";
import { deleteAllColors, selectPaletteEntries } from "@/features/palettes/palette";

import Tabs from "@/components/tabs";
import Palette from "./palette/index";
import PalettePreview from "@/components/palettes/Preview.tsx";

function Palettes() {
	const dispatch = useAppDispatch();
	const paletteEntries = useAppSelector(selectPaletteEntries);
	const paletteIds = useAppSelector((state) => state.palettes.paletteIds);
	const colors = useAppSelector((state) => state.palettes.colors);

	const [activeId, setActiveId] = useState(0);
	const nextIdPeek = useAppSelector((state) => state.palettes._nextId("peek"));

	const [rows, setRowAmount] = useState(4);
	const [groupCols, setGroupColAmount] = useState(9);

	return (
		<section className="palettes">
			<h2>Palettes</h2>
			<Tabs.Root activeIdOverride={{ activeId, setActiveId }}>
				<Tabs.List>
					{Object.entries(paletteIds).map(([sId, entries]) => {
						const id = parseInt(sId);
						return (
							<Tabs.Tab
								key={id}
								id={id}
								label={entries.length.toString()}
								onClose={() => {
                                    const ids = Object.keys(paletteIds).map(Number);
                                    if (ids.length === 1) {
                                        dispatch(deleteAllColors({ paletteId: id }));
                                        return;
                                    }
									dispatch(deletePalette(id));
                                    if (id === activeId) {
                                        setActiveId(ids.filter(id => id !== activeId)[0]);
                                    }
								}}>
								<PalettePreview
									colors6={paletteIds[id]
										.slice(0, 6)
										.map((entry) => colors[entry])}
								/>
							</Tabs.Tab>
						);
					})}
					<Tabs.NewTab
						onNewTab={() => {
							dispatch(addPalette());
							setActiveId(nextIdPeek);
						}}
						text="New Palette">
						<PalettePreview colors6={[]} />
					</Tabs.NewTab>
				</Tabs.List>
				{Object.entries(paletteIds).map(([sId]) => {
					const id = parseInt(sId);
					return (
						<Tabs.Panel key={id} id={id}>
							<Palette.Root id={id}>
								<Palette.TableConfig
									rowState={{ rows, setRowAmount }}
									groupColsState={{ groupCols, setGroupColAmount }}
								/>
								<Palette.ItemTable
									entries={paletteEntries[id]}
									rows={rows}
									groupCols={groupCols}
								/>
							</Palette.Root>
						</Tabs.Panel>
					);
				})}
			</Tabs.Root>
		</section>
	);
}

export default Palettes;
