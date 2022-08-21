import { BaseNode } from "src/blueprint/baseNode"
import { GridHelper, PerspectiveCamera, Scene, WebGLRenderer, sRGBEncoding, Object3D } from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { CSS2DRenderer } from "three/examples/jsm/renderers/CSS2DRenderer"
import IO from "src/blueprint/IO"
export class BluePrintEditor {
    container: Element
    _scene: Scene
    constructor(container) {
        this.container = container
        container.style.position = 'relative'
        this.container.addEventListener('mouseup',(ev)=>{
            IO.emit('mouseup', ev)
        })
        this.container.addEventListener('mousemove',(ev)=>{
            IO.emit('mousemove', ev)
        })
        this.init()
    }

    init() {
        // * 场景对象
        const scene = new Scene();
        this._scene = scene
        // * 辅助网格
        const gridHelper = new GridHelper(300, 50, 0x111111, 0x111111);
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
        const cssRenderer = new CSS2DRenderer();
        // * 视角控制器
        const orbitControls = new OrbitControls(camera, cssRenderer.domElement);
        orbitControls.enableRotate = false;
        // * 相机参数设置
        camera.position.set(0, 200, 0); //设置相机位置
        camera.lookAt(scene.position);
        camera.aspect = this.container.clientWidth / this.container.clientHeight;
        camera.updateProjectionMatrix();
        camera.updateMatrixWorld();
        renderer.outputEncoding = sRGBEncoding;
        // * 渲染器参数设置
        renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        renderer.setClearColor(
            0x333333,
            1
        );
        cssRenderer.setSize(this.container.clientWidth, this.container.clientHeight);
        cssRenderer.domElement.style.position = 'absolute';
        cssRenderer.domElement.style.top = '0px';
        cssRenderer.domElement.style.zIndex = "10";
        cssRenderer.domElement.style.touchAction = "none";
        // * 插入画布
        this.container.appendChild(renderer.domElement);
        this.container.appendChild(cssRenderer.domElement);
        // * 渲染
        const render = () => {
            requestAnimationFrame(render);
            // 场景渲染
            renderer.render(scene, camera);
            cssRenderer.render(scene, camera);
        }

        render();
    }

    add(node: BaseNode) {
        this._scene.add(node)
    }
}