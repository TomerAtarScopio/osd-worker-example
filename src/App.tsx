import { useEffect, useRef, useState } from 'react';
import './App.css';
import OpenSeadragon from 'openseadragon';
import WorkerVirtualTileSource from './WorkerVirtualTileSource';
// @ts-ignore
import Stats from 'stats-js';
import VirtualTileSource from './VirtualTileSource';
import workerPatch from './workerPatch';

const tileSources = [
	{
		name: 'dzi',
		source: 'https://openseadragon.github.io/example-images/duomo/duomo.dzi',
	},
	{
		name: 'worker dzi',
		source: 'https://openseadragon.github.io/example-images/duomo/duomo.dzi',
		worker: true,
	},
	{ name: 'mandelbrot', source: VirtualTileSource },
	{ name: 'worker mandelbrot', source: WorkerVirtualTileSource },
];

function App() {
	const ref = useRef<HTMLDivElement>(null);
	const [selectedTileSource, setSelectedTileSource] = useState<any>(
		tileSources[0]
	);

	useEffect(() => {
		const osd = OpenSeadragon({
			element: ref.current!,
			prefixUrl: '/openseadragon/images/',
			showNavigator: true,
			blendTime: 0,
			wrapHorizontal: true,
			wrapVertical: true,
			tileSources: selectedTileSource.source,
			showNavigationControl: false,
		});

		if (selectedTileSource.worker) {
			osd.world.addHandler('add-item', (e) => {
				workerPatch(e.item.source);
			});
		}

		return () => {
			osd.destroy();
		};
	}, [selectedTileSource]);

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
		};
	}, []);

	return (
		<>
			<div id='stats'></div>
			<div
				id='osd'
				ref={ref}
				style={{ width: '500px', height: '500px' }}
			/>

			{/* change tile source controls */}
			<div style={{ display: 'flex', gap: '20px', padding: '20px' }}>
				{tileSources.map((e) => {
					const { name } = e;

					const isSelected = e === selectedTileSource;

					return (
						<button
							style={
								isSelected
									? { border: '2px solid blue' }
									: undefined
							}
							key={name}
							onClick={() => setSelectedTileSource(e)}
						>
							{name}
						</button>
					);
				})}
			</div>
		</>
	);
}

export default App;
