in vec2 vUv;

float getOutline(vec2 uVu, float radius){

    float x = abs(uVu.x) - 0.5;
    float y = abs(uVu.y) - 0.5;
    float thickness = 0.01;

    // blurred version
    // float tr = 1.0 - smoothstep(0.5 - thickness, 0.5, 0.577 * x + y);
    // float tl = 1.0 - smoothstep(0.5 - thickness, 0.5, 0.577 * -x + y);
    // float br = 1.0 - smoothstep(0.5 - thickness, 0.5, 0.577 * x - y);
    // float bl = 1.0 - smoothstep(0.5 - thickness, 0.5, 0.577 * -x - y);
    // float r = 1.0 - smoothstep(0.433 - thickness, 0.44, x);
    // float l = 1.0 - smoothstep(0.433 - thickness, 0.44, -x);

    // sharp version
    float tr = 1.0 - step(0.5 - thickness, 0.577 * x + y);
    float tl = 1.0 - step(0.5 - thickness, 0.577 * -x + y);
    float br = 1.0 - step(0.5 - thickness, 0.577 * x - y);
    float bl = 1.0 - step(0.5 - thickness, 0.577 * -x - y);
    float r = 1.0 - step(0.433 - thickness, x);
    float l = 1.0 - step(0.433 - thickness, -x);

    return tr * tl * br * bl * r * l;
}
    


void main() {

    float outline = 1.0 - getOutline(vUv, 1.0);

    vec3 color = vec3(0.1, 0.1, 0.1);

    gl_FragColor = vec4( color, outline );

}