import * as THREE from 'three';

export class PropertyPanel {
    constructor(container, sceneManager) {
        this.container = container;
        this.sceneManager = sceneManager;
        this.selectedObjects = [];
        
        this.init();
    }

    init() {
        this.container.innerHTML = `
            <h2>プロパティ</h2>
            <div id="property-content">
                <p style="color: #888;">オブジェクトを選択してください</p>
            </div>
        `;
    }

    updateSelection(objects) {
        this.selectedObjects = objects;
        const content = document.getElementById('property-content');
        
        if (objects.length === 0) {
            content.innerHTML = '<p style="color: #888;">オブジェクトを選択してください</p>';
            return;
        }
        
        if (objects.length === 1) {
            this.showSingleObjectProperties(objects[0], content);
        } else {
            this.showMultipleObjectProperties(objects, content);
        }
    }

    showSingleObjectProperties(object, container) {
        const position = object.position;
        const rotation = object.rotation;
        const scale = object.scale;
        const material = object.material;
        
        container.innerHTML = `
            <div class="panel-section">
                <h3>変形</h3>
                <div class="property-row">
                    <label>位置 X:</label>
                    <input type="number" id="pos-x" value="${position.x.toFixed(2)}" step="0.1">
                </div>
                <div class="property-row">
                    <label>位置 Y:</label>
                    <input type="number" id="pos-y" value="${position.y.toFixed(2)}" step="0.1">
                </div>
                <div class="property-row">
                    <label>位置 Z:</label>
                    <input type="number" id="pos-z" value="${position.z.toFixed(2)}" step="0.1">
                </div>
                
                <div class="property-row">
                    <label>回転 X:</label>
                    <input type="number" id="rot-x" value="${THREE.MathUtils.radToDeg(rotation.x).toFixed(1)}" step="1">
                </div>
                <div class="property-row">
                    <label>回転 Y:</label>
                    <input type="number" id="rot-y" value="${THREE.MathUtils.radToDeg(rotation.y).toFixed(1)}" step="1">
                </div>
                <div class="property-row">
                    <label>回転 Z:</label>
                    <input type="number" id="rot-z" value="${THREE.MathUtils.radToDeg(rotation.z).toFixed(1)}" step="1">
                </div>
                
                <div class="property-row">
                    <label>スケール X:</label>
                    <input type="number" id="scale-x" value="${scale.x.toFixed(2)}" step="0.1">
                </div>
                <div class="property-row">
                    <label>スケール Y:</label>
                    <input type="number" id="scale-y" value="${scale.y.toFixed(2)}" step="0.1">
                </div>
                <div class="property-row">
                    <label>スケール Z:</label>
                    <input type="number" id="scale-z" value="${scale.z.toFixed(2)}" step="0.1">
                </div>
            </div>
            
            <div class="panel-section">
                <h3>マテリアル</h3>
                <div class="property-row">
                    <label>色:</label>
                    <input type="color" id="mat-color" value="#${material.color.getHexString()}">
                </div>
                <div class="property-row">
                    <label>粗さ:</label>
                    <input type="number" id="mat-roughness" value="${material.roughness}" min="0" max="1" step="0.1">
                </div>
                <div class="property-row">
                    <label>メタリック:</label>
                    <input type="number" id="mat-metalness" value="${material.metalness}" min="0" max="1" step="0.1">
                </div>
            </div>
        `;
        
        this.attachEventListeners(object);
    }

    showMultipleObjectProperties(objects, container) {
        container.innerHTML = `
            <div class="panel-section">
                <p>${objects.length} 個のオブジェクトが選択されています</p>
            </div>
        `;
    }

    attachEventListeners(object) {
        document.getElementById('pos-x')?.addEventListener('input', (e) => {
            object.position.x = parseFloat(e.target.value);
            this.sceneManager.render();
        });
        
        document.getElementById('pos-y')?.addEventListener('input', (e) => {
            object.position.y = parseFloat(e.target.value);
            this.sceneManager.render();
        });
        
        document.getElementById('pos-z')?.addEventListener('input', (e) => {
            object.position.z = parseFloat(e.target.value);
            this.sceneManager.render();
        });
        
        document.getElementById('rot-x')?.addEventListener('input', (e) => {
            object.rotation.x = THREE.MathUtils.degToRad(parseFloat(e.target.value));
            this.sceneManager.render();
        });
        
        document.getElementById('rot-y')?.addEventListener('input', (e) => {
            object.rotation.y = THREE.MathUtils.degToRad(parseFloat(e.target.value));
            this.sceneManager.render();
        });
        
        document.getElementById('rot-z')?.addEventListener('input', (e) => {
            object.rotation.z = THREE.MathUtils.degToRad(parseFloat(e.target.value));
            this.sceneManager.render();
        });
        
        document.getElementById('scale-x')?.addEventListener('input', (e) => {
            object.scale.x = parseFloat(e.target.value);
            this.sceneManager.render();
        });
        
        document.getElementById('scale-y')?.addEventListener('input', (e) => {
            object.scale.y = parseFloat(e.target.value);
            this.sceneManager.render();
        });
        
        document.getElementById('scale-z')?.addEventListener('input', (e) => {
            object.scale.z = parseFloat(e.target.value);
            this.sceneManager.render();
        });
        
        document.getElementById('mat-color')?.addEventListener('input', (e) => {
            object.material.color.set(e.target.value);
            this.sceneManager.render();
        });
        
        document.getElementById('mat-roughness')?.addEventListener('input', (e) => {
            object.material.roughness = parseFloat(e.target.value);
            this.sceneManager.render();
        });
        
        document.getElementById('mat-metalness')?.addEventListener('input', (e) => {
            object.material.metalness = parseFloat(e.target.value);
            this.sceneManager.render();
        });
    }
}