import * as THREE from 'three'
import Experience from '../Experience.js'

export default class Floor {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene

        this.setGround()
    }

    setGround() {
        const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2000, 2000), new THREE.MeshPhongMaterial({ color: 0xcbcbcb, depthWrite: false }))
        mesh.rotation.x = -Math.PI / 2
        this.scene.add(mesh)

        const grid = new THREE.GridHelper(200, 40, 0x000000, 0x000000)
        grid.material.opacity = 0.2
        grid.material.transparent = true
        this.scene.add(grid)
    }
}