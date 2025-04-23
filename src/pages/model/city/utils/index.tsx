/**
 * 公共方法
 */
// import * as THREE from 'three'

const Utils = {
    forMaterial(materials: any[], callback: { (material: any): void; (material: any): void; (arg0: any): void }) {
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
