

// Scene, Camera, Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Function to create a random complex path
function createComplexPath(startX, startY, color) {
    const points = [new THREE.Vector3(startX, startY, 0)];
    let x = startX, y = startY;
    
    for (let i = 0; i < 6; i++) {
        const direction = Math.random() > 0.5 ? 'horizontal' : 'vertical';
        const step = (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 2 + 1);
        if (direction === 'horizontal') x += step;
        else y -= step;
        points.push(new THREE.Vector3(x, y, 0));
    }
    
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color, linewidth: 3 });
    const line = new THREE.Line(geometry, material);
    scene.add(line);
    return { line, points };
}

// Create multiple complex lines
const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff];
const lines = colors.map((color, i) => createComplexPath(-5 + i * 2.5, 3, color));

// Create moving dots with glow effect
const dots = lines.map(({ points }, index) => {
    const dotGeometry = new THREE.SphereGeometry(0.2, 16, 16);
    const dotMaterial = new THREE.MeshBasicMaterial({ color: colors[index] });
    const dot = new THREE.Mesh(dotGeometry, dotMaterial);
    scene.add(dot);
    return { dot, points, progress: 0 };
});

camera.position.z = 10;

// Animate dots along the paths
function animate() {
    requestAnimationFrame(animate);
    dots.forEach((dotObj) => {
        dotObj.progress += 0.005;
        if (dotObj.progress > 1) dotObj.progress = 0;

        const segment = Math.floor(dotObj.progress * (dotObj.points.length - 1));
        const t = (dotObj.progress * (dotObj.points.length - 1)) % 1;

        dotObj.dot.position.lerpVectors(dotObj.points[segment], dotObj.points[segment + 1], t);
    });
    renderer.render(scene, camera);
}
animate();

// Resize fix
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});