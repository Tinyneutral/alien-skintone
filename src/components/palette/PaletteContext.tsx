import { createContext } from "react";
import type { Id } from "@/features/palettes/lib/paletteIds";

const PaletteContext = createContext<Id>(0);

export { PaletteContext };
