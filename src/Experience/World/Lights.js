import * as THREE from 'three'
import Experience from '../Experience'

export default class Lights {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.setLights()
    }

    setLights() {
        const hemiLight = new THREE.HemisphereLight(0xffffff, 0x8d8d8d, 3)
        hemiLight.position.set(0, 20, 0)
        this.scene.add(hemiLight)

        const dirLight = new THREE.DirectionalLight(0xffffff, 3)
        dirLight.position.set(0, 20, 10)
        this.scene.add(dirLight)
    }
}