import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { Reflector } from "three/examples/jsm/objects/Reflector";

const RobotCircle: React.FC = () => {
    const canvasRef = useRef<HTMLDivElement>(null);

    const init = () => {
        // 创建场景
        const scene = new THREE.Scene();
        // 创建相机
        const camera = new THREE.PerspectiveCamera(
            75,
            (canvasRef.current as HTMLDivElement).clientWidth / (canvasRef.current as HTMLDivElement).clientHeight,
            0.1,
            1000,
        );
        camera.position.set(0, 1.5, 6);
        // 创建渲染器
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(
            (canvasRef.current as HTMLDivElement).clientWidth,
            (canvasRef.current as HTMLDivElement).clientHeight,
        );
        (canvasRef.current as HTMLDivElement).appendChild(renderer.domElement);

        // 创建辅助坐标轴
        const axes = new THREE.AxesHelper(5);
        scene.add(axes);

        // 添加控制器

        // 创建rgbe加载器
        const hdrLoader = new RGBELoader();
        hdrLoader.load(
            "https://moxi-blog-1252315781.cos.ap-shanghai.myqcloud.com/3DModel/RobotCircle/rc-upload-1661268975737-4_sky12.hdr",
            texture => {
                texture.mapping = THREE.EquirectangularReflectionMapping;
                scene.background = texture;
                scene.environment = texture;
            },
        );

        // 添加机器人
        // 设置解压缩的加载器
        const dracoLoader = new DRACOLoader();
        // dracoLoader.setDecoderPath('../../../../extends/draco/')
        dracoLoader.setDecoderPath(
            "https://moxi-blog-1252315781.cos.ap-shanghai.myqcloud.com/3DModel/RobotCircle/draco/",
        );

        dracoLoader.setDecoderConfig({ type: "js" });
        const gltfLoader = new GLTFLoader();
        gltfLoader.setDRACOLoader(dracoLoader);
        gltfLoader.load(
            "https://moxi-blog-1252315781.cos.ap-shanghai.myqcloud.com/3DModel/RobotCircle/rc-upload-1661268975737-2_robot.glb",
            gltf => {
                scene.add(gltf.scene);
            },
        );
        // 添加直线光
        const light1 = new THREE.DirectionalLight(0xffffff, 0.3);
        light1.position.set(0, 10, 10);
        const light2 = new THREE.DirectionalLight(0xffffff, 0.3);
        light1.position.set(0, 10, -10);
        const light3 = new THREE.DirectionalLight(0xffffff, 0.8);
        light1.position.set(10, 10, 10);
        scene.add(light1, light2, light3);

        // 添加光阵
        const video = document.createElement("video");
        video.src =
            "https://moxi-blog-1252315781.cos.ap-shanghai.myqcloud.com/3DModel/RobotCircle/rc-upload-1661268975737-6_zp2.mp4";
        video.loop = true;
        video.muted = true;
        video.crossOrigin = "anonymous";
        video.play();
        const videoTexture = new THREE.VideoTexture(video);
        const videoGeoPlane = new THREE.PlaneBufferGeometry(8, 4.5);
        const videoMaterial = new THREE.MeshBasicMaterial({
            map: videoTexture,
            transparent: true,
            side: THREE.DoubleSide,
            alphaMap: videoTexture,
        });
        const videoMesh = new THREE.Mesh(videoGeoPlane, videoMaterial);
        videoMesh.position.set(0, 0.2, 0);
        videoMesh.rotation.set(-Math.PI / 2, 0, 0);
        scene.add(videoMesh);

        // 添加镜面反射
        const reflectorGeometry = new THREE.PlaneBufferGeometry(100, 100);
        const reflectorPlane = new Reflector(reflectorGeometry, {
            textureWidth: window.innerWidth,
            textureHeight: window.innerHeight,
            color: 0x332222,
        });
        reflectorPlane.rotation.x = -Math.PI / 2;
        scene.add(reflectorPlane);

        const render = () => {
            requestAnimationFrame(render);
            renderer.render(scene, camera);
        };

        render();

        window.addEventListener("resize", () => {
            //   console.log("画面变化了");
            // 更新摄像头
            camera.aspect = window.innerWidth / window.innerHeight;
            //   更新摄像机的投影矩阵
            camera.updateProjectionMatrix();

            //   更新渲染器
            renderer.setSize(window.innerWidth, window.innerHeight);
            //   设置渲染器的像素比
            renderer.setPixelRatio(window.devicePixelRatio);
        });
    };

    useEffect(() => {
        init();
    }, []);

    return (
        <>
            <h3
                style={{
                    margin: 12,
                }}
            >
                球形机器人
            </h3>

            <div
                style={{
                    margin: 12,
                    width: "100vw",
                    height: "100vh",
                }}
                ref={canvasRef}
            ></div>
        </>
    );
};

export default RobotCircle;
