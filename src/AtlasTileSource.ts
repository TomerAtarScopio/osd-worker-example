
export default {
	height: 512 * 256,
	width: 512 * 256,
	tileSize: 256,
	minLevel: 8,
	getTileUrl: function (level, x, y) {
		return (
			"/atlas/" +
			(level - 8) +
			"-r" +
			y +
			"-c" +
			x +
			".jpg?ts=" +
			Date.now()
		);
	},
};