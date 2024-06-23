import { useEffect, useRef } from 'react'
import './App.css'
import OpenSeadragon from 'openseadragon'
import WorkerTileSource from './WorkerTileSource'

function App() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {

    const osd = OpenSeadragon({
      element: ref.current!,
      prefixUrl: "/openseadragon/images/",
      showNavigator: false,
      blendTime: 0,
      wrapHorizontal: true,
      tileSources: WorkerTileSource,
      showNavigationControl: false,
    })

  }, [])

  return (
    <>
      <div id="osd" ref={ref} style={{ width: '100vw', height: '100vh' }} />
    </>
  )
}

export default App
