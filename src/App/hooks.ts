import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "./store.js";

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
