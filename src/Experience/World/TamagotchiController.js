import * as THREE from 'three'
import Experience from '../Experience.js'

export default class TamagotchiController {
    constructor(robot) {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.gui = this.experience.gui
        this.robot = robot

        this.batteryLevel = 100
        this.batteryDrainRate = 100 / 10 // Battery drains to 0 in 10 seconds
        this.isAlive = true

        this.mixer = new THREE.AnimationMixer(this.robot.model)
        this.actions = {}
        this.activeAction = null
        this.previousAction = null

        this.createBatteryBar()
        this.createFeedButton()
        this.createProgressBar()

        // Initialize animations
        this.initAnimations()

        // Log available morph targets
        this.logMorphTargets()
    }

    createBatteryBar() {
        this.batteryBar = this.gui.add(this, 'batteryLevel', 0, 100).name('Battery Level').listen()
    }

    createFeedButton() {
        this.feedButton = this.gui.add(this, 'feedBattery').name('Feed Battery')
    }

    createProgressBar() {
        const progressBarContainer = document.createElement('div')
        progressBarContainer.className = 'progress-bar-container'
        document.body.appendChild(progressBarContainer)

        this.progressBar = document.createElement('div')
        this.progressBar.className = 'progress-bar'
        progressBarContainer.appendChild(this.progressBar)
    }

    initAnimations() {
        const animations = this.robot.model.animations

        // Create actions for each clip
        for (const clip of animations) {
            const action = this.mixer.clipAction(clip)
            this.actions[clip.name] = action

            // Single-use animations (emotes or states with index >= 4) play once and clamp
            if (['Death'].includes(clip.name)) {
                action.loop = THREE.LoopOnce
                action.clampWhenFinished = true
            }
        }

        // Start the walking animation immediately
        this.fadeToAction('Walking', 0.5)
    }

    fadeToAction(clipName, duration) {
        this.previousAction = this.activeAction
        this.activeAction = this.actions[clipName]

        // Fade out of the old action
        if (this.previousAction && this.previousAction !== this.activeAction) {
            this.previousAction.fadeOut(duration)
        }

        // Fade into the new action
        this.activeAction
            .reset()
            .setEffectiveTimeScale(1)
            .setEffectiveWeight(1)
            .fadeIn(duration)
            .play()
    }

    feedBattery() {
        if (this.isAlive) {
            this.batteryLevel = 100
            this.updateExpression()
        }
    }

    update(deltaTime) {
        if (this.isAlive) {
            this.batteryLevel -= this.batteryDrainRate * deltaTime
            this.updateProgressBar()
            this.updateExpression()
            if (this.batteryLevel <= 0) {
                this.batteryLevel = 0
                this.die()
            }
        }

        if (this.mixer) {
            this.mixer.update(deltaTime)
        }
    }

    updateProgressBar() {
        this.progressBar.style.width = `${this.batteryLevel}%`
        if (this.batteryLevel > 50) {
            this.progressBar.style.backgroundColor = '#61dafb'
        } else if (this.batteryLevel > 20) {
            this.progressBar.style.backgroundColor = '#ffff00'
        } else {
            this.progressBar.style.backgroundColor = '#ff0000'
        }
    }

    logMorphTargets() {
        const face = this.robot.model.getObjectByName('Head_4')
        if (face && face.morphTargetDictionary) {
            console.log('Available morph targets:', face.morphTargetDictionary)
        } else {
            console.warn('No morph targets found for the face.')
        }
    }

    updateExpression() {
        const face = this.robot.model.getObjectByName('Head_4')
        console.log("Hi")
        if (face && face.morphTargetDictionary) {
            console.log("hello")
            console.log('Available morph targets:', face.morphTargetDictionary)
            const sadIndex = face.morphTargetDictionary['Sad']

            if (sadIndex !== undefined) {
                console.log("hola")
                const sadness = 1 - (this.batteryLevel / 100)
                face.morphTargetInfluences[sadIndex] = sadness
            }
        }
    }

    die() {
        this.isAlive = false
        console.log('The robot has died.')
        this.fadeToAction('Death', 0.5)
        // Add any additional logic for when the robot dies
    }
}