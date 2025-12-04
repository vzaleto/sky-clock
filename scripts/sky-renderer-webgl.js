export class SkyRendererWebGL {
    constructor(canvas) {
      this.canvas = canvas;
      this.gl = canvas.getContext("webgl2");
      if (!this.gl) throw new Error("WebGL2 не поддерживается");
  
      this.width = canvas.width = window.innerWidth;
      this.height = canvas.height = window.innerHeight;
      this.gl.viewport(0, 0, this.width, this.height);
  
      this.scene = {
        timePhase: 'day',
        weather: 'clear',
        wind: 0.5,
      };
      this.bgColor = [0.4, 0.7, 1.0];
this.cloudDensity = 0.5;


  
      window.addEventListener('resize', () => this.resize());
  
      this.initShaders();
      this.initClouds();
      requestAnimationFrame(() => this.render());
    }
  
    resize() {
      this.width = this.canvas.width = window.innerWidth;
      this.height = this.canvas.height = window.innerHeight;
      this.gl.viewport(0, 0, this.width, this.height);
    }

   setScene(sceneUpdate) {
  // аккуратно обновляем сцену
  this.scene = {
    ...this.scene,
    ...sceneUpdate
    
  };

  // Меняем цвет неба плавно
  if (sceneUpdate.timePhase) {
    if (sceneUpdate.timePhase === 'day')
      this.bgColor = [0.4, 0.7, 1.0];
    if (sceneUpdate.timePhase === 'sunset')
      this.bgColor = [1.0, 0.6, 0.3];
    if (sceneUpdate.timePhase === 'night')
      this.bgColor = [0.05, 0.05, 0.15];
  }

  // Плотность облаков в зависимости от погоды
  const weatherDensity = {
    clear: 0.2,
    partly: 0.4,
    cloudy: 0.7,
    overcast: 1.0,
    fog: 0.9,
    rain: 1.0,
    snow: 1.0,
    storm: 1.0
  };

  this.cloudDensity = weatherDensity[this.scene.weather] ?? 0.5;
}

    initShaders() {
      const gl = this.gl;
  
      const vertSrc = `
        attribute vec2 aPosition;
        attribute vec2 aOffset;
        attribute float aSize;
        varying vec2 vUV;
        
        void main() {
          vUV = aPosition * 0.5 + 0.5;
          gl_Position = vec4(aPosition * aSize + aOffset, 0.0, 1.0);
        }
      `;
  
      const fragSrc = `
precision highp float;
varying vec2 vUV;
uniform float uTime;

// функция случайного значения
float rand(vec2 co) {
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

// 2D value noise
float noise(vec2 p){
    vec2 i = floor(p);
    vec2 f = fract(p);
    float a = rand(i);
    float b = rand(i + vec2(1.0,0.0));
    float c = rand(i + vec2(0.0,1.0));
    float d = rand(i + vec2(1.0,1.0));
    vec2 u = f*f*(3.0-2.0*f);
    return mix(a, b, u.x) + (c-a)* u.y * (1.0-u.x) + (d-b)* u.x*u.y;
}

void main() {
    vec2 p = vUV * 8.0; // масштаб для облаков
    float n = noise(p + vec2(uTime*0.01, uTime*0.005));
    float cloudAlpha = smoothstep(0.45, 0.65, n);

    // градиент неба
    vec3 skyColor = mix(vec3(0.4,0.7,1.0), vec3(0.8,0.9,1.0), vUV.y);

    // смешиваем облака с небом
    vec3 color = mix(skyColor, vec3(1.0), cloudAlpha * 0.5);

    gl_FragColor = vec4(color, 1.0);
}



      `;
      
  
      const vertShader = gl.createShader(gl.VERTEX_SHADER);
      gl.shaderSource(vertShader, vertSrc);
      gl.compileShader(vertShader);
  
      const fragShader = gl.createShader(gl.FRAGMENT_SHADER);
      gl.shaderSource(fragShader, fragSrc);
      gl.compileShader(fragShader);
  
      const program = gl.createProgram();
      gl.attachShader(program, vertShader);
      gl.attachShader(program, fragShader);
      gl.linkProgram(program);
      gl.useProgram(program);
  
      this.program = program;
      this.attribPosition = gl.getAttribLocation(program, "aPosition");
      this.attribOffset = gl.getAttribLocation(program, "aOffset");
      this.attribSize = gl.getAttribLocation(program, "aSize");
      this.uTime = gl.getUniformLocation(program, "uTime");
    }
  
    initClouds() {
      const gl = this.gl;
      const count = 20;
      this.clouds = Array.from({ length: count }, () => ({
        x: Math.random() * 2 - 1,
        y: Math.random() * 1 - 1,
        size: 0.1 + Math.random() * 0.2,
        speed: 0.0005 + Math.random() * 0.001
      }));
  
      const vertices = new Float32Array([
        -1,-1,
         1,-1,
        -1, 1,
         1, 1
      ]);
  
      this.vertexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    }
  
    render(time = 0) {
      const gl = this.gl;
      gl.clearColor(this.bgColor[0], this.bgColor[1], this.bgColor[2], 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
    
      gl.useProgram(this.program);
      gl.uniform1f(this.uTime, time * 0.001);
    
      gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
      gl.enableVertexAttribArray(this.attribPosition);
      gl.vertexAttribPointer(this.attribPosition, 2, gl.FLOAT, false, 0, 0);
    
      // Рисуем каждое облако
      this.clouds.forEach(cloud => {
        cloud.x += cloud.speed;
        if (cloud.x > 1.5) cloud.x = -1.5;
    
        gl.vertexAttrib2f(this.attribOffset, cloud.x, cloud.y);
        gl.vertexAttrib1f(this.attribSize, cloud.size);
    
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      });
    
      requestAnimationFrame((t) => this.render(t));
    }
    

  }
  