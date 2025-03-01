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

        // Create the hatching message div
        this.createHatchingMessage()
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
            this.hatchButton = this.experience.gui.add({ triggerAnimation: () => this.triggerAnimation() }, 'triggerAnimation').name('Hatch')
        }, undefined, (e) => {
            console.error(e)
        })

        // Load the hatch sound
        this.hatchSound = new Audio('sounds/pop.wav')
    }

    createHatchingMessage() {
        this.hatchingMessage = document.createElement('div')
        this.hatchingMessage.className = 'hatching-message'
        this.hatchingMessage.innerText = 'Hatching...'
        document.body.appendChild(this.hatchingMessage)
    }

    showHatchingMessage() {
        if (this.hatchingMessage) {
            this.hatchingMessage.style.display = 'block'
        }
    }

    hideHatchingMessage() {
        if (this.hatchingMessage) {
            this.hatchingMessage.style.display = 'none'
        }
    }

    playHatchSound() {
        if (this.hatchSound) {
            this.hatchSound.play()
        }
    }

    onAnimationFinished() {
        // Remove the box from the scene
        if (this.model) {
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
        }

        // Remove the hatch button from the GUI
        if (this.hatchButton) {
            this.hatchButton.destroy()
            this.hatchButton = null
        }

        // Hide the hatching message
        this.hideHatchingMessage()

        // Emit an event to notify that the box animation is finished
        this.trigger('boxHatched')
    }

    triggerAnimation() {
        if (this.hatchButton) {
            this.hatchButton.disable() // Disable the button to prevent multiple triggers
        }
        this.showHatchingMessage() // Show the hatching message
        setTimeout(() => {
            this.playAnimation('Hatch')
        }, 10000) // Hatch after 10 seconds
    }

    playAnimation(name) {
        const clip = THREE.AnimationClip.findByName(this.animations, name)
        if (clip) {
            const action = this.mixer.clipAction(clip)
            action.reset().play()
            action.clampWhenFinished = true
            action.loop = THREE.LoopOnce

            // Play the hatch sound a bit earlier to synchronize with the animation
            setTimeout(() => {
                this.playHatchSound()
            }, 500) // Adjust the timing as needed

            // Listen for the finished event
            this.mixer.addEventListener('finished', () => {
                this.onAnimationFinished()
            })
        } else {
            console.warn(`Animation ${name} not found`)
        }
    }

    update(deltaTime) {
        if (this.mixer) {
            this.mixer.update(deltaTime)
        }
    }
}