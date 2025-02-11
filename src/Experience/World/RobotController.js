import * as THREE from 'three'
import Experience from '../Experience.js'

export default class RobotController {
    constructor() {
        // Access the shared Experience, scene, & GUI
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.gui = this.experience.gui

        // Keep track of the robot's animations
        this.mixer = null
        this.actions = {}
        this.activeAction = null
        this.previousAction = null

        // Store the robot’s base state; default is 'Walking'
        this.api = { state: 'Walking' }

        // Same state and emote lists as the official example
        this.states = ['Idle', 'Walking', 'Running', 'Dance', 'Death', 'Sitting', 'Standing']
        this.emotes = ['Jump', 'Yes', 'No', 'Wave', 'Punch', 'ThumbsUp']
    }

    addRobotToGUI(robot, animations) {
        // Create a mixer for the robot
        this.mixer = new THREE.AnimationMixer(robot)
        this.actions = {}

        // Create actions for each clip 
        for (const clip of animations) {
            const action = this.mixer.clipAction(clip)
            this.actions[clip.name] = action

            // Single-use animations (emotes or states with index >= 4) play once and clamp
            if (this.emotes.includes(clip.name) || ['Death', 'Sitting', 'Standing'].includes(clip.name)) {
                action.loop = THREE.LoopOnce
                action.clampWhenFinished = true
            }
        }

        // Create GUI for the robot
        this.createGUI(robot, animations)

        // Start the base action (Walking) immediately
        this.activeAction = this.actions[this.api.state]
        this.activeAction.play()
    }

    createGUI(robot, animations) {
        const statesFolder = this.gui.addFolder('Robot States')
        const baseStateCtrl = statesFolder
            .add(this.api, 'state')
            .options(this.states)
            .name('Base State')
        baseStateCtrl.onChange(() => {
            this.fadeToAction(this.api.state, 0.5)
        })
        statesFolder.open()

        const emoteFolder = this.gui.addFolder('Robot Emotes')
        for (const emote of this.emotes) {
            emoteFolder.add(
                {
                    [emote]: () => {
                        this.fadeToAction(emote, 0.2)
                        this.mixer.addEventListener('finished', this.restoreBase())
                    }
                },
                emote
            )
        }
        emoteFolder.open()

        const face = robot.getObjectByName('Head_4')
        if (face && face.morphTargetDictionary) {
            const expressionFolder = this.gui.addFolder('Robot Expressions')
            const expressions = Object.keys(face.morphTargetDictionary)
            for (let i = 0; i < expressions.length; i++) {
                expressionFolder
                    .add(face.morphTargetInfluences, i, 0, 1, 0.01)
                    .name(expressions[i])
            }
            expressionFolder.open()
        }
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

    restoreBase() {
        // Called when an emote finishes, returning to the currently chosen base state
        return () => {
            if (this.mixer) {
                this.mixer.removeEventListener('finished', this.restoreBase())
            }
            const baseName = this.api.state

            // Only restore to base state if it's not 'Death', 'Sitting', or 'Standing'
            if (!['Death', 'Sitting', 'Standing'].includes(baseName)) {
                this.fadeToAction(baseName, 0.2)
            }
        }
    }

    // Update the mixer's animations
    update(deltaTime) {
        if (this.mixer) {
            this.mixer.update(deltaTime)
        }
    }
}