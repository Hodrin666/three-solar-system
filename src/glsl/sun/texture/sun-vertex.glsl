uniform float time;
varying vec2 vertexUV;
varying vec3 vertexNormal;
varying vec3 vertexPosition;

varying vec3 vLayer0;
varying vec3 vLayer1;
varying vec3 vLayer2;
varying vec3 eyeVector; 

mat2 rotate(float a) {
    float s = sin(a);
    float c = cos(a);
    return mat2(c,-s,s,c);
}

void main () {

    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    eyeVector = normalize(worldPosition.xyz - cameraPosition);


    float t = time * 0.04;
    mat2 rot = rotate(t);

    vec3 position0 = position;
    position0.yz = rot*position0.yz;
    vLayer0 = position0;

    mat2 rot1 = rotate(t + 10.);
    vec3 position1 = position;
    position1.xz = rot1*position1.xz;
    vLayer1 = position1;

    mat2 rot2 = rotate(t + 30.);
    vec3 position2 = position;
    position2.xy = rot2*position2.xy;
    vLayer2 = position2;


    vertexUV = uv;
    vertexPosition = position;
    vertexNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}