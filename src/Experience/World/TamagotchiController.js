// import * as THREE from 'three'
// import Experience from '../Experience.js'

// export default class TamagotchiController {
//     constructor(robot) {
//         this.experience = new Experience()
//         this.scene = this.experience.scene
//         this.gui = this.experience.gui
//         this.robot = robot

//         this.batteryLevel = 100
//         this.batteryDrainRate = 100 / 10 // Battery drains to 0 in 10 seconds
//         this.isAlive = true
//         this.currentMode = 'feed' // Default mode

//         this.mixer = new THREE.AnimationMixer(this.robot.model)
//         this.actions = {}
//         this.activeAction = null
//         this.previousAction = null

//         this.createBatteryBar()
//         this.createButtons()
//         this.createProgressBar()

//         // Initialize animations
//         this.initAnimations()

//         // Log available morph targets
//         this.logMorphTargets()
//     }

//     createBatteryBar() {
//         this.batteryBar = this.gui.add(this, 'batteryLevel', 0, 100).name('Battery Level').listen()
//     }

//     createButtons() {
//         this.buttonA = this.gui.add(this, 'toggleMode').name('Toggle Mode')
//         this.buttonB = this.gui.add(this, 'performAction').name('Perform Action')
//         this.buttonC = this.gui.add(this, 'cancelAction').name('Cancel Action')
//     }

//     createProgressBar() {
//         const progressBarContainer = document.createElement('div')
//         progressBarContainer.className = 'progress-bar-container'
//         document.body.appendChild(progressBarContainer)

//         this.progressBar = document.createElement('div')
//         this.progressBar.className = 'progress-bar'
//         progressBarContainer.appendChild(this.progressBar)
//     }

//     initAnimations() {
//         const animations = this.robot.model.animations

//         // Create actions for each clip
//         for (const clip of animations) {
//             const action = this.mixer.clipAction(clip)
//             this.actions[clip.name] = action

//             // Single-use animations (emotes or states with index >= 4) play once and clamp
//             if (['Death', 'Dance'].includes(clip.name)) {
//                 action.loop = THREE.LoopOnce
//                 action.clampWhenFinished = true
//             }
//         }

//         // Start the walking animation immediately
//         this.fadeToAction('Walking', 0.5)
//     }

//     fadeToAction(clipName, duration) {
//         if (!this.isAlive && clipName !== 'Death') {
//             return
//         }

//         this.previousAction = this.activeAction
//         this.activeAction = this.actions[clipName]

//         // Fade out of the old action
//         if (this.previousAction && this.previousAction !== this.activeAction) {
//             this.previousAction.fadeOut(duration)
//         }

//         // Fade into the new action
//         this.activeAction
//             .reset()
//             .setEffectiveTimeScale(1)
//             .setEffectiveWeight(1)
//             .fadeIn(duration)
//             .play()
//     }

//     toggleMode() {
//         const modes = ['feed', 'play', 'clean']
//         const currentIndex = modes.indexOf(this.currentMode)
//         this.currentMode = modes[(currentIndex + 1) % modes.length]
//         console.log(`Current mode: ${this.currentMode}`)
//     }

//     performAction() {
//         if (!this.isAlive) return

//         switch (this.currentMode) {
//             case 'feed':
//                 this.feedBattery()
//                 break
//             case 'play':
//                 this.playWithRobot()
//                 break
//             case 'clean':
//                 this.cleanRobot()
//                 break
//         }
//     }

//     cancelAction() {
//         console.log('Action canceled')
//         // Implement any cancel logic if needed
//     }

//     feedBattery() {
//         if (this.isAlive) {
//             this.batteryLevel = 100
//             this.updateExpression()
//             this.playDanceAnimation()
//         }
//     }

//     playWithRobot() {
//         console.log('Playing with the robot')
//         // Implement play logic (e.g., play a specific animation)
//     }

//     cleanRobot() {
//         console.log('Cleaning the robot')
//         // Implement clean logic (e.g., play a specific animation)
//     }

//     playDanceAnimation() {
//         this.fadeToAction('Dance', 0.5)
//         this.mixer.addEventListener('finished', this.restoreWalking())
//     }

//     restoreWalking() {
//         return () => {
//             if (this.mixer) {
//                 this.mixer.removeEventListener('finished', this.restoreWalking())
//             }
//             if (this.isAlive) {
//                 this.fadeToAction('Walking', 0.5)
//             }
//         }
//     }

