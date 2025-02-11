import * as THREE from 'three'
import Experience from '../Experience.js'

export default class Lights {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.setLights()
    }

    setLights() {
        const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.5)
        hemiLight.position.set(0, 20, 0)
        this.scene.add(hemiLight)

        const dirLight = new THREE.DirectionalLight(0xffffff, 1)
        dirLight.position.set(3, 10, 10)
        dirLight.castShadow = true
        dirLight.shadow.camera.top = 10
        dirLight.shadow.camera.bottom = -10
        dirLight.shadow.camera.left = -10
        dirLight.shadow.camera.right = 10
        this.scene.add(dirLight)
    }
}