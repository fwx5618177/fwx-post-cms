import { Card, Select } from 'antd'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { Mesh } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

const { Option } = Select

const CarColor = () => {
    const canvasRef = useRef<HTMLDivElement>(null)

    const colors = ['red', 'blue', 'green', 'gray', 'orange', 'purple']

    const materials = [
        { name: '磨砂', value: 1 },
        { name: '冰晶', value: 0 },
    ]

    // 创建材质
    const bodyMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xff0000,
        metalness: 1,
        roughness: 0.5,
        clearcoat: 1,
        clearcoatRoughness: 0,
    })

    const frontMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xff0000,
        metalness: 1,
        roughness: 0.5,
        clearcoat: 1,
        clearcoatRoughness: 0,
    })
    const hoodMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xff0000,
        metalness: 1,
        roughness: 0.5,
        clearcoat: 1,
        clearcoatRoughness: 0,
    })
    const wheelsMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xff0000,
        metalness: 1,
        roughness: 0.1,
    })
    const glassMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 0,
        roughness: 0,
        transmission: 1,
        transparent: true,
    })

    const selectColor = (
        index,
        material: {
            bodyMaterial: any
            frontMaterial: any
            hoodMaterial: any
            wheelsMaterial: any
        },
    ) => {
        material.bodyMaterial.color.set(colors[index])
        material.frontMaterial.color.set(colors[index])
        material.hoodMaterial.color.set(colors[index])
        material.wheelsMaterial.color.set(colors[index])
        // glassMaterial.color.set(colors[index]);
    }

    const selectMaterial = (
        index,
        material: {
            bodyMaterial: any
            frontMaterial: any
            hoodMaterial: any
            wheelsMaterial: any
        },
    ) => {
        material.bodyMaterial.clearcoatRoughness = materials[index].value
        material.frontMaterial.clearcoatRoughness = materials[index].value
        material.hoodMaterial.clearcoatRoughness = materials[index].value
    }

    const init = () => {
        // 创建场景
        const scene = new THREE.Scene()
        // 创建相机
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
        camera.position.set(0, 2, 6)
        // 创建渲染器
        const renderer = new THREE.WebGLRenderer({
            // 抗锯齿
            antialias: true,
        })

        renderer.setSize(
            (canvasRef.current as HTMLDivElement).clientWidth,
            (canvasRef.current as HTMLDivElement).clientHeight,
        )

        const wheels: any[] = []
        let carBody,
            frontCar,
            hoodCar,
            glassCar

            // 把渲染器插入到dom中
            // console.log(canvasDom.value);
        ;(canvasRef.current as HTMLDivElement).appendChild(renderer.domElement)

        // 初始化渲染器，渲染背景
        renderer.setClearColor('#000')
        scene.background = new THREE.Color('#ccc')
        // scene.environment = new THREE.Color('#ccc')

        // 添加网格地面
        const gridHelper = new THREE.GridHelper(10, 10)
        ;(gridHelper.material as THREE.Material).opacity = 0.2
        ;(gridHelper.material as THREE.Material).transparent = true
        scene.add(gridHelper)

        // 添加控制器
        const controls = new OrbitControls(camera, renderer.domElement)
        controls.update()

        // 添加gltf汽车模型
        const loader = new GLTFLoader()
        const dracoLoader = new DRACOLoader()
        dracoLoader.setDecoderPath('https://moxi-blog-1252315781.cos.ap-shanghai.myqcloud.com/3DModel/car/draco/')
        loader.setDRACOLoader(dracoLoader)
        loader.load(
            'https://moxi-blog-1252315781.cos.ap-shanghai.myqcloud.com/3DModel/car/rc-upload-1661348723298-2_bmw01.glb',
            (gltf: GLTF) => {
                const bmw: THREE.Group = gltf.scene

                bmw.traverse((child: THREE.Object3D<THREE.Event>) => {
                    if ((child as Mesh).isMesh) {
                        console.log(child.name)
                    }
                    // 判断是否是轮毂
                    if ((child as Mesh).isMesh && child.name.includes('轮毂')) {
                        ;(child as Mesh).material = wheelsMaterial
                        wheels.push(child)
                    }
                    // 判断是否是车身
                    if ((child as Mesh).isMesh && child.name.includes('Mesh002')) {
                        carBody = child
                        carBody.material = bodyMaterial
                    }
                    // 判断是否是前脸
                    if ((child as Mesh).isMesh && child.name.includes('前脸')) {
                        ;(child as Mesh).material = frontMaterial
                        frontCar = child
                    }
                    // 判断是否是引擎盖
                    if ((child as Mesh).isMesh && child.name.includes('引擎盖_1')) {
                        ;(child as Mesh).material = hoodMaterial
                        hoodCar = child
                    }
                    // 判断是否是挡风玻璃
                    if ((child as Mesh).isMesh && child.name.includes('挡风玻璃')) {
                        ;(child as Mesh).material = glassMaterial
                        glassCar = child
                    }
                })
                scene.add(bmw)
            },
        )

        // 添加灯光
        const light1 = new THREE.DirectionalLight(0xffffff, 1)
        light1.position.set(0, 0, 10)
        scene.add(light1)
        const light2 = new THREE.DirectionalLight(0xffffff, 1)
        light2.position.set(0, 0, -10)
        scene.add(light2)
        const light3 = new THREE.DirectionalLight(0xffffff, 1)
        light3.position.set(10, 0, 0)
        scene.add(light3)
        const light4 = new THREE.DirectionalLight(0xffffff, 1)
        light4.position.set(-10, 0, 0)
        scene.add(light4)
        const light5 = new THREE.DirectionalLight(0xffffff, 1)
        light5.position.set(0, 10, 0)
        scene.add(light5)
        const light6 = new THREE.DirectionalLight(0xffffff, 0.3)
        light6.position.set(5, 10, 0)
        scene.add(light6)
        const light7 = new THREE.DirectionalLight(0xffffff, 0.3)
        light7.position.set(0, 10, 5)
        scene.add(light7)
        const light8 = new THREE.DirectionalLight(0xffffff, 0.3)
        light8.position.set(0, 10, -5)
        scene.add(light8)
        const light9 = new THREE.DirectionalLight(0xffffff, 0.3)
        light9.position.set(-5, 10, 0)
        scene.add(light9)

        const render = () => {
            renderer.render(scene, camera)
            controls && controls.update()
            requestAnimationFrame(render)
        }

        render()

        window.addEventListener('resize', () => {
            //   console.log("画面变化了");
            // 更新摄像头
            camera.aspect = window.innerWidth / window.innerHeight
            //   更新摄像机的投影矩阵
            camera.updateProjectionMatrix()

            //   更新渲染器
            renderer.setSize(window.innerWidth, window.innerHeight)

            //   设置渲染器的像素比
            renderer.setPixelRatio(window.devicePixelRatio)
        })
    }

    useEffect(() => {
        init()
    }, [])

    return (
        <>
            <h3
                style={{
                    margin: 12,
                }}
            >
                汽车模型
            </h3>

            <Card
                style={{
                    margin: 12,
                }}
            >
                <div className='home-content-title'>
                    <h1>汽车展示与选配</h1>
                </div>
                <h2>选择车身颜色</h2>
                <Select
                    placeholder='Select'
                    defaultValue={0}
                    onSelect={values =>
                        selectColor(values, {
                            bodyMaterial,
                            frontMaterial,
                            hoodMaterial,
                            wheelsMaterial,
                        })
                    }
                >
                    {colors?.map((ci, index) => (
                        <Option key={index + '_scolor'} value={index}>
                            {ci}
                        </Option>
                    ))}
                </Select>

                <h2>选择贴膜材质</h2>
                <Select
                    placeholder='Select'
                    onSelect={values =>
                        selectMaterial(values, {
                            bodyMaterial,
                            frontMaterial,
                            hoodMaterial,
                            wheelsMaterial,
                        })
                    }
                >
                    {materials?.map((ci, index) => (
                        <Option key={index + '_scolor'} value={ci.value}>
                            {ci.name}
                        </Option>
                    ))}
                </Select>
            </Card>

            <div
                style={{
                    margin: 12,
                    width: '100vw',
                    height: '100vh',
                }}
                ref={canvasRef}
            ></div>
        </>
    )
}

export default CarColor
