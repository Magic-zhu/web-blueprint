import { GridHelper, PerspectiveCamera, Scene, WebGLRenderer } from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { TransformControls } from "three/examples/jsm/controls/TransformControls"
export class BluePrintEditor {
    container: Element
    _scene: Scene
    constructor() {

    }

    init() {
        // * 场景对象
        const scene = new Scene();
        this._scene = scene
        // * 辅助网格
        const gridHelper = new GridHelper(300, 30, 0x00ff00);
        scene.add(gridHelper);
        // * 相机
        // ! 为了避免z-fighting问题 初始near设置的较大
        const camera = new PerspectiveCamera(
            50,
            1,
            10,
            1000
        );
        // * 渲染器
        const renderer = new WebGLRenderer({ antialias: true });
        // * 视角控制器
        const orbitControls = new OrbitControls(camera, renderer.domElement);
        // * 拖动控制器
        const transformController = new TransformControls(
            camera,
            renderer.domElement
        );
        transformController.addEventListener("dragging-changed", function (event) {
            orbitControls.enabled = !event.value;
        });
        scene.add(transformController);
    }
}