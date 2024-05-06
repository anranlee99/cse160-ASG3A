const c1 = { r: Math.random(), g: Math.random(), b: Math.random() };
const c2 = { r: Math.random(), g: Math.random(), b: Math.random() };
let acc = -1;
class Cube {
  constructor() {
    this.type = 'cube';
    this.color = [1.0, 1.0, 1.0, 1.0]; // Default color, consider if this needs initialization
    this.matrix = new Matrix4(); // Ensure Matrix4 is defined or imported
    this.textureNum = -1;
  }

  static lerpColor(color1, color2, t) {
    let r = Math.round(color1.r * (1 - t) + color2.r * t);
    let g = Math.round(color1.g * (1 - t) + color2.g * t);
    let b = Math.round(color1.b * (1 - t) + color2.b * t);
    return { r, g, b };
  }
  static updateColors() {
    // Simple random walk for color values
    c1.r += (Math.random() - 0.5) * 0.1;
    c1.g += (Math.random() - 0.5) * 0.1;
    c1.b += (Math.random() - 0.5) * 0.1;
    c2.r += (Math.random() - 0.5) * 0.1;
    c2.g += (Math.random() - 0.5) * 0.1;
    c2.b += (Math.random() - 0.5) * 0.1;

    // Clamp values to stay within [0, 1]
    c1.r = Math.max(0, Math.min(1, c1.r));
    c1.g = Math.max(0, Math.min(1, c1.g));
    c1.b = Math.max(0, Math.min(1, c1.b));
    c2.r = Math.max(0, Math.min(1, c2.r));
    c2.g = Math.max(0, Math.min(1, c2.g));
    c2.b = Math.max(0, Math.min(1, c2.b));
    //randomize them a little bit
    if (acc < 0) {
      acc = 1;
    } else {
      acc = -1;
    }
    c1.r += acc * Math.random() * 0.1;
    c1.g += acc * Math.random() * 0.1;
    c1.b += acc * Math.random() * 0.1;
    c2.r += acc * Math.random() * 0.1;
    c2.g += acc * Math.random() * 0.1;
    c2.b += acc * Math.random() * 0.1;
    
    
  }
  renderLerp(delta) {
    const c = Cube.lerpColor(c1, c2, delta); // Use static method and static colors

    const rgba = [c.r, c.g, c.b, this.color[3]]; // Normalize RGB and use alpha

    gl.uniform1i(u_whichTexture, this.textureNum);
    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

    // Draw each face with interpolated color
    const faces = [
      [0, 0, 0, 1, 0, 0, 1, 1, 0],
      [0, 0, 0, 0, 1, 0, 1, 1, 0],
      [0, 0, 0, 0, 0, 1, 0, 1, 1],
      [0, 0, 0, 0, 1, 0, 0, 1, 1],
      [0, 0, 1, 0, 1, 1, 1, 1, 1],
      [0, 0, 1, 1, 0, 1, 1, 1, 1],
      [1, 0, 0, 1, 1, 0, 1, 1, 1],
      [1, 0, 0, 1, 0, 1, 1, 1, 1],
      [0, 1, 0, 1, 1, 0, 1, 1, 1],
      [0, 1, 0, 0, 1, 1, 1, 1, 1],
    ];

    faces.forEach(face => {
      gl.uniform4f(u_FragColor, ...rgba); // Apply RGBA colors uniformly
      drawTriangle3DUV(face, [...Object.values(c1), ...Object.values(c2)]);
    });
  }
  render() {
    var rgba = this.color;
    gl.uniform1i(u_whichTexture, this.textureNum);
    // Draw a point
    // gl.uniform1f(u_Size, size);
    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

    // FRONT SIDE
    // Pass the color of a point to u_FragColor variable
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
    drawTriangle3DUV([0, 0, 0, 1, 0, 0, 1, 1, 0], [0, 0, 1, 0, 1, 1]);
    drawTriangle3DUV([0, 0, 0, 0, 1, 0, 1, 1, 0], [0, 0, 0, 1, 1, 1]);

    // BOTTOM SIDE
    gl.uniform4f(u_FragColor, rgba[0] * 0.9, rgba[1] * 0.9, rgba[2] * 0.9, rgba[3]);
    drawTriangle3DUV([0, 0, 0, 1, 0, 0, 1, 0, 1], [0, 0, 1, 0, 1, 0]);
    drawTriangle3DUV([0, 0, 0, 0, 0, 1, 1, 0, 1], [0, 0, 0, 0, 1, 0]);

    // LEFT SIDE
    gl.uniform4f(u_FragColor, rgba[0] * 0.8, rgba[1] * 0.8, rgba[2] * 0.8, rgba[3]);
    drawTriangle3DUV([0, 0, 0, 0, 0, 1, 0, 1, 1], [0, 0, 0, 0, 0, 1]);
    drawTriangle3DUV([0, 0, 0, 0, 1, 0, 0, 1, 1], [0, 0, 0, 1, 0, 1]);

    // BACK SIDE
    gl.uniform4f(u_FragColor, rgba[0] * 0.7, rgba[1] * 0.7, rgba[2] * 0.7, rgba[3]);
    drawTriangle3DUV([0, 0, 1, 0, 1, 1, 1, 1, 1], [0, 0, 0, 1, 1, 1]);
    drawTriangle3DUV([0, 0, 1, 1, 0, 1, 1, 1, 1], [0, 0, 1, 0, 1, 1]);

    // RIGHT SIDE
    gl.uniform4f(u_FragColor, rgba[0] * 0.6, rgba[1] * 0.6, rgba[2] * 0.6, rgba[3]);
    drawTriangle3DUV([1, 0, 0, 1, 1, 0, 1, 1, 1], [1, 0, 1, 1, 1, 1]);
    drawTriangle3DUV([1, 0, 0, 1, 0, 1, 1, 1, 1], [1, 0, 1, 0, 1, 1]);

    // TOP SIDE
    gl.uniform4f(u_FragColor, rgba[0] * 0.5, rgba[1] * 0.5, rgba[2] * 0.5, rgba[3]);
    drawTriangle3DUV([0, 1, 0, 1, 1, 0, 1, 1, 1], [0, 1, 1, 1, 1, 1]);
    drawTriangle3DUV([0, 1, 0, 0, 1, 1, 1, 1, 1], [0, 1, 0, 1, 1, 1]);
  }

}

