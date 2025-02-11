import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import Experience from '../Experience.js'
import EventEmitter from '../Utils/EventEmitter.js'

export default class Box extends EventEmitter {
    constructor() {
        super()
        this.experience = new Experience()
        this.scene = this.experience.scene

        // Load the model
        this.loadModel()
    }

    loadModel() {
        const loader = new GLTFLoader()
        loader.load('models/GiftBox/gift_loot_box_thing_wip.glb', (gltf) => {
            this.model = gltf.scene
            this.model.scale.set(0.5, 0.5, 0.5)
            this.scene.add(this.model)

            // Rename the animation
            gltf.animations.forEach((clip) => {
                if (clip.name === 'Take 001') {
                    clip.name = 'Hatch'
                }
            })

            // Log available animations
            console.log('Available animations for Box:', gltf.animations.map(anim => anim.name))

            // Store animations
            this.animations = gltf.animations
            this.mixer = new THREE.AnimationMixer(this.model)

            // Add a button to trigger the animation after 10 seconds
            this.hatchButton = this.experience.gui.add({ triggerAnimation: () => this.triggerAnimation() }, 'triggerAnimation').name('Hatch in 10s')
        }, undefined, (e) => {
            console.error(e)
        })
    }

    triggerAnimation() {
        setTimeout(() => {
            this.playAnimation('Hatch')
        }, 1000)
    }

    playAnimation(name) {
        const clip = THREE.AnimationClip.findByName(this.animations, name)
        if (clip) {
            const action = this.mixer.clipAction(clip)
            action.reset().play()
            action.clampWhenFinished = true
            action.loop = THREE.LoopOnce

            // Listen for the finished event
            this.mixer.addEventListener('finished', () => {
                this.onAnimationFinished()
            })
        } else {
            console.warn(`Animation ${name} not found`)
        }
    }

    onAnimationFinished() {
        // Remove the box from the scene
        this.scene.remove(this.model)
        this.model.traverse((child) => {
            if (child.geometry) child.geometry.dispose()
            if (child.material) {
                if (Array.isArray(child.material)) {
                    child.material.forEach((material) => material.dispose())
                } else {
                    child.material.dispose()
                }
            }
        })
        this.model = null

        // Remove the hatch button from the GUI
        this.hatchButton.destroy()

        // Emit an event to notify that the box animation is finished
        this.trigger('boxHatched')
    }

    update(deltaTime) {
        if (this.mixer) {
            this.mixer.update(deltaTime)
        }
    }
}