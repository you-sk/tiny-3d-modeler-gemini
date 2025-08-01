export class ShortcutManager {
    constructor(sceneManager, commandManager) {
        this.sceneManager = sceneManager;
        this.commandManager = commandManager;
        this.shortcuts = new Map();
        
        this.init();
    }

    init() {
        this.registerShortcuts();
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
    }

    registerShortcuts() {
        this.register('g', () => this.sceneManager.setTransformMode('translate'), '移動モード');
        this.register('r', () => this.sceneManager.setTransformMode('rotate'), '回転モード');
        this.register('s', () => this.sceneManager.setTransformMode('scale'), 'スケールモード');
        
        this.register('Delete', () => {
            if (this.sceneManager.selectedObjects.size > 0) {
                this.sceneManager.removeSelectedObjects();
            }
        }, '選択オブジェクトを削除');
        
        this.register('ctrl+z', () => this.commandManager.undo(), 'アンドゥ');
        this.register('ctrl+y', () => this.commandManager.redo(), 'リドゥ');
        this.register('ctrl+shift+z', () => this.commandManager.redo(), 'リドゥ');
        
        this.register('a', () => this.selectAll(), 'すべて選択');
        this.register('Escape', () => this.sceneManager.clearSelection(), '選択解除');
        
        this.register('h', () => this.toggleHelp(), 'ヘルプ表示/非表示');
        
        this.register('1', () => document.getElementById('add-cube')?.click(), 'キューブ追加');
        this.register('2', () => document.getElementById('add-sphere')?.click(), '球体追加');
        this.register('3', () => document.getElementById('add-cylinder')?.click(), 'シリンダー追加');
        this.register('4', () => document.getElementById('add-cone')?.click(), 'コーン追加');
        this.register('5', () => document.getElementById('add-plane')?.click(), 'プレーン追加');
        this.register('6', () => document.getElementById('add-torus')?.click(), 'トーラス追加');
    }

    register(key, callback, description) {
        this.shortcuts.set(key.toLowerCase(), { callback, description });
    }

    handleKeyDown(event) {
        if (event.target.tagName === 'INPUT') return;
        
        let key = '';
        if (event.ctrlKey || event.metaKey) key += 'ctrl+';
        if (event.shiftKey) key += 'shift+';
        if (event.altKey) key += 'alt+';
        key += event.key.toLowerCase();
        
        const shortcut = this.shortcuts.get(key);
        if (shortcut) {
            event.preventDefault();
            shortcut.callback();
        }
    }

    selectAll() {
        this.sceneManager.clearSelection();
        this.sceneManager.objects.forEach(obj => {
            this.sceneManager.selectedObjects.add(obj);
        });
        if (this.sceneManager.objects.length > 0) {
            this.sceneManager.transformControls.attach(this.sceneManager.objects[0]);
        }
        if (this.sceneManager.onSelectionChange) {
            this.sceneManager.onSelectionChange(Array.from(this.sceneManager.selectedObjects));
        }
        this.sceneManager.render();
    }

    toggleHelp() {
        const helpElement = document.getElementById('shortcut-help');
        if (helpElement) {
            helpElement.style.display = helpElement.style.display === 'none' ? 'block' : 'none';
        }
    }

    getShortcutList() {
        const shortcuts = [];
        this.shortcuts.forEach((value, key) => {
            shortcuts.push({ key, description: value.description });
        });
        return shortcuts;
    }
}