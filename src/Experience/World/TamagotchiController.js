import * as THREE from 'three'
import Experience from '../Experience.js'

export default class TamagotchiController {
    constructor(robot) {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.gui = this.experience.gui
        this.robot = robot

        this.batteryLevel = 100
        this.batteryDrainRate = 100 / 300 // Battery drains to 0 in 300 seconds (5 minutes)
        this.isAlive = true
        this.currentMode = 'feed' // Default mode
        this.wasteObjects = []

        this.mixer = new THREE.AnimationMixer(this.robot.model)
        this.actions = {}
        this.activeAction = null
        this.previousAction = null

        this.createButtons()
        this.createProgressBar()
        this.createModeIndicator()
        this.createResetButton()

        // Initialize animations
        this.initAnimations()

        // Log available morph targets
        this.logMorphTargets()

        // Start waste creation loop
        this.startWasteCreation()
    }

    createButtons() {
        this.gui.add(this, 'toggleMode').name('Toggle Mode')
        this.gui.add(this, 'performAction').name('Perform Action')
        this.gui.add(this, 'cancelAction').name('Cancel Action')
    }

    createProgressBar() {
        const progressBarContainer = document.createElement('div')
        progressBarContainer.className = 'progress-bar-container'
        document.body.appendChild(progressBarContainer)

        this.progressBar = document.createElement('div')
        this.progressBar.className = 'progress-bar'
        progressBarContainer.appendChild(this.progressBar)
    }

    createModeIndicator() {
        this.modeIndicator = document.createElement('div')
        this.modeIndicator.className = 'mode-indicator'
        this.modeIndicator.style.position = 'absolute'
        this.modeIndicator.style.top = '50px'
        this.modeIndicator.style.left = '10px'
        this.modeIndicator.style.color = '#fff'
        this.modeIndicator.style.fontFamily = 'Arial, sans-serif'
        this.modeIndicator.style.fontSize = '20px'
        document.body.appendChild(this.modeIndicator)
        this.updateModeIndicator()
    }

    updateModeIndicator() {
        this.modeIndicator.innerText = `Current Mode: ${this.currentMode}`
    }

    createResetButton() {
        this.resetButton = document.createElement('button')
        this.resetButton.className = 'reset-button'
        this.resetButton.innerText = 'Reset'
        this.resetButton.style.position = 'absolute'
        this.resetButton.style.bottom = '10px'
        this.resetButton.style.right = '10px'
        this.resetButton.style.padding = '10px'
        this.resetButton.style.backgroundColor = '#ff0000'
        this.resetButton.style.color = '#fff'
        this.resetButton.style.border = 'none'
        this.resetButton.style.cursor = 'pointer'
        this.resetButton.style.display = 'none' // Initially hidden
        this.resetButton.onclick = () => this.reset()
        document.body.appendChild(this.resetButton)
    }

    showResetButton() {
        if (this.resetButton) {
            this.resetButton.style.display = 'block'
        }
    }

    initAnimations() {
        const animations = this.robot.model.animations

        // Create actions for each clip
        for (const clip of animations) {
            const action = this.mixer.clipAction(clip)
            this.actions[clip.name] = action

            // Single-use animations (emotes or states with index >= 4) play once and clamp
            if (['Death', 'Dance', 'ThumbsUp', 'Jump'].includes(clip.name)) {
                action.loop = THREE.LoopOnce
                action.clampWhenFinished = true
            }
        }

        // Start the walking animation immediately
        this.fadeToAction('Walking', 0.5)
    }