//     update(deltaTime) {
//         if (this.isAlive) {
//             this.batteryLevel -= this.batteryDrainRate * deltaTime
//             this.updateProgressBar()
//             this.updateExpression()
//             if (this.batteryLevel <= 0) {
//                 this.batteryLevel = 0
//                 this.die()
//             }
//         }

//         if (this.mixer) {
//             this.mixer.update(deltaTime)
//         }
//     }

//     updateProgressBar() {
//         this.progressBar.style.width = `${this.batteryLevel}%`
//         if (this.batteryLevel > 50) {
//             this.progressBar.style.backgroundColor = '#61dafb'
//         } else if (this.batteryLevel > 20) {
//             this.progressBar.style.backgroundColor = '#ffff00'
//         } else {
//             this.progressBar.style.backgroundColor = '#ff0000'
//         }
//     }

//     logMorphTargets() {
//         const face = this.robot.model.getObjectByName('Head_4')
//         if (face && face.morphTargetDictionary) {
//             console.log('Available morph targets:', face.morphTargetDictionary)
//         } else {
//             console.warn('No morph targets found for the face.')
//         }
//     }

//     updateExpression() {
//         const face = this.robot.model.getObjectByName('Head_4')
//         if (face && face.morphTargetDictionary) {
//             const sadIndex = face.morphTargetDictionary['Sad']

//             if (sadIndex !== undefined) {
//                 const sadness = 1 - (this.batteryLevel / 100)
//                 face.morphTargetInfluences[sadIndex] = sadness
//             }
//         }
//     }

//     die() {
//         this.isAlive = false
//         console.log('The robot has died.')
//         this.fadeToAction('Death', 0.5)
//         // Add any additional logic for when the robot dies
//     }
// }

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
        this.currentMode = 'feed' // Default mode
        this.wasteObjects = []

        this.mixer = new THREE.AnimationMixer(this.robot.model)
        this.actions = {}
        this.activeAction = null
        this.previousAction = null

        this.createBatteryBar()
        this.createButtons()
        this.createProgressBar()

        // Initialize animations
        this.initAnimations()

        // Log available morph targets
        this.logMorphTargets()

        // Start waste creation loop
        this.startWasteCreation()
    }

    createBatteryBar() {
        this.batteryBar = this.gui.add(this, 'batteryLevel', 0, 100).name('Battery Level').listen()
    }

    createButtons() {
        this.buttonA = this.gui.add(this, 'toggleMode').name('Toggle Mode')
        this.buttonB = this.gui.add(this, 'performAction').name('Perform Action')
        this.buttonC = this.gui.add(this, 'cancelAction').name('Cancel Action')
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
            if (['Death', 'Dance'].includes(clip.name)) {
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
    }

    performAction() {
        if (!this.isAlive) return

        switch (this.currentMode) {
            case 'feed':
                this.feedBattery()
                break
            case 'play':
                this.playWithRobot()
                break
            case 'clean':
                this.cleanRobot()
                break
        }
    }

    cancelAction() {
        console.log('Action canceled')
        // Implement any cancel logic if needed
    }

    feedBattery() {
        if (this.isAlive) {
            this.batteryLevel = 100
            this.updateExpression()
            this.playDanceAnimation()
        }
    }

    playWithRobot() {
        console.log('Playing with the robot')
        // Implement play logic (e.g., play a specific animation)
    }

    cleanRobot() {
        console.log('Cleaning the robot')
        this.wasteObjects.forEach(waste => {
            this.scene.remove(waste)
        })
        this.wasteObjects = []
    }

    playDanceAnimation() {
        this.fadeToAction('Dance', 0.5)
        this.mixer.addEventListener('finished', this.restoreWalking())
    }

    restoreWalking() {
        return () => {
            if (this.mixer) {
                this.mixer.removeEventListener('finished', this.restoreWalking())
            }
            if (this.isAlive) {
                this.fadeToAction('Walking', 0.5)
            }
        }
    }

    startWasteCreation() {
        setInterval(() => {
            if (this.isAlive) {
                this.createWaste()
            }
        }, 15000) // Create waste every 15 seconds
    }

    createWaste() {
        const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5)
        const material = new THREE.MeshStandardMaterial({ color: 0x654321 })
        const waste = new THREE.Mesh(geometry, material)
        waste.position.set(
            Math.random() * 10 - 5,
            0.25,
            Math.random() * 10 - 5
        )
        this.scene.add(waste)
        this.wasteObjects.push(waste)
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
        // Add any additional logic for when the robot dies
    }
}