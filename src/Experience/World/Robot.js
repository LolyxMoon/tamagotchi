import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import Experience from '../Experience.js'
import TamagotchiControllerDebug from './TamagotchiController.debug.js'

export default class Robot {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.tamagotchiController = null
    }

    loadModel() {
        const loader = new GLTFLoader()
        loader.load('models/RobotExpressive/RobotExpressive.glb', (gltf) => {
            this.model = gltf.scene
            this.model.animations = gltf.animations
            console.log("Robot animations:", gltf.animations)
            this.scene.add(this.model) // Ensure the model is added to the scene

            // Initialize the TamagotchiControllerDebug
            this.tamagotchiController = new TamagotchiControllerDebug(this)
        }, undefined, (e) => {
            console.error(e)
        })
    }

    update(deltaTime) {
        if (this.tamagotchiController) {
            this.tamagotchiController.update(deltaTime)
        }
    }
}