function getWater() {

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const WIDTH = 1024;
    const HEIGHT = 1024;
    canvas.width = WIDTH;
    canvas.height = HEIGHT;


    // Constants for the noise and light calculations
    const freq = { x: 5, y: 5, z: 2, w: 0.5 };
    const shift = { x: 0.1, y: 0.1 };
    let time = 0;
    const ambientColor = { r: 40, g: 40, b: 40 };
    const diffuseColor = { r: 100, g: 150, b: 200 };
    const specularColor = { r: 255, g: 255, b: 255 };
    const shine = 20;

    // Include a noise library or define your own noise function
    // Here, let's define a simple placeholder for the noise function
    function noise(x, y) {
        return Math.sin(x * 0.1) * Math.cos(y * 0.1);
    }

    function calculateLighting(x, y) {
        let nx = noise(x * freq.x, y * freq.y) * freq.w;
        let ny = noise(x * freq.x + shift.x, y * freq.y + shift.y) * freq.w;
        let nz = Math.sqrt(Math.max(0, 1 - (nx * nx + ny * ny * freq.z)));
        let normal = { x: nx, y: ny, z: nz };

        let L = { x: 0, y: 0, z: 1 };  // Light direction
        let V = { x: 0, y: 0, z: 1 };  // View direction
        let diff = Math.max(0, (L.x * normal.x + L.y * normal.y + L.z * normal.z));
        let spec = Math.pow(Math.max(0, (L.x - V.x) * normal.x + (L.y - V.y) * normal.y + (L.z - V.z) * normal.z), shine);
        let att = 1.0;  // Simplified attenuation

        return {
            r: ambientColor.r + att * (diffuseColor.r * diff + specularColor.r * spec),
            g: ambientColor.g + att * (diffuseColor.g * diff + specularColor.g * spec),
            b: ambientColor.b + att * (diffuseColor.b * diff + specularColor.b * spec)
        };
    }


    for (let y = 0; y < HEIGHT; y++) {
        for (let x = 0; x < WIDTH; x++) {
            let color = calculateLighting(x, y);
            ctx.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
            ctx.fillRect(x, y, 1, 1);
        }
    }
    const imageData = canvas.toDataURL('image/jpeg');
    return imageData;
}