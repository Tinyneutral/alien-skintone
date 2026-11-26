import "./DemoInfo.css";

function DemoInfo() {
	return (
		<div className="demo-info">
			<div className="en">
				<p>
					This is a demo program. This is a part of Alien-skintone, a color
					comparer for humanization. This program aids comparing non-human skin
					with human skintones, by showing a closeness-in-filter (currently
					grayscale) ranking in the skintone palette. Above is the palette
					portion.
					<br />
					P.S.: The filter will be customizable in the final version.
				</p>
			</div>
			<div className="jp">
				<p>
					本作は、擬人化用の色比較ツール「Alien-skintone」の一部のデモです。
				</p>
				<p>
					このツールは非人間の肌と人間の肌パレットにフィルターをかけ、近い順で順位をつけます。本作は、そのうち人間の肌パレットに当たります。
				</p>
				<p>
					本作のフィルターはグレースケールのみですが、完成版ではカスタマイズ可能にする予定です。
				</p>
			</div>
		</div>
	);
}

export default DemoInfo;
