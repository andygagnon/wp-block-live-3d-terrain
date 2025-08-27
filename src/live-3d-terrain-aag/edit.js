/**
 * Retrieves the translation of text.
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * React hook that is used to mark the block wrapper element.
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps, RichText } from '@wordpress/block-editor';

/**
 * React hook for managing block state and lifecycle.
 * @see https://reactjs.org/docs/hooks-reference.html
 */
import { useEffect, useRef } from 'react';

// Three.js is now enqueued globally via PHP, so we do not need to import it here.
// It is available as the global `THREE` object.

/**
 * Styles for the editor.
 */
import './editor.scss';

/**
 * The edit function.
 * @param {object} props
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 * @return {WPElement} Element to render.
 */
export default function Edit({ attributes, setAttributes }) {
	const blockProps = useBlockProps();
	// We use a ref to get access to the DOM element where we'll render the 3D scene.
	const mountRef = useRef(null);

	// This effect runs once when the component mounts and handles the Three.js setup.
	useEffect(() => {
		// Three.js setup variables.
		let scene, camera, renderer, geometry, terrain, animate;

		// Fetch or mock elevation data. For this example, we'll generate a simple
		// sin/cos wave pattern to simulate elevation data. A real implementation
		// would use a fetch call to an external API here.
		const fetchData = () => {
			const width = 100;
			const height = 100;
			const data = [];
			for (let i = 0; i < width; i++) {
				for (let j = 0; j < height; j++) {
					// Create a smooth wave pattern.
					const value =
						Math.sin(i * 0.1) * 5 + Math.cos(j * 0.1) * 5;
					data.push(value);
				}
			}
			return data;
		};

		// The core function to initialize the Three.js scene.
		const init = () => {
			if (!mountRef.current) {
				return;
			}

			// SCENE SETUP
			scene = new THREE.Scene();
			scene.background = new THREE.Color(0x333333);

			// CAMERA SETUP
			camera = new THREE.PerspectiveCamera(
				75,
				mountRef.current.clientWidth / mountRef.current.clientHeight,
				0.1,
				1000
			);
			camera.position.z = 150;
			camera.position.y = 50;
			camera.rotation.x = -Math.PI / 4;

			// RENDERER SETUP
			renderer = new THREE.WebGLRenderer();
			renderer.setSize(
				mountRef.current.clientWidth,
				mountRef.current.clientHeight
			);
			mountRef.current.appendChild(renderer.domElement);

			// TERRAIN GEOMETRY
			const width = 100;
			const height = 100;
			// Create a plane geometry with many segments to deform later.
			geometry = new THREE.PlaneGeometry(200, 200, width - 1, height - 1);
			const data = fetchData();
			const vertices = geometry.attributes.position.array;

			// Deform the terrain geometry based on the mock elevation data.
			for (let i = 0, j = 0; i < vertices.length; i++, j += 3) {
				vertices[j + 2] = data[i]; // The Z-axis is our elevation.
			}

			// Recalculate normals to ensure correct lighting.
			geometry.computeVertexNormals();

			// MATERIAL & MESH
			const material = new THREE.MeshPhongMaterial({
				color: 0x00cc66,
				wireframe: false,
			});
			terrain = new THREE.Mesh(geometry, material);
			scene.add(terrain);

			// LIGHTING
			const ambientLight = new THREE.AmbientLight(0x404040);
			scene.add(ambientLight);
			const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
			directionalLight.position.set(50, 50, 50);
			scene.add(directionalLight);

			// ANIMATION LOOP
			const animate = () => {
				requestAnimationFrame(animate);
				// A simple rotation for demonstration purposes.
				terrain.rotation.z += 0.001;
				renderer.render(scene, camera);
			};
			animate();

			// Clean up function to run on unmount.
			return () => {
				if (mountRef.current && renderer) {
					mountRef.current.removeChild(renderer.domElement);
					renderer.dispose();
				}
			};
		};

		init();
	}, []); // Empty dependency array ensures this effect runs only once.

	return (
		<div {...blockProps}>
			{/* The RichText component allows editing a title directly in the block editor. */}
			<RichText
				tagName="h2"
				className="live-3d-terrain-aag__title"
				value={attributes.title}
				onChange={(newTitle) => setAttributes({ title: newTitle })}
				placeholder={__('Enter a title...', 'live-3d-terrain-aag')}
			/>
			{/* This is the container for our Three.js scene. */}
			<div className="live-3d-terrain-aag__canvas-container">
				<div ref={mountRef} className="live-3d-terrain-aag__canvas" />
			</div>
		</div>
	);
}
