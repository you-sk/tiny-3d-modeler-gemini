import { SceneManager } from './SceneManager.js';
import { ObjectFactory } from './ObjectFactory.js';
import { CommandManager, AddObjectCommand, DeleteObjectCommand } from './CommandManager.js';
import { PropertyPanel } from './PropertyPanel.js';
import { ShortcutManager } from './ShortcutManager.js';

class App {
    constructor() {
        this.init();
    }

    init() {
        const viewport = document.getElementById('viewport');
        this.sceneManager = new SceneManager(viewport);
        this.commandManager = new CommandManager();
        
        this.propertyPanel = new PropertyPanel(
            document.getElementById('property-panel'),
            this.sceneManager
        );
        
        this.shortcutManager = new ShortcutManager(this.sceneManager, this.commandManager);
        
        this.sceneManager.onSelectionChange = (objects) => {
            this.propertyPanel.updateSelection(objects);
            this.updateInfoBar();
        };
        
        this.commandManager.onStateChange = (state) => {
            this.updateUndoRedoButtons(state);
        };
        
        this.setupUI();
        this.setupShortcutHelp();
        this.sceneManager.animate();
    }

    setupUI() {
        document.getElementById('add-cube').addEventListener('click', () => {
            const cube = ObjectFactory.createCube();
            const command = new AddObjectCommand(this.sceneManager, cube);
            this.commandManager.execute(command);
        });

        document.getElementById('add-sphere').addEventListener('click', () => {
            const sphere = ObjectFactory.createSphere();
            const command = new AddObjectCommand(this.sceneManager, sphere);
            this.commandManager.execute(command);
        });

        document.getElementById('add-cylinder').addEventListener('click', () => {
            const cylinder = ObjectFactory.createCylinder();
            const command = new AddObjectCommand(this.sceneManager, cylinder);
            this.commandManager.execute(command);
        });

        document.getElementById('add-cone').addEventListener('click', () => {
            const cone = ObjectFactory.createCone();
            const command = new AddObjectCommand(this.sceneManager, cone);
            this.commandManager.execute(command);
        });

        document.getElementById('add-plane').addEventListener('click', () => {
            const plane = ObjectFactory.createPlane();
            const command = new AddObjectCommand(this.sceneManager, plane);
            this.commandManager.execute(command);
        });

        document.getElementById('add-torus').addEventListener('click', () => {
            const torus = ObjectFactory.createTorus();
            const command = new AddObjectCommand(this.sceneManager, torus);
            this.commandManager.execute(command);
        });

        document.getElementById('add-tetrahedron').addEventListener('click', () => {
            const tetrahedron = ObjectFactory.createTetrahedron();
            const command = new AddObjectCommand(this.sceneManager, tetrahedron);
            this.commandManager.execute(command);
        });

        document.getElementById('add-octahedron').addEventListener('click', () => {
            const octahedron = ObjectFactory.createOctahedron();
            const command = new AddObjectCommand(this.sceneManager, octahedron);
            this.commandManager.execute(command);
        });

        document.getElementById('add-dodecahedron').addEventListener('click', () => {
            const dodecahedron = ObjectFactory.createDodecahedron();
            const command = new AddObjectCommand(this.sceneManager, dodecahedron);
            this.commandManager.execute(command);
        });

        document.getElementById('add-icosahedron').addEventListener('click', () => {
            const icosahedron = ObjectFactory.createIcosahedron();
            const command = new AddObjectCommand(this.sceneManager, icosahedron);
            this.commandManager.execute(command);
        });

        document.getElementById('delete-selected').addEventListener('click', () => {
            if (this.sceneManager.selectedObjects.size > 0) {
                const command = new DeleteObjectCommand(
                    this.sceneManager, 
                    Array.from(this.sceneManager.selectedObjects)
                );
                this.commandManager.execute(command);
            }
        });

        document.getElementById('undo').addEventListener('click', () => {
            this.commandManager.undo();
        });

        document.getElementById('redo').addEventListener('click', () => {
            this.commandManager.redo();
        });

        document.getElementById('transform-translate').addEventListener('click', () => {
            this.sceneManager.setTransformMode('translate');
            this.updateTransformButtons('translate');
        });

        document.getElementById('transform-rotate').addEventListener('click', () => {
            this.sceneManager.setTransformMode('rotate');
            this.updateTransformButtons('rotate');
        });

        document.getElementById('transform-scale').addEventListener('click', () => {
            this.sceneManager.setTransformMode('scale');
            this.updateTransformButtons('scale');
        });
    }

    updateTransformButtons(activeMode) {
        document.querySelectorAll('.transform-button').forEach(btn => {
            btn.classList.remove('active');
        });
        document.getElementById(`transform-${activeMode}`).classList.add('active');
    }

    updateUndoRedoButtons(state) {
        const undoBtn = document.getElementById('undo');
        const redoBtn = document.getElementById('redo');
        
        if (undoBtn) undoBtn.disabled = !state.canUndo;
        if (redoBtn) redoBtn.disabled = !state.canRedo;
    }

    updateInfoBar() {
        const infoBar = document.getElementById('info-bar');
        const selectedCount = this.sceneManager.selectedObjects.size;
        const totalCount = this.sceneManager.objects.length;
        
        let info = `オブジェクト: ${totalCount}`;
        if (selectedCount > 0) {
            info += ` | 選択中: ${selectedCount}`;
        }
        
        infoBar.textContent = info;
    }

    setupShortcutHelp() {
        const shortcuts = this.shortcutManager.getShortcutList();
        const helpContent = shortcuts.map(s => 
            `<li><span class="shortcut-key">${s.key.toUpperCase()}</span> ${s.description}</li>`
        ).join('');
        
        const helpHTML = `
            <h3>ショートカットキー</h3>
            <ul>${helpContent}</ul>
        `;
        
        document.getElementById('shortcut-help-content').innerHTML = helpHTML;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new App();
});