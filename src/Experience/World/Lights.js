import * as THREE from 'three'
import Experience from '../Experience.js'

export default class Lights {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.setLights()
    }

    setLights() {
        this.hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.5)
        this.hemiLight.position.set(0, 20, 0)
        this.scene.add(this.hemiLight)

        this.dirLight = new THREE.DirectionalLight(0xffffff, 1)
        this.dirLight.position.set(3, 10, 10)
        this.dirLight.castShadow = true
        this.dirLight.shadow.camera.top = 10
        this.dirLight.shadow.camera.bottom = -10
        this.dirLight.shadow.camera.left = -10
        this.dirLight.shadow.camera.right = 10
        this.scene.add(this.dirLight)
    }

    updateLightIntensity(intensity) {
        this.hemiLight.intensity = Math.max(intensity, 0.2) // Do not go to total darkness
        this.dirLight.intensity = Math.max(intensity, 0.2) // Do not go to total darkness
    }
}