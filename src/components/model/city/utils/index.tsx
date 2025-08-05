/**
 * 公共方法
 */
import * as THREE from "three";

const Utils = {
    forMaterial(materials: THREE.Material | THREE.Material[], callback: (material: THREE.Material) => void) {
        if (!callback || !materials) return false;
        if (Array.isArray(materials)) {
            materials.forEach(mat => {
                callback(mat);
            });
        } else {
            callback(materials);
        }
    },
};

export default Utils;
