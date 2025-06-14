const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const orderInput = document.getElementById('order');

let currentOrder = parseInt(orderInput.value);

function d2xy(n, d) {
	let x = 0, y = 0;
	for (let s = 1, t = d; s < n; s *= 2) {
		const rx = 1 & (t >> 1);
		const ry = 1 & (t ^ rx);
		[x, y] = rot(s, x, y, rx, ry);
		x += s * rx;
		y += s * ry;
		t >>= 2;
	}
	return [x, y];
}

function rot(n, x, y, rx, ry) {
	if (ry === 0) {
		if (rx === 1) {
			x = n - 1 - x;
			y = n - 1 - y;
		}
		[x, y] = [y, x];
	}
	return [x, y];
}

function resizeCanvas() {
	const size = Math.min(window.innerWidth, window.innerHeight);
	canvas.width = size;
	canvas.height = size;
	drawHilbert(currentOrder);
}

function drawHilbert(order) {
	const size = Math.pow(2, order);
	const totalPoints = size * size;
	const scale = canvas.width / size;

	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.beginPath();

	for (let i = 0; i < totalPoints; i++) {
		const [x, y] = d2xy(size, i);
		const px = x * scale + scale / 2;
		const py = y * scale + scale / 2;

		const t = i / totalPoints;
		const hue = Math.floor(t * 360);
		ctx.strokeStyle = `hsl(${hue}, 100%, 50%)`;

		if (i > 0) {
			const [prevX, prevY] = d2xy(size, i - 1);
			const ppx = prevX * scale + scale / 2;
			const ppy = prevY * scale + scale / 2;
			ctx.beginPath();
			ctx.moveTo(ppx, ppy);
			ctx.lineTo(px, py);
			ctx.stroke();
		}
	}
}

orderInput.addEventListener('input', () => {
	currentOrder = parseInt(orderInput.value);
	drawHilbert(currentOrder);
});

window.addEventListener('resize', resizeCanvas);
resizeCanvas();
