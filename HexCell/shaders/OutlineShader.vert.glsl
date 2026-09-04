attribute float aOutlineActive; // actually comes in as bool, glsl converts to float (as expected)

varying vec2 vUv;
varying float vOutlineThickness;
varying vec3 vInstanceColor;
varying float vOutlineActive;

uniform float outlineThickness;

void main() {

    // assign varyings
    vInstanceColor = instanceColor;
    vUv = uv;
    vOutlineThickness = outlineThickness;
    vOutlineActive = aOutlineActive;

    // assign gl_position
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * instanceMatrix * vec4(position, 1.0);;
}