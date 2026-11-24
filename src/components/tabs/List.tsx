import { type ReactNode } from "react";

function List({ children }: { children: ReactNode }) {
	return <div className="tabs">{children}</div>;
}

export { List };
