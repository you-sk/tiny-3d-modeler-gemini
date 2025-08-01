import * as THREE from 'three';

export class ObjectFactory {
    static createMaterial(options = {}) {
        const defaults = {
            color: Math.random() * 0xffffff,
            roughness: 0.5,
            metalness: 0.5
        };
        
        return new THREE.MeshStandardMaterial({ ...defaults, ...options });
    }

    static createCube(size = 1) {
        const geometry = new THREE.BoxGeometry(size, size, size);
        const material = this.createMaterial();
        return new THREE.Mesh(geometry, material);
    }

    static createSphere(radius = 0.7, widthSegments = 32, heightSegments = 16) {
        const geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
        const material = this.createMaterial();
        return new THREE.Mesh(geometry, material);
    }

    static createTorus(radius = 0.8, tube = 0.3, radialSegments = 16, tubularSegments = 100) {
        const geometry = new THREE.TorusGeometry(radius, tube, radialSegments, tubularSegments);
        const material = this.createMaterial();
        return new THREE.Mesh(geometry, material);
    }

    static createCylinder(radiusTop = 0.5, radiusBottom = 0.5, height = 1, radialSegments = 32) {
        const geometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radialSegments);
        const material = this.createMaterial();
        return new THREE.Mesh(geometry, material);
    }

    static createCone(radius = 0.5, height = 1, radialSegments = 32) {
        const geometry = new THREE.ConeGeometry(radius, height, radialSegments);
        const material = this.createMaterial();
        return new THREE.Mesh(geometry, material);
    }

    static createPlane(width = 2, height = 2) {
        const geometry = new THREE.PlaneGeometry(width, height);
        const material = this.createMaterial({ side: THREE.DoubleSide });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.rotation.x = -Math.PI / 2;
        return mesh;
    }

    static createTetrahedron(radius = 0.7) {
        const geometry = new THREE.TetrahedronGeometry(radius);
        const material = this.createMaterial();
        return new THREE.Mesh(geometry, material);
    }

    static createOctahedron(radius = 0.7) {
        const geometry = new THREE.OctahedronGeometry(radius);
        const material = this.createMaterial();
        return new THREE.Mesh(geometry, material);
    }

    static createDodecahedron(radius = 0.7) {
        const geometry = new THREE.DodecahedronGeometry(radius);
        const material = this.createMaterial();
        return new THREE.Mesh(geometry, material);
    }

    static createIcosahedron(radius = 0.7) {
        const geometry = new THREE.IcosahedronGeometry(radius);
        const material = this.createMaterial();
        return new THREE.Mesh(geometry, material);
    }
}