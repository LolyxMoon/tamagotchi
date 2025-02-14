import * as THREE from 'three'
import Experience from './Experience.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

export default class Camera {
    constructor() {
        this.experience = new Experience()
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.canvas = this.experience.canvas

        this.setInstance()
        this.setControls()
    }

    setInstance() {
        this.instance = new THREE.PerspectiveCamera(45, this.sizes.width / this.sizes.height, 0.1, 100)
        this.instance.position.set(-10, 6, 20) // Adjusted camera position
        this.instance.lookAt(0, 2, 0)
        this.scene.add(this.instance)
    }

    setControls() {
        this.controls = new OrbitControls(this.instance, this.canvas)
        this.controls.enableDamping = true
        this.controls.minPolarAngle = Math.PI / 4 // Prevent camera from rotating below the floor
        this.controls.maxPolarAngle = Math.PI / 2 // Prevent camera from rotating above the horizon
        this.controls.minDistance = 5 // Minimum zoom distance
        this.controls.maxDistance = 30 // Maximum zoom distance
        this.controls.minAzimuthAngle = -Math.PI / 2 // Restrict rotation to prevent scene disappearance
        this.controls.maxAzimuthAngle = Math.PI / 2 // Restrict rotation to prevent scene disappearance
    }

    resize() {
        this.instance.aspect = this.sizes.width / this.sizes.height
        this.instance.updateProjectionMatrix()
    }

    update() {
        if (this.controls) {
            this.controls.update()
        }
    }
}