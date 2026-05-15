import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'app-background',
  standalone: true,
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
})
export class Background implements AfterViewInit {
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private starGroup!: THREE.Group;
  private velocities: number[] = [];
  private accelerations: number[] = [];
  private star: THREE.Points[] = [];

  private isDragging = false;
  private previousMouseX = 0;
  private previousMouseY = 0;
  private targetRotationY = 0;
  private targetRotationX = 0;
  private staticMode = false;

  ngAfterViewInit(): void {
    this.init();
    this.addMouseControls();
    this.animate();
  }

  private init() {
    const canvas = this.canvasRef.nativeElement;

    // Escena y cámara
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(60,window.innerWidth / window.innerHeight,1,1000);

    this.camera.position.z = 5;
    this.camera.rotation.x = Math.PI / 2;

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    // Grupo de estrellas
    this.starGroup = new THREE.Group();
    this.scene.add(this.starGroup);

    // --- Sprites ---
    const spritePaths = [
      '/assets/images/stars/EstrellasMoradas.svg',
      '/assets/images/stars/Estrellas.svg',
      '/assets/images/stars/EstrellasCelestes.svg',
      '/assets/images/stars/RosadoSuave.svg',
      '/assets/images/stars/Dorado.svg',
      '/assets/images/stars/Naranja.svg',
    ];
    const spriteTextures = spritePaths.map(path => new THREE.TextureLoader().load(path));
    const getRandomSprite = () => spriteTextures[Math.floor(Math.random() * spriteTextures.length)];

    // --- Crear estrellas ---    
    const totalStars = 1000;

// pesos 
const weights = [
  0.50, // morado
  0.30, // blanco
  0.15, // celeste
  0.10, // rosado
  0.05, // dorado
  0.03, // naranja
];

const starGroups: number[][][] = spriteTextures.map(() => []);

for (let i = 0; i < totalStars; i++) {
  const rand = Math.random();

  let selectedIndex = 0;
  let sum = 0;

  for (let j = 0; j < weights.length; j++) {
    sum += weights[j];
    if (rand <= sum) {
      selectedIndex = j;
      break;
    }
  }

  starGroups[selectedIndex].push([
    Math.random() * 600 - 300,
    Math.random() * 600 - 300,
    Math.random() * 600 - 300,
  ]);

  this.velocities.push(0);
  this.accelerations.push(0.001);
}

// crear los Points
starGroups.forEach((group, i) => {
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(group.length * 3);

  group.forEach((pos, index) => {
    positions.set(pos, index * 3);
  });

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    size: 1.3,
    sizeAttenuation: true,
    map: spriteTextures[i],
    transparent: true,
    depthWrite: false,

    blending: THREE.AdditiveBlending,
    
  });

  const glowMaterial = new THREE.PointsMaterial({
  size: 2.5, // 🔥 más grande
  sizeAttenuation: true,
  map: spriteTextures[i], // puedes usar el mismo
  transparent: true,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
  color: 0xffffff,
  opacity: 0.25, // 🔥 suaviza el halo
});

  const glowPoints = new THREE.Points(geometry, glowMaterial);
  const points = new THREE.Points(geometry, material);

  this.starGroup.add(glowPoints);
  this.starGroup.add(points);
  this.star.push(points);
});

    // Ajuste de tamaño al redimensionar
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  private addMouseControls() {

    window.addEventListener('mousedown', (e) => {
      this.isDragging = true;
      this.previousMouseX = e.clientX;
      this.previousMouseY = e.clientY;
    });

    window.addEventListener('mouseup', () => {
      this.isDragging = false;
    });

    window.addEventListener('mousemove', (e) => {
      if (!this.isDragging) return;

      const deltaX = e.clientX - this.previousMouseX;
      const deltaY = e.clientY - this.previousMouseY;

      this.previousMouseX = e.clientX;
      this.previousMouseY = e.clientY;

      this.targetRotationY += deltaX * 0.005;
      this.targetRotationX += deltaY * 0.005;

      this.targetRotationX = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.targetRotationX));
    });

    this.animate();
  }

  private animate = () => {
  requestAnimationFrame(this.animate);

  let index = 0; 

  if(this.staticMode == false) {

  this.star.forEach((points) => {
    const positions = points.geometry.attributes['position'];

    for (let i = 0; i < positions.count; i++) {

      this.velocities[index] += this.accelerations[index];

      positions.array[i * 3 + 1] -= this.velocities[index];

      if (positions.array[i * 3 + 1] < -200) {
        positions.array[i * 3 + 1] = 200;
        this.velocities[index] = 0;
      }

      index++;
    }

    positions.needsUpdate = true;
  });
}

  // Rotación suave
  this.starGroup.rotation.y += (this.targetRotationY - this.starGroup.rotation.y) * 0.1;
  this.starGroup.rotation.x += (this.targetRotationX - this.starGroup.rotation.x) * 0.1;

  this.starGroup.rotation.y += 0.0002;
  this.starGroup.rotation.x += 0.0001;

  this.renderer.render(this.scene, this.camera);
};
}