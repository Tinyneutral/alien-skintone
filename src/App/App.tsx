import "./App.css";
import { WrapperTabs } from "../slots/Wrapper.tsx";

function App() {
	return (
		<>
			<h1>Alien Skintone</h1>
			<WrapperTabs contentType="palette" />
		</>
	);
}

export default App;
