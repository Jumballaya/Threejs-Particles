import * as THREE from "three";
import { OrbitControls, RGBELoader } from "three/examples/jsm/Addons.js";
import { FolderApi, Pane } from "tweakpane";

export class App {
  private threejs: THREE.WebGLRenderer;
  private camera: THREE.PerspectiveCamera;
  private controls: OrbitControls;
  private scene: THREE.Scene;

  private clock: THREE.Clock;
  private debugUI: Pane;

  constructor() {
    const fov = 60;
    const aspect = window.innerWidth / window.innerHeight;
    const near = 0.1;
    const far = 1000;

    this.threejs = new THREE.WebGLRenderer({ antialias: true });
    this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    this.scene = new THREE.Scene();
    this.clock = new THREE.Clock(true);
    this.debugUI = new Pane();
    this.controls = new OrbitControls(this.camera, this.threejs.domElement);

    window.addEventListener("resize", this.handleWindowResize.bind(this));

    this.threejs.shadowMap.enabled = true;
    this.threejs.shadowMap.type = THREE.PCFSoftShadowMap;
    this.threejs.toneMapping = THREE.ACESFilmicToneMapping;
    this.threejs.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.threejs.domElement);

    this.camera.position.set(100, 0, 100);
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));

    this.controls.enableDamping = true;
    this.controls.target.set(0, 0, 0);
    this.controls.update();

    this.scene.background = new THREE.Color(0x000000);

    this.scene.backgroundBlurriness = 0.0;
    this.scene.backgroundIntensity = 0.2;
    this.scene.environmentIntensity = 1.0;

    const sceneFolder = this.debugUI.addFolder({
      title: "Scene",
      expanded: false,
    });
    sceneFolder.addBinding(this.scene, "backgroundBlurriness", {
      min: 0.0,
      max: 1.0,
    });
    sceneFolder.addBinding(this.scene, "backgroundIntensity", {
      min: 0.0,
      max: 1.0,
    });
    sceneFolder.addBinding(this.scene, "environmentIntensity", {
      min: 0.0,
      max: 1.0,
    });
  }

  public async initialize() {
    const projectFolder = this.debugUI.addFolder({
      title: "Project",
      expanded: false,
    });
    await this.onSetupProject(projectFolder);
  }

  public loadRGBE(path: string) {
    const rgbeLoader = new RGBELoader();
    rgbeLoader.load(path, (hdrTexture) => {
      hdrTexture.mapping = THREE.EquirectangularReflectionMapping;

      this.scene.background = hdrTexture;
      this.scene.environment = hdrTexture;
    });
  }

  public get Scene() {
    return this.scene;
  }

  public get Camera() {
    return this.camera;
  }

  public step() {
    const dt = this.clock.getDelta();
    this.onStep(dt, this.clock.getElapsedTime());
    this.controls.update(dt);
    this.render();
  }

  private render() {
    this.onRender();
    this.threejs.render(this.scene, this.camera);
  }

  // deltaTime and totalTime
  protected onStep(_: number, __: number) {}
  protected onRender() {}
  protected async onSetupProject(_: FolderApi) {}

  private handleWindowResize(): void {
    const canvas = this.threejs.domElement;
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;

    const aspect = w / h;

    this.threejs.setSize(w, h, false);
    this.camera.aspect = aspect;
    this.camera.updateProjectionMatrix();
  }
}
