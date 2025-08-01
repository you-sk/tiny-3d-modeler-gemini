import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { TransformControls } from 'three/addons/controls/TransformControls.js';

export class SceneManager {
    constructor(viewport) {
        this.viewport = viewport;
        this.selectedObjects = new Set();
        this.objects = [];
        
        this.init();
    }

    init() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x333333);

        this.camera = new THREE.PerspectiveCamera(
            75, 
            this.viewport.clientWidth / this.viewport.clientHeight, 
            0.1, 
            1000
        );
        this.camera.position.set(5, 5, 5);

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(this.viewport.clientWidth, this.viewport.clientHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.viewport.appendChild(this.renderer.domElement);

        this.setupLights();
        this.setupHelpers();
        this.setupControls();
        
        window.addEventListener('resize', () => this.onWindowResize());
    }

    setupLights() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
        directionalLight.position.set(5, 10, 7.5);
        directionalLight.castShadow = true;
        directionalLight.shadow.camera.near = 0.1;
        directionalLight.shadow.camera.far = 50;
        directionalLight.shadow.camera.left = -10;
        directionalLight.shadow.camera.right = 10;
        directionalLight.shadow.camera.top = 10;
        directionalLight.shadow.camera.bottom = -10;
        this.scene.add(directionalLight);
    }

    setupHelpers() {
        const gridHelper = new THREE.GridHelper(10, 10);
        this.scene.add(gridHelper);
        
        const axesHelper = new THREE.AxesHelper(2);
        this.scene.add(axesHelper);
    }

    setupControls() {
        this.orbitControls = new OrbitControls(this.camera, this.renderer.domElement);
        this.orbitControls.addEventListener('change', () => this.render());

        this.transformControls = new TransformControls(this.camera, this.renderer.domElement);
        this.transformControls.addEventListener('dragging-changed', (event) => {
            this.orbitControls.enabled = !event.value;
        });
        this.transformControls.addEventListener('change', () => this.render());
        this.scene.add(this.transformControls);

        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        
        this.renderer.domElement.addEventListener('click', (e) => this.onMouseClick(e));
    }

    onMouseClick(event) {
        if (this.transformControls.dragging) return;

        const rect = this.renderer.domElement.getBoundingClientRect();
        this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.objects);

        if (intersects.length > 0) {
            const object = intersects[0].object;
            
            if (event.shiftKey) {
                this.toggleSelection(object);
            } else {
                this.clearSelection();
                this.selectObject(object);
            }
        } else {
            this.clearSelection();
        }
        
        this.render();
    }

    selectObject(object) {
        this.selectedObjects.add(object);
        this.transformControls.attach(object);
        
        if (this.onSelectionChange) {
            this.onSelectionChange(Array.from(this.selectedObjects));
        }
    }

    toggleSelection(object) {
        if (this.selectedObjects.has(object)) {
            this.selectedObjects.delete(object);
            if (this.selectedObjects.size === 0) {
                this.transformControls.detach();
            } else {
                this.transformControls.attach(Array.from(this.selectedObjects)[0]);
            }
        } else {
            this.selectedObjects.add(object);
            this.transformControls.attach(object);
        }
        
        if (this.onSelectionChange) {
            this.onSelectionChange(Array.from(this.selectedObjects));
        }
    }

    clearSelection() {
        this.selectedObjects.clear();
        this.transformControls.detach();
        
        if (this.onSelectionChange) {
            this.onSelectionChange([]);
        }
    }

    addObject(object) {
        object.castShadow = true;
        object.receiveShadow = true;
        this.scene.add(object);
        this.objects.push(object);
        this.clearSelection();
        this.selectObject(object);
        this.render();
        return object;
    }

    removeSelectedObjects() {
        const objectsToRemove = Array.from(this.selectedObjects);
        
        objectsToRemove.forEach(object => {
            this.transformControls.detach();
            
            if(object.geometry) object.geometry.dispose();
            if(object.material) {
                if (Array.isArray(object.material)) {
                    object.material.forEach(m => m.dispose());
                } else {
                    object.material.dispose();
                }
            }
            
            this.scene.remove(object);
            const index = this.objects.indexOf(object);
            if (index > -1) {
                this.objects.splice(index, 1);
            }
            this.selectedObjects.delete(object);
        });
        
        this.render();
        
        if (this.onSelectionChange) {
            this.onSelectionChange([]);
        }
    }

    setTransformMode(mode) {
        this.transformControls.setMode(mode);
        this.render();
    }

    onWindowResize() {
        this.camera.aspect = this.viewport.clientWidth / this.viewport.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.viewport.clientWidth, this.viewport.clientHeight);
        this.render();
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.orbitControls.update();
        this.render();
    }
}