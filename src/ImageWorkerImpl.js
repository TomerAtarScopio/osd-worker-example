onmessage = function (e) {
  const { bounds, size, id } = e.data;
  const offscreen = new OffscreenCanvas(size.width, size.height);
  //   const canvas = new Canvas();
  const ctx = offscreen.getContext("2d");

  const maxIterations = 100;

  function iterateMandelbrot(refPoint) {
    var squareAndAddPoint = function (z, point) {
      let a = Math.pow(z.a, 2) - Math.pow(z.b, 2) + point.a;
      let b = 2 * z.a * z.b + point.b;
      z.a = a;
      z.b = b;
    };

    var length = function (z) {
      return Math.sqrt(Math.pow(z.a, 2) + Math.pow(z.b, 2));
    };

    let z = { a: 0, b: 0 };
    for (let i = 0; i < maxIterations; i++) {
      squareAndAddPoint(z, refPoint);
      if (length(z) > 2) return i / maxIterations;
    }
    return 1.0;
  }

  var imagedata = ctx.createImageData(size.width, size.height);
  for (let x = 0; x < size.width; x++) {
    for (let y = 0; y < size.height; y++) {
      let index = (y * size.width + x) * 4;
      imagedata.data[index] = Math.floor(
        iterateMandelbrot({
          a: bounds.x + bounds.width * ((x + 1) / size.width),
          b: bounds.y + bounds.height * ((y + 1) / size.height),
        }) * 255
      );

      imagedata.data[index + 3] = 255;
    }
  }
  ctx.putImageData(imagedata, 0, 0);
  // note: we output context2D!
  //   context.finish(ctx);

  const imageBitmap = offscreen.transferToImageBitmap();

  postMessage({ id, imageBitmap }, [imageBitmap]);
};
