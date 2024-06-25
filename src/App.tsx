import { useEffect, useRef, useState } from 'react'
import './App.css'
import OpenSeadragon from 'openseadragon'
import WorkerVirtualTileSource from './WorkerVirtualTileSource'
import WorkerAtlasTileSource from './WorkerAtlasTileSource'
import AtlasTileSource from './AtlasTileSource'
// @ts-ignore
import Stats from 'stats-js'
import VirtualTileSource from './VirtualTileSource'

const tileSources = [
  { name: 'atlas', source: AtlasTileSource },
  { name: 'mandelbrot', source: VirtualTileSource },
  { name: 'worker atlas', source: WorkerAtlasTileSource },
  { name: 'worker mandelbrot', source: WorkerVirtualTileSource },
]

function App() {
  const ref = useRef<HTMLDivElement>(null)
  const [tileSource, setTileSource] = useState<any>(tileSources[0].source);

  useEffect(() => {

    const osd = OpenSeadragon({
      element: ref.current!,
      prefixUrl: "/openseadragon/images/",
      showNavigator: true,
      blendTime: 0,
      wrapHorizontal: true,
      wrapVertical: true,
      tileSources: tileSource,
      showNavigationControl: false,
    })


    // move the viewport around to stress image loading
    const interval = setInterval(() => {
      const qA = 5000;
      const qR = 50000;
      const qZ = 5000;

      const pA = (performance.now() % qA) / qA;
      const pR = (performance.now() % qR) / qR;
      const pZ = (performance.now() % qZ) / qZ;


      const worldBounds = osd.world.getItemAt(0).getBounds();
      const minZoom = osd.viewport.getMinZoom();
      const maxZoom = osd.viewport.getMaxZoom();

      const x = (Math.cos(pA * Math.PI * 2) * worldBounds.width / 2) * (1 - pR) + worldBounds.x + worldBounds.width / 2;
      const y = (Math.sin(pA * Math.PI * 2) * worldBounds.height / 2) * (1 - pR) + worldBounds.y + worldBounds.height / 2;
      // const zoom = (1 - pZ) * (maxZoom - minZoom) + minZoom;
      const zoom = 4 * (1 - pZ) + 0.1;

      console.log({ zoom, maxZoom, minZoom })

      osd.viewport.panTo(new OpenSeadragon.Point(x, y));
      osd.viewport.zoomTo(zoom, undefined);

    }, 10)

    return () => {
      clearInterval(interval);
      osd.destroy();
    }

  }, [tileSource])

  // measure fps
  useEffect(() => {
    const stats = new Stats();
    document.body.appendChild(stats.dom);

    stats.begin();

    let mounted = true;

    function loop() {
      if (!mounted) return;

      stats.update();
      requestAnimationFrame(loop);
    }

    requestAnimationFrame(loop);

    return () => {
      document.body.removeChild(stats.dom);
      mounted = false;
    }
  }, [])

  return (
    <>
      <div id="stats"></div>
      <div id="osd" ref={ref} style={{ width: '500px', height: '500px' }} />

      {/* change tile source controls */}
      <div style={{ display: 'flex', gap: '20px', padding: '20px' }}>
        {tileSources.map(({ name, source }) => {
          const isSelected = tileSource === source;

          return <button style={isSelected ? { border: '2px solid blue' } : undefined} key={name} onClick={() => setTileSource(source)}>{name}</button>
        })}
      </div>
    </>
  )
}

export default App