    fadeToAction(clipName, duration) {
        if (!this.isAlive && clipName !== 'Death') {
            return
        }

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

    toggleMode() {
        const modes = ['feed', 'play', 'clean']
        const currentIndex = modes.indexOf(this.currentMode)
        this.currentMode = modes[(currentIndex + 1) % modes.length]
        console.log(`Current mode: ${this.currentMode}`)
        this.updateModeIndicator()
    }

    performAction() {
        if (!this.isAlive) return

        switch (this.currentMode) {
            case 'feed':
                this.feedBattery()
                this.playJumpAnimation() // Play jump animation when fed
                break
            case 'play':
                this.playDanceAnimation() // Make the robot dance in play mode
                break
            case 'clean':
                this.cleanRobot()
                break
        }
    }

    playJumpAnimation() {
        this.fadeToAction('Jump', 0.5)
        const onJumpFinished = () => {
            this.mixer.removeEventListener('finished', onJumpFinished)
            this.restoreWalking()
        }
        this.mixer.addEventListener('finished', onJumpFinished)
    }

    cancelAction() {
        console.log('Action canceled')
        // Reset to default mode
        this.currentMode = 'feed'
        this.updateModeIndicator()
    }

    feedBattery() {
        if (this.isAlive) {
            this.batteryLevel = 100
            this.updateExpression()
        }
    }

    cleanRobot() {
        console.log('Cleaning the robot')
        this.wasteObjects.forEach(waste => {
            this.scene.remove(waste)
        })
        this.wasteObjects = []
        this.playThumbsUpAnimation()
    }

    playDanceAnimation() {
        this.fadeToAction('Dance', 0.5)
        const onDanceFinished = () => {
            this.mixer.removeEventListener('finished', onDanceFinished)
            this.restoreWalking()
        }
        this.mixer.addEventListener('finished', onDanceFinished)
    }

    playThumbsUpAnimation() {
        this.fadeToAction('ThumbsUp', 0.5)
        const onThumbsUpFinished = () => {
            this.mixer.removeEventListener('finished', onThumbsUpFinished)
            this.restoreWalking()
        }
        this.mixer.addEventListener('finished', onThumbsUpFinished)
    }

    restoreWalking() {
        if (this.isAlive) {
            this.fadeToAction('Walking', 0.5)
        }
    }

    startWasteCreation() {
        this.wasteCreationInterval = setInterval(() => {
            if (this.isAlive) {
                this.createWaste()
            }
        }, 15000) // Create waste every 15 seconds
    }

    createWaste() {
        const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5)
        const material = new THREE.MeshStandardMaterial({ color: 0x654321 })
        const waste = new THREE.Mesh(geometry, material)
        const robotPosition = this.robot.model.position
        const robotDirection = new THREE.Vector3()
        this.robot.model.getWorldDirection(robotDirection)

        // Generate random positions behind the robot
        let position
        let overlap
        do {
            const offsetX = (Math.random() - 0.5) * 2 // Random offset between -1 and 1
            const offsetZ = (Math.random() - 0.5) * 2 // Random offset between -1 and 1
            position = new THREE.Vector3(
                robotPosition.x - robotDirection.x * 2 + offsetX,
                0.25,
                robotPosition.z - robotDirection.z * 2 + offsetZ
            )

            // Check for overlap with existing waste objects
            overlap = this.wasteObjects.some(wasteObj => wasteObj.position.distanceTo(position) < 1)
        } while (overlap)

        waste.position.copy(position)
        this.scene.add(waste)
        this.wasteObjects.push(waste)
    }

    update(deltaTime) {
        if (this.isAlive) {
            this.batteryLevel -= this.batteryDrainRate * deltaTime
            this.updateProgressBar()
            this.updateExpression()
            this.updateLightIntensity()
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

    updateLightIntensity() {
        const intensity = this.batteryLevel / 100
        this.experience.world.lights.updateLightIntensity(intensity)
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
        if (face && face.morphTargetDictionary) {
            const sadIndex = face.morphTargetDictionary['Sad']

            if (sadIndex !== undefined) {
                const sadness = 1 - (this.batteryLevel / 100)
                face.morphTargetInfluences[sadIndex] = sadness
            }
        }
    }

    die() {
        this.isAlive = false
        console.log('The robot has died.')
        this.fadeToAction('Death', 0.5)
        this.showResetButton()
        clearInterval(this.wasteCreationInterval) // Stop waste creation
    }

    reset() {
        console.log('Resetting the Tamagotchi...')
        this.batteryLevel = 100
        this.isAlive = true
        this.currentMode = 'feed'
        this.updateModeIndicator()
        this.updateProgressBar()
        this.updateExpression()
        this.updateLightIntensity()
        this.fadeToAction('Walking', 0.5)
        if (this.resetButton) {
            this.resetButton.style.display = 'none'
        }
        // Clear any waste from the scene
        this.wasteObjects.forEach(waste => {
            this.scene.remove(waste)
        })
        this.wasteObjects = []
        this.startWasteCreation() // Restart waste creation
    }
}