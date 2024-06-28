import jpeg from "jpeg-js";

onmessage = async function (e) {
	const { url, id } = e.data;

	const data = await fetch(url).then(data => data.arrayBuffer());

	const { width, height, data: decodedJpegBuffer } = jpeg.decode(data, { useTArray: true })

	const offscreen = new OffscreenCanvas(width, height);
	const ctx = offscreen.getContext("2d")!;

	const imagedata = new ImageData(new Uint8ClampedArray(decodedJpegBuffer), width, height);

	ctx.putImageData(imagedata, 0, 0);

	// we can probably use the array buffer directly (not even using offscreen canvas) but i was lazy and copied this from the virtual tile source
	const imageBitmap = offscreen.transferToImageBitmap();

	// @ts-ignore
	postMessage({ id, imageBitmap }, [imageBitmap]);
};
