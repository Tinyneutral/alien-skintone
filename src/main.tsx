import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./app/App.js";
import { store } from "./app/store.js";
import { Provider } from "react-redux";

import "./index.css";

createRoot(document.getElementById("root") as HTMLElement).render(
	<StrictMode>
		<Provider store={store}>
			<App />
		</Provider>
	</StrictMode>
);
