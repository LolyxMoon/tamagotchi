import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import Experience from '../Experience.js'
import RobotController from './RobotController.js'

export default class Robot {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.robotController = new RobotController()
    }

    loadModel() {
        const loader = new GLTFLoader()
        loader.load('models/RobotExpressive/RobotExpressive.glb', (gltf) => {
            this.model = gltf.scene
            //this.model.scale.set(0.9, 0.9, 0.9)
            console.log("Robot animations:", gltf.animations)
            this.robotController.addRobotToGUI(this.model, gltf.animations)
            this.scene.add(this.model) // Ensure the model is added to the scene

            // Ensure the robot starts with the walking animation
            this.robotController.fadeToAction('Walking', 0.5)
        }, undefined, (e) => {
            console.error(e)
        })
    }

    update(deltaTime) {
        this.robotController.update(deltaTime)
    }
}