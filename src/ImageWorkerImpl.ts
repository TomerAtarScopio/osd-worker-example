import jpeg from "jpeg-js";

onmessage = async function (e) {
	const { url, size, id } = e.data;
	const offscreen = new OffscreenCanvas(size.width, size.height);

	const ctx = offscreen.getContext("2d")!;

	const data = await fetch(url).then(data => data.arrayBuffer());

	const imagedata = new ImageData(new Uint8ClampedArray(jpeg.decode(data, { useTArray: true }).data), size.width, size.height);

	ctx.putImageData(imagedata, 0, 0);

	// we can probably use the array buffer directly (not even using offscreen canvas) but i was lazy and copied this from the virtual tile source
	const imageBitmap = offscreen.transferToImageBitmap();

	postMessage({ id, imageBitmap }, [imageBitmap]);
};
