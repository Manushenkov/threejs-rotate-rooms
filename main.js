import './style.css'

import * as THREE from 'three';
import {FlyControls} from "three/examples/jsm/controls/FlyControls";

const rad = (deg) => deg * Math.PI / 180

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000)

const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg')
})

renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight)

camera.position.setZ(50)

renderer.render(scene, camera)

const geometry = new THREE.PlaneGeometry(19.8,19.8)
const wallMaterial = new THREE.MeshBasicMaterial( {color: 'grey', side: THREE.DoubleSide} );
const floorMaterial = new THREE.MeshBasicMaterial( {color: '#404040', side: THREE.DoubleSide} );
const ceilingMaterial = new THREE.MeshBasicMaterial( {color: '#404040', side: THREE.DoubleSide, opacity: 0.9, transparent: true} );

const wallHorisontal = new THREE.Mesh( geometry, wallMaterial ).rotateY(rad(90))
const wallVertical = new THREE.Mesh( geometry, wallMaterial ).rotateX(rad(90))
const floorTemplate = new THREE.Mesh( geometry, floorMaterial ).translateZ(-10);
const ceilingTemplate = new THREE.Mesh( geometry, ceilingMaterial ).translateZ(10);


// four corner room construction. I used IIFE to encapsulate wall1...4
const fourCornerRoom = (function() {
    const fourCornerRoom = new THREE.Group();

    const floor = floorTemplate.clone()
    const ceiling = ceilingTemplate.clone()

    const wall1 = wallVertical.clone().translateZ(-10)
    const wall2 = wallHorisontal.clone().translateZ(10)
    const wall3 = wallVertical.clone().translateZ(10)
    const wall4 = wallHorisontal.clone().translateZ(-10)

    fourCornerRoom.add(floor, wall1, wall2, wall3, wall4, ceiling).translateY(15).translateX(15)

    return fourCornerRoom
})()

scene.add(fourCornerRoom);

// six corner room construction
const sixCornerRoom = (function() {
    const sixCornerRoom = new THREE.Group();

    const floor1 = floorTemplate.clone().translateX(20)
    const floor2 = floorTemplate.clone().translateY(20)
    const floor3 = floorTemplate.clone()

    const ceiling1 = ceilingTemplate.clone().translateX(20)
    const ceiling2 = ceilingTemplate.clone().translateY(20)
    const ceiling3 = ceilingTemplate.clone()

    const wall1 = wallVertical.clone().translateZ(-30)
    const wall2 = wallHorisontal.clone().translateZ(30)
    const wall3 = wallVertical.clone().translateZ(10)
    const wall4 = wallHorisontal.clone().translateZ(-10)
    const wall5 = wallVertical.clone().translateZ(-10).translateX(20)
    const wall6 = wallHorisontal.clone().translateZ(10).translateY(20)
    const wall7 = wallVertical.clone().translateZ(10).translateX(20)
    const wall8 = wallHorisontal.clone().translateZ(-10).translateY(20)

    sixCornerRoom.add(floor1, floor2, floor3, wall1, wall2, wall3, wall4, wall5, wall6, wall7, wall8, ceiling1, ceiling2, ceiling3).translateY(-25).translateX(-25)

    return sixCornerRoom
})()

scene.add(sixCornerRoom);


const clock = new THREE.Clock();

const controls = new FlyControls( camera, renderer.domElement );

controls.movementSpeed = 10;
controls.domElement = renderer.domElement;
controls.autoForward = false;
controls.dragToLook = true;

let rotateDegrees = 0

function animate() {
    requestAnimationFrame(animate);

    if (rotateDegrees > 0) {
        rotateDegrees -= 2
        fourCornerRoom.rotateZ(rad(-2))
        sixCornerRoom.rotateZ(rad(-2))
    }

    const delta = clock.getDelta();
    
    controls.update( delta );

    renderer.render(scene, camera);
}

animate();

document.querySelector('#button').addEventListener('click', () => {
    if (rotateDegrees <= 0) rotateDegrees += 90
})