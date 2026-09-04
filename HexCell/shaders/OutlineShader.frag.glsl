varying vec2 vUv;
varying float vOutlineOn;
varying float vOutlineThickness;
varying vec3 vInstanceColor;
varying float vOutlineActive;

float getOutline(vec2 uVu, float radius){

    // adjust coords from 0.0-1.0 to (-0.5)-0.5
    float x = abs(uVu.x) - 0.5;
    float y = abs(uVu.y) - 0.5;

    // smooth version
    // float tr = 1.0 - smoothstep(0.5 - vOutlineThickness, 0.5, 0.577 * x + y);
    // float tl = 1.0 - smoothstep(0.5 - vOutlineThickness, 0.5, 0.577 * -x + y);
    // float br = 1.0 - smoothstep(0.5 - vOutlineThickness, 0.5, 0.577 * x - y);
    // float bl = 1.0 - smoothstep(0.5 - vOutlineThickness, 0.5, 0.577 * -x - y);
    // float r = 1.0 - smoothstep(0.433 - vOutlineThickness, 0.44, x);
    // float l = 1.0 - smoothstep(0.433 - vOutlineThickness, 0.44, -x);

    // sharp version
    float tr = 1.0 - step(0.5 - vOutlineThickness, 0.577 * x + y);
    float tl = 1.0 - step(0.5 - vOutlineThickness, 0.577 * -x + y);
    float br = 1.0 - step(0.5 - vOutlineThickness, 0.577 * x - y);
    float bl = 1.0 - step(0.5 - vOutlineThickness, 0.577 * -x - y);
    float r = 1.0 - step(0.433 - vOutlineThickness, x);
    float l = 1.0 - step(0.433 - vOutlineThickness, -x);

    return tr * tl * br * bl * r * l;
}
    


void main() {

    float outlineOrBody = 1.0 - getOutline(vUv, 1.0); // 0 = body , 1 = outline
    float outlineActive = step(-vOutlineActive, -0.5) * (outlineOrBody); // 0 = inactive, 1 = active
    float colorAfterOutlining = 1.0 - outlineActive; // 0=black, 1=unchanged
    vec3 colorOut = vInstanceColor * colorAfterOutlining; // multiply with instance color to get final color

    gl_FragColor = vec4( colorOut, 1.0 );

}