class Triangle3d {
  constructor() {
    this.type = 'cube';
    // this.position = pos;
    this.color = [1.0, 1.0, 1.0, 1.0];
    // this.size = 5.0;
    this.matrix = new Matrix4();
    this.textureNum = -1;
  }

  render() {
    var rgba = this.color;

    // Draw a point
    // gl.uniform1f(u_Size, size);
    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
    gl.uniform1i(u_whichTexture, this.textureNum);

    // FRONT SIDE
    // Pass the color of a point to u_FragColor variable
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
    drawTriangle3DUV([0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.5, 1.0, 0.0], [0, 0, 1, 0, 0.5, 1]);
    // drawTriangle3D( [0.0, 0.0, 0.0,  0.0,1.0,0.0,  1.0,1.0,0.0 ]);

    // BOTTOM SIDE
    gl.uniform4f(u_FragColor, rgba[0] * 0.9, rgba[1] * 0.9, rgba[2] * 0.9, rgba[3]);
    drawTriangle3DUV([0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0], [0, 0, 1, 0, 1, 0]);
    drawTriangle3DUV([0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 1.0, 0.0, 1.0], [0, 0, 0, 0, 1, 0]);

    // LEFT SIDE
    gl.uniform4f(u_FragColor, rgba[0] * 0.8, rgba[1] * 0.8, rgba[2] * 0.8, rgba[3]);
    drawTriangle3DUV([0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.5, 1.0, 1.0], [0, 0, 0, 0, 0.5, 1]);
    drawTriangle3DUV([0.0, 0.0, 0.0, 0.5, 1.0, 0.0, 0.5, 1.0, 1.0], [0, 0, 0.5, 1, 0.5, 1]);

    // BACK SIDE
    gl.uniform4f(u_FragColor, rgba[0] * 0.7, rgba[1] * 0.7, rgba[2] * 0.7, rgba[3]);
    drawTriangle3DUV([0.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.5, 1.0, 1.0], [0, 0, 1, 0, 0.5, 1]);

    // RIGHT SIDE
    gl.uniform4f(u_FragColor, rgba[0] * 0.6, rgba[1] * 0.6, rgba[2] * 0.6, rgba[3]);
    drawTriangle3DUV([1.0, 0.0, 0.0, 0.5, 1.0, 0.0, 0.5, 1.0, 1.0], [1, 0, 0.5, 1, 0.5, 1]);
    drawTriangle3DUV([1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 0.5, 1.0, 1.0], [1, 0, 1, 0, 0.5, 1]);
  }
}