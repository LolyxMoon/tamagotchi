import * as THREE from 'three'
import Stats from 'three/examples/jsm/libs/stats.module.js'
import { GUI } from 'lil-gui'

import Sizes from './Utils/Sizes.js'
import Time from './Utils/Time.js'
import Camera from './Camera.js'
import Renderer from './Renderer.js'
import World from './World/World.js'

let instance = null

export default class Experience {
    constructor(_canvas) {
        // Singleton
        if (instance) {
            return instance
        }
        instance = this

        // Global access
        this.canvas = _canvas

        // Setup
        this.sizes = new Sizes()
        this.time = new Time()
        this.scene = new THREE.Scene()
        this.camera = new Camera(this)
        this.renderer = new Renderer(this)
        this.gui = new GUI()
        this.world = new World(this)

        // Events
        this.sizes.on('resize', () => {
            this.resize()
        })

        this.time.on('tick', () => {
            this.update()
        })

        // Stats
        // this.stats = new Stats()
        // document.body.appendChild(this.stats.dom)
    }

    resize() {
        this.camera.resize()
        this.renderer.resize()
    }

    update() {
        const deltaTime = this.time.delta

        this.world.update(deltaTime)
       
        // this.stats.update()

        this.renderer.update()
    }
}