import * as THREE from 'three'
const Effect = {
    // 获取到包围的线条
    surroundLineGeometry(object: any) {
        return new THREE.EdgesGeometry(object.geometry)
    },
}

export default Effect
