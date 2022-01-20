uniform float time;
varying vec2 vertexUV;
varying vec3 vertexNormal;
varying vec3 vertexPosition;
varying vec3 vLayer0;
varying vec3 vLayer1;
varying vec3 vLayer2;
varying vec3 eyeVector; 

uniform samplerCube uPerlin;

vec3 brightnessToColor(float b){
    b *=0.25;
    return (vec3(b, b*b, b*b*b*b)/0.25) * 0.75;
}

float superSun() {
    float sum = 0.;
    sum += textureCube(uPerlin, vLayer0).r;
    sum += textureCube(uPerlin, vLayer1).r;
    sum += textureCube(uPerlin, vLayer2).r;
    sum *= 0.33;
    return sum;
}

float fresnel(vec3 eyeVector, vec3 worldNormal){
    return pow( 1.0 + dot(eyeVector, worldNormal), 3.0);
}

void main() {
    
    float radial = 1. - vertexPosition.z;
    radial*=radial*radial;
    float brightness = 2. + radial*0.85;

    gl_FragColor.rgb = brightnessToColor(brightness)*radial;
    gl_FragColor.a = radial;
    //gl_FragColor = vec4(radial,0.,0.,1.);
}