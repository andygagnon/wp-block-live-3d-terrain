/******/ (() => { // webpackBootstrap
/*!*****************************************!*\
  !*** ./src/live-3d-terrain-aag/view.js ***!
  \*****************************************/
// Three.js is now enqueued globally via PHP, so we do not need to import it here.
// It is available as the global `THREE` object.

/**
 * This is the front-end script for the block, which runs in the browser.
 * It's responsible for finding our block's container and rendering the
 * interactive 3D terrain scene.
 */
document.addEventListener('DOMContentLoaded', () => {
  // Find all instances of our block on the page.
  const blocks = document.querySelectorAll('.wp-block-live-3d-terrain-aag-live-3d-terrain-aag');
  blocks.forEach(block => {
    const mount = block.querySelector('.live-3d-terrain-aag__canvas');
    if (!mount) {
      return;
    }
    let scene, camera, renderer, geometry, terrain, animate;
    let elevationData = null;
    const terrainWidth = 2048;
    const terrainHeight = 2048;
    const fetchElevationData = callback => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = 'https://picsum.photos/2048/2048'; // Using a placeholder for a 2048x2048 image. Replace with your actual image path.
      img.src = 'https://cb.lndo.site/wp-content/uploads/2025/08/mt-fuji-heightmap.png'; // Using a placeholder for a 2048x2048 image. Replace with your actual image path.

      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = terrainWidth;
        canvas.height = terrainHeight;
        const context = canvas.getContext('2d');
        context.drawImage(img, 0, 0);
        const imageData = context.getImageData(0, 0, terrainWidth, terrainHeight).data;
        const data = [];
        for (let i = 0; i < imageData.length; i += 4) {
          // Use the red channel (or any single channel) for grayscale value
          const grayValue = imageData[i];
          // Scale the height to be more visible.
          data.push(grayValue * 0.2);
        }
        callback(data);
      };
      img.onerror = () => {
        console.error('Error loading image. Using fallback data.');
        const fallbackData = [];
        for (let i = 0; i < terrainWidth * terrainHeight; i++) {
          fallbackData.push(0);
        }
        callback(fallbackData);
      };
    };
    const init = () => {
      // SCENE SETUP
      scene = new THREE.Scene();
      scene.background = new THREE.Color(0x333333);

      // CAMERA SETUP
      camera = new THREE.PerspectiveCamera(75, mount.clientWidth / mount.clientHeight, 0.1, 10000);
      camera.position.z = 500;
      camera.position.y = 300;
      camera.rotation.x = -Math.PI / 4;

      // RENDERER SETUP
      renderer = new THREE.WebGLRenderer();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
      mount.appendChild(renderer.domElement);

      // TERRAIN GENERATION
      fetchElevationData(data => {
        elevationData = data;

        // TERRAIN GEOMETRY
        geometry = new THREE.PlaneGeometry(2048, 2048, terrainWidth - 1, terrainHeight - 1);
        // geometry = new THREE.PlaneGeometry(2048, 2048, 100 - 1, 100 - 1);
        const vertices = geometry.attributes.position.array;
        for (let i = 0; i < elevationData.length; i++) {
          vertices[i * 3 + 2] = elevationData[i];
        }
        geometry.computeVertexNormals();

        // MATERIAL & MESH
        const material = new THREE.MeshPhongMaterial({
          // color: 0x00cc66,
          color: 0xddffdd,
          wireframe: false
        });
        terrain = new THREE.Mesh(geometry, material);
        terrain.rotation.x = -Math.PI / 2;
        scene.add(terrain);

        // LIGHTING
        const ambientLight = new THREE.AmbientLight(0x404040);
        scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(50, 40, 50);
        scene.add(directionalLight);

        // ANIMATION LOOP
        animate = () => {
          requestAnimationFrame(animate);
          if (terrain) {
            terrain.rotation.z += 0.001;
          }
          renderer.render(scene, camera);
        };
        animate();
      });
    };

    // Handle window resizing to keep the scene responsive.
    window.addEventListener('resize', () => {
      if (camera && renderer && mount) {
        camera.aspect = mount.clientWidth / mount.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(mount.clientWidth, mount.clientHeight);
      }
    });
    init();
  });
});
/******/ })()
;
//# sourceMappingURL=view.js.map