import Experience from '../Experience.js'
import Lights from './Lights.js'
import Floor from './Floor.js'
import Box from './Box.js'
import Robot from './Robot.js'

export default class World {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene

        // Setup
        this.lights = new Lights()
        this.floor = new Floor()
        this.box = new Box()
        this.robot = new Robot()

        this.box.on('boxHatched', () => {
            console.log("Box hatched, loading robot...")
            this.robot.loadModel()
        })
    }

    update(deltaTime) {
        if (this.box) {
            this.box.update(deltaTime)
        }
        if (this.robot) {
            this.robot.update(deltaTime)
        }
    }
}