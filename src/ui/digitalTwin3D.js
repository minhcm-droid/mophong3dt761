export class DigitalTwin3D {
  constructor(container) {
    this.container = container;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.liquids = {};
    this.beacon = null;
    this.angle = 0.65;
    this.radius = 28;
    this.height = 14;
    this.target = { x: 0, y: 6, z: 0 };
    this.initialized = false;
  }

  init() {
    if (this.initialized || typeof window.THREE === 'undefined') return;
    const THREE = window.THREE;
    const w = this.container.clientWidth || 900;
    const h = this.container.clientHeight || 600;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x070b14);
    this.scene.fog = new THREE.FogExp2(0x070b14, 0.015);

    this.camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 200);
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(w, h);
    this.container.innerHTML = '';
    this.container.appendChild(this.renderer.domElement);

    // Lighting
    this.scene.add(new THREE.AmbientLight(0x94a3b8, 1.1));
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.4);
    dirLight.position.set(18, 30, 22);
    this.scene.add(dirLight);

    // Floor Grid
    const grid = new THREE.GridHelper(44, 44, 0x1e293b, 0x0f172a);
    this.scene.add(grid);

    const glassMat = (hex) => new THREE.MeshPhysicalMaterial({
      color: hex, transparent: true, opacity: 0.32, roughness: 0.2, metalness: 0.1
    });
    const liquidMat = (hex) => new THREE.MeshStandardMaterial({
      color: hex, emissive: hex, emissiveIntensity: 0.35
    });

    // Build T-761 Tower (20 trays)
    const t761Geo = new THREE.CylinderGeometry(1.1, 1.1, 14, 24);
    const t761Mesh = new THREE.Mesh(t761Geo, glassMat(0x38bdf8));
    t761Mesh.position.set(0, 8, 0);
    this.scene.add(t761Mesh);

    for (let i = 1; i <= 20; i++) {
      const tray = new THREE.Mesh(
        new THREE.CylinderGeometry(1.02, 1.02, 0.06, 20),
        new THREE.MeshBasicMaterial({ color: i === 10 ? 0xfacc15 : 0x64748b })
      );
      tray.position.set(0, 2.2 + i * 0.55, 0);
      this.scene.add(tray);
    }

    const t761Liq = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.0, 2.5, 24), liquidMat(0xf59e0b));
    t761Liq.position.set(0, 2.3, 0);
    this.scene.add(t761Liq);
    this.liquids['T-761'] = t761Liq;

    // Build Vessels: D-761, D-762, D-764, D-763, D-752
    const addVessel = (key, x, y, z, r, len, color, horizontal = false) => {
      const geo = new THREE.CylinderGeometry(r, r, len, 24);
      const mesh = new THREE.Mesh(geo, glassMat(color));
      if (horizontal) mesh.rotation.z = Math.PI / 2;
      mesh.position.set(x, y, z);
      this.scene.add(mesh);

      const liq = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.92, r * 0.92, len * 0.5, 20), liquidMat(color));
      if (horizontal) liq.rotation.z = Math.PI / 2;
      liq.position.set(x, y - (horizontal ? 0 : len * 0.2), z);
      this.scene.add(liq);
      this.liquids[key] = liq;
    };

    addVessel('D-761', -10, 3.5, 0, 1.1, 4.0, 0x38bdf8, false);
    addVessel('D-762', -5, 7.5, 0, 1.2, 4.2, 0x38bdf8, true);
    addVessel('D-764', 7.5, 3.0, -2.0, 0.9, 3.2, 0x38bdf8, false);
    addVessel('D-763', 7.8, 3.5, 2.5, 1.5, 4.4, 0xf59e0b, true);
    addVessel('D-752', 1.5, 2.5, 4.5, 1.5, 4.6, 0xe879f9, true);

    // Reboiler E-761 & Condenser E-762
    const e761 = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 3.0, 20), new THREE.MeshStandardMaterial({ color: 0xef4444 }));
    e761.position.set(2.5, 2.8, -1.5);
    this.scene.add(e761);

    const e762 = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 3.4, 20), new THREE.MeshStandardMaterial({ color: 0x10b981 }));
    e762.rotation.z = Math.PI / 2;
    e762.position.set(-4.8, 14.5, 0);
    this.scene.add(e762);

    // Golden 3D Beacon Sphere for Valve Locator
    this.beacon = new THREE.Mesh(
      new THREE.SphereGeometry(0.65, 16, 16),
      new THREE.MeshBasicMaterial({ color: 0xfacc15, wireframe: true })
    );
    this.beacon.visible = false;
    this.scene.add(this.beacon);

    // Mouse orbit controls
    let drag = false;
    let prevX = 0;
    this.renderer.domElement.addEventListener('mousedown', (e) => { drag = true; prevX = e.clientX; });
    window.addEventListener('mousemove', (e) => {
      if (!drag) return;
      this.angle += (e.clientX - prevX) * 0.008;
      prevX = e.clientX;
    });
    window.addEventListener('mouseup', () => { drag = false; });

    this.initialized = true;
    this.animate();
  }

  flyToValve(valve) {
    if (!this.initialized) this.init();
    if (!this.beacon || !valve.pos3d) return;
    const [x, y, z] = valve.pos3d;
    this.target = { x, y, z };
    this.radius = 14;
    this.beacon.position.set(x, y, z);
    this.beacon.visible = true;
  }

  update(state) {
    if (!this.initialized) return;
    if (this.liquids['T-761']) {
      this.liquids['T-761'].scale.y = Math.max(0.1, state.tags['LIC-790'].pv / 40);
    }
    if (this.liquids['D-761']) {
      this.liquids['D-761'].scale.y = Math.max(0.1, state.tags['LI-787'].pv / 50);
    }
    if (this.liquids['D-764']) {
      this.liquids['D-764'].scale.y = Math.max(0.1, state.tags['LI-791'].pv / 50);
    }
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    if (!this.renderer || !this.scene || !this.camera) return;
    if (this.beacon && this.beacon.visible) {
      this.beacon.rotation.y += 0.04;
    }
    this.camera.position.x = this.target.x + Math.cos(this.angle) * this.radius;
    this.camera.position.z = this.target.z + Math.sin(this.angle) * this.radius;
    this.camera.position.y = this.target.y + 6;
    this.camera.lookAt(this.target.x, this.target.y, this.target.z);
    this.renderer.render(this.scene, this.camera);
  }
}
