export class CommandManager {
    constructor() {
        this.history = [];
        this.currentIndex = -1;
        this.maxHistorySize = 100;
    }

    execute(command) {
        command.execute();
        
        this.history = this.history.slice(0, this.currentIndex + 1);
        this.history.push(command);
        
        if (this.history.length > this.maxHistorySize) {
            this.history.shift();
        } else {
            this.currentIndex++;
        }
        
        this.updateUI();
    }

    undo() {
        if (this.canUndo()) {
            const command = this.history[this.currentIndex];
            command.undo();
            this.currentIndex--;
            this.updateUI();
            return true;
        }
        return false;
    }

    redo() {
        if (this.canRedo()) {
            this.currentIndex++;
            const command = this.history[this.currentIndex];
            command.execute();
            this.updateUI();
            return true;
        }
        return false;
    }

    canUndo() {
        return this.currentIndex >= 0;
    }

    canRedo() {
        return this.currentIndex < this.history.length - 1;
    }

    updateUI() {
        if (this.onStateChange) {
            this.onStateChange({
                canUndo: this.canUndo(),
                canRedo: this.canRedo()
            });
        }
    }

    clear() {
        this.history = [];
        this.currentIndex = -1;
        this.updateUI();
    }
}

export class Command {
    constructor(name) {
        this.name = name;
    }

    execute() {
        throw new Error('execute() must be implemented');
    }

    undo() {
        throw new Error('undo() must be implemented');
    }
}

export class AddObjectCommand extends Command {
    constructor(sceneManager, object) {
        super('Add Object');
        this.sceneManager = sceneManager;
        this.object = object;
    }

    execute() {
        this.sceneManager.scene.add(this.object);
        this.sceneManager.objects.push(this.object);
        this.sceneManager.clearSelection();
        this.sceneManager.selectObject(this.object);
        this.sceneManager.render();
    }

    undo() {
        this.sceneManager.scene.remove(this.object);
        const index = this.sceneManager.objects.indexOf(this.object);
        if (index > -1) {
            this.sceneManager.objects.splice(index, 1);
        }
        this.sceneManager.selectedObjects.delete(this.object);
        this.sceneManager.transformControls.detach();
        this.sceneManager.render();
    }
}

export class DeleteObjectCommand extends Command {
    constructor(sceneManager, objects) {
        super('Delete Object');
        this.sceneManager = sceneManager;
        this.objects = Array.isArray(objects) ? objects : [objects];
        this.objectData = this.objects.map(obj => ({
            object: obj,
            parent: obj.parent,
            index: sceneManager.objects.indexOf(obj)
        }));
    }

    execute() {
        this.objectData.forEach(data => {
            this.sceneManager.scene.remove(data.object);
            const index = this.sceneManager.objects.indexOf(data.object);
            if (index > -1) {
                this.sceneManager.objects.splice(index, 1);
            }
            this.sceneManager.selectedObjects.delete(data.object);
        });
        this.sceneManager.transformControls.detach();
        this.sceneManager.render();
    }

    undo() {
        this.objectData.forEach(data => {
            this.sceneManager.scene.add(data.object);
            if (data.index >= 0) {
                this.sceneManager.objects.splice(data.index, 0, data.object);
            } else {
                this.sceneManager.objects.push(data.object);
            }
        });
        this.sceneManager.render();
    }
}

export class TransformCommand extends Command {
    constructor(sceneManager, object, oldTransform, newTransform) {
        super('Transform Object');
        this.sceneManager = sceneManager;
        this.object = object;
        this.oldTransform = oldTransform;
        this.newTransform = newTransform;
    }

    execute() {
        this.object.position.copy(this.newTransform.position);
        this.object.rotation.copy(this.newTransform.rotation);
        this.object.scale.copy(this.newTransform.scale);
        this.sceneManager.render();
    }

    undo() {
        this.object.position.copy(this.oldTransform.position);
        this.object.rotation.copy(this.oldTransform.rotation);
        this.object.scale.copy(this.oldTransform.scale);
        this.sceneManager.render();
    }
}