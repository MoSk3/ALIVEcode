
// PEUT-ÊTRE AJOUT SYSTÈME D'EXPRESSION (exemple: (var) (symbole) (val)) => i <- 5

const EVENT_START = "START"
const ACTION_AVANCER = "avancer"
const ACTION_RECULER = "reculer"
const ACTION_ATTENDRE = "attendre"
const ACTION_STOP = "arreter"
const ACTION_TOURNER_GAUCHE = "tournerGauche"
const ACTION_TOURNER_DROITE = "tournerDroite"
const ACTION_TOURNER = "tourner"

const UTILITAIRE_AFFICHER = "afficher"
const UTILITAIRE_LIRE = "lire dans"

const VAR_SET = "<-"
const Operator_ADDITION = "+"
const Operator_SOUSTRACTION = "-"
const Operator_MULTIPLICATION = "*"
const Operator_DIVISION = "/"
const Operator_EXPOSANT = "^"
var trashCan

var previousSelection = null

const sketchInterface = function(s) {
    let width
    let height
    let canvas
    s.menu
    s.leftPannel
    s.blocs = []
    s.inputBoxes = []
    let parents = []
    s.rects = []
    s.mousePressed = false
    s.selectedBloc = null
    s.pause = false
    s.trashOver = false;
    s.blocs_interface = $('#blocs-interface')

    s.preload = () => {
        trashCan = s.loadImage('/static/images/trash.png')
        trashCanOpen = s.loadImage('/static/images/trashOpen.png')
    }

    s.setup = () => {
        s.canvasDiv = s.blocs_interface

        s.blocs.push(new BlocEvent(s, 300, 50, 180, 45, [EVENT_START], "#17ff3a"))
            /*
            s.blocs.push(new Operator(s, 100, 100, "qqlchose", [Operator_ADDITION, Operator_ADDITION], "yellow", 3))
            s.blocs.push(new Operator(s, 100, 150, "addition", [Operator_ADDITION], "yellow", 2))
            s.blocs.push(new Operator(s, 100, 200, "addition", [Operator_ADDITION], "yellow", 2))
            s.blocs.push(new Operator(s, 100, 250, "soustraction", [Operator_SOUSTRACTION], "yellow", 2))
            s.blocs.push(new Operator(s, 100, 300, "multiplication", [Operator_MULTIPLICATION], "yellow", 2))
            s.blocs.push(new Operator(s, 100, 350, "division", [Operator_DIVISION], "yellow", 2))
            s.blocs.push(new Operator(s, 100, 400, "exposant", [Operator_EXPOSANT], "yellow", 2))
            */

        width = 1500
        height = 1000

        canvas = s.createCanvas(width, height)
        canvas.parent("blocs-interface")
        canvas.mousePressed(mousePressed)
        canvas.mouseReleased(mouseReleased)

        s.menu = {
            x: 0,
            y: 0,
            w: 210,
            h: s.blocs_interface.height(),
            components: [],
            setComponents: function() {
                this.components = []
                addComponents = (...elements) => {
                    let i = this.components.length
                    for (let el of elements) {
                        el.y = 40 * i
                        this.components.push(el)
                        i++
                    }

                }
                addComponents(
                    //new MenuSeparator(this, s, 20, 0, "Mouvements"),
                    //new Bloc(s, 20, 0, 150, 30, ACTION_AVANCER, "#ffbd00", true),
                    //new Bloc(s, 20, 0, 150, 30, ACTION_RECULER, "#ffbd00", true),
                    //new BlocParameters(s, 20, 0, ACTION_AVANCER, "#ffbd00", true, [1]),
                    //new BlocParameters(s, 20, 0, ACTION_RECULER, "#ffbd00", true, [1]),
                    //new Bloc(s, 20, 0, 150, 30, ACTION_STOP, "red", true),
                    //new BlocParameters(s, 20, 170, ACTION_TOURNER, "yellow", true, [180]),
                    //new Bloc(s, 20, 0, 150, 30, ACTION_TOURNER_DROITE, "yellow", true),
                    //new Bloc(s, 20, 0, 150, 30, ACTION_TOURNER_GAUCHE, "yellow", true),
                    //new MenuSeparator(this, s, 20, 0, "Utilitaires"),
                    //new BlocParameters(s, 20, 0, ACTION_ATTENDRE, "gray", true, [5]),
                    //new BlocParameters(s, 20, 0, UTILITAIRE_AFFICHER, "#34abeb", true, ['"Hello World!"']),
                    //new BlocParameters(s, 20, 0, UTILITAIRE_LIRE, "#34abeb", true, ["a"]),
                    new MenuSeparator(this, s, 20, 0, "Opérations"),
                    //new Operator(s, 20, 0, "+", [Operator_ADDITION], "yellow", true, [0, 0]),
                    //new Operator(s, 20, 0, "qqlchose", [Operator_SOUSTRACTION], "yellow", true, [0, 0]),
                    //new Operator(s, 20, 0, "qqlchose", [Operator_MULTIPLICATION], "yellow", true, [0, 0]),
                    //new Operator(s, 20, 0, "qqlchose", [Operator_DIVISION], "yellow", true, [0, 0]),
                    //new Operator(s, 20, 0, "qqlchose", [Operator_EXPOSANT], "yellow", true, [0, 0]),
                )
            },
            draw: function() {
                this.y = s.blocs_interface[0].scrollTop
                s.noStroke()
                s.fill("white")
                s.rect(this.x, this.y, this.w, this.h)
                s.fill("#20201f")
                s.rect(this.x + this.w, this.y, 1, this.h)

                for (let component of this.components) {
                    component.update()
                    component.draw()
                }
            },
            resize: function() {
                this.h = s.blocs_interface.height()
            }
        }
        s.menu.setComponents()

        resize()
        $(window).resize(resize)
        s.textSize(15);

        s.frameRate(60)

    }

    s.isMouseInside = (x, y, w, h) => {
        return (s.mouseX - s.menu.w > x && s.mouseX - s.menu.w < x + w && s.mouseY > y && s.mouseY < y + h)
    }

    s.draw = () => {
        if (!s.pause) {

            previousSelection = s.selectedBloc

            s.background(255)

            s.menu.draw()
            s.translate(s.menu.w, 0)

            if (!s.isMouseInside(0, 0, 50, 50) || s.selectedBloc == null) {
                s.image(trashCan, 0, 0, 50, 50)
                s.trashOver = false;
            } else {
                s.image(trashCanOpen, 0, 0, 50, 50)
                s.trashOver = true;
            }

            s.fill(255, 0, 0)
            for (const bloc of s.blocs) {
                if (bloc instanceof DraggableComponent && bloc.clip) {
                    bloc.update()
                }
                let selected = s.selectedBloc;
                if (s.mousePressed && selected != null && bloc instanceof Bloc && selected instanceof Bloc) {
                    bloc.clipChild()
                }
            }
            for (const inputBox of s.inputBoxes) {
                let selected = s.selectedBloc;
                if (s.mousePressed && selected != null && selected instanceof Operator) {
                    inputBox.clipChild()
                }
            }
            for (const bloc of s.blocs) {
                bloc.draw()
            }
        }
    }

    s.spawnBloc = (value, color) => {
        let newBloc
        let x = s.mouseX - s.menu.w - 5
        let y = s.mouseY - 5
        switch (value) {
            case ACTION_AVANCER:
                newBloc = new BlocParameters(s, x, y, value, color)
                break;
            case ACTION_RECULER:
                newBloc = new BlocParameters(s, x, y, value, color)
                break;
            case ACTION_STOP:
                newBloc = new Bloc(s, x, y, 150, 30, value, color)
                break;
            case ACTION_TOURNER_DROITE:
                newBloc = new Bloc(s, x, y, 150, 30, value, color)
                break;
            case ACTION_TOURNER_GAUCHE:
                newBloc = new Bloc(s, x, y, 150, 30, value, color)
                break;
            case ACTION_ATTENDRE:
                newBloc = new BlocParameters(s, x, y, value, color)
                break;
            case UTILITAIRE_AFFICHER:
                newBloc = new BlocParameters(s, x, y, value, color)
                break
        }
        newBloc.select()
        s.blocs.push(newBloc)
    }

    s.spawnCopy = (bloc) => {
        let clone = s.cloneObject(bloc)
        clone.select()
        s.blocs.push(clone)
    }

    s.cloneObject = (obj, parent = null) => {
        let clone = Object.assign(Object.create(Object.getPrototypeOf(obj)), obj)
        if (parent != null) {
            clone.x = 1000
        }
        if (clone.isMenuItem != undefined) {
            clone.isMenuItem = false
        }
        if (parent != null && clone.parent != undefined) {
            clone.parent = parent
        }
        if (clone.inputBoxes != null) {
            clone.inputBoxes = [...clone.inputBoxes]
            let i = 0
            for (let inputBox of clone.inputBoxes) {
                clone.inputBoxes[i] = s.cloneObject(inputBox, clone)
                s.inputBoxes.push(clone.inputBoxes[i])
                i++
            }
        }
        if (clone.children != null) {
            clone.children = [...clone.children]
            for (let child of clone.children) {
                child = s.cloneObject(child, clone)
            }
        }
        if (clone.inputValues != null) {
            clone.inputValues = [...clone.inputValues]
        }
        clone.x -= s.menu.w
        return clone
    }

    mousePressed = () => {
        s.mousePressed = true
        for (bloc of s.blocs) {
            bloc.checkForClick()
        }
    }

    mouseReleased = () => {
        s.mousePressed = false
        for (bloc of s.blocs) {
            bloc.checkForClick()
        }
    }

    s.convert = () => {
        s.lines = []
        for (let bloc of s.blocs) {
            if (bloc.value == EVENT_START) {
                for (let child of bloc.children) {
                    let line = ""
                    if (child.value != VAR_SET) {
                        line = child.value
                    }
                    if (child instanceof BlocParameters) {
                        line += " " + s.blocParametersToLine(child)
                    }
                    s.lines.push(line)
                }
            }
        }
        editor.setValue(s.lines.join("\n"), 1)
    }

    s.blocParametersToLine = (bloc, n = 0) => {
        let line = n != 0 ? "(" : ""
        let i = 0
        for (let inputBox of bloc.inputBoxes) {
            if (inputBox.child != null) {
                line += s.blocParametersToLine(inputBox.child, n + 1)
                line += (i == bloc.inputBoxes.length - 1 ? "" : " " + bloc.inputValues[i] + " ")
            } else {
                line += inputBox.value + (i == bloc.inputBoxes.length - 1 ? "" : " " + bloc.inputValues[i] + " ")
            }
            i++
        }
        return line + (n != 0 ? ")" : "")
    }

    let resize = () => {
        s.menu.resize()
            //canvasDiv.css("max-width", canvasDiv.width())
            //canvasDiv.css("max-height", canvasDiv.height())
            /*if(canvasDiv.height() < canvasDiv.width()) {
                jCanvas.css('height', '100%')
                jCanvas.css('width', jCanvas.height() + "px")
            }
            else {
                jCanvas.css('width', '100%')
                jCanvas.css('height', jCanvas.width() + "px")
            }*/
    }
}

class Component {
    constructor(s, x, y, w, h, color = "yellow") {
        this.s = s
        this.x = x
        this.y = y
        this.w = w
        this.h = h
        this.color = color
        //this.diff = this.s.createVector(0, 0)
        this.borderColor = "black"
    }

    update() {

    }

    isHovering() {
        return this.s.mouseX - this.s.menu.w > this.x && this.s.mouseX - this.s.menu.w < this.x + this.w && this.s.mouseY > this.y && this.s.mouseY < this.y + this.h
    }

    hasParent() {
        return this.parent != null
    }

    getHighestParent() {
        if (this.hasParent()) {
            return this.parent.getHighestParent()
        }
        return this
    }

    select() {

    }

    isSelected() {
        return this.s.selectedBloc == this
    }

    deselect() {

    }

}

class DraggableComponent extends Component {
    constructor(s, x, y, w, h, color) {
        super(s, x, y, w, h, color)
        this.clip = false
    }

    update() {
        this.x = this.s.mouseX - this.diff.x
        this.y = this.s.mouseY - this.diff.y
    }

    select() {
        if (this instanceof Bloc && this.hasParent()) this.removeParent()
        this.clip = true
        this.diff.x = this.s.mouseX - this.x
        this.diff.y = this.s.mouseY - this.y
        this.borderColor = "white"
        this.s.selectedBloc = this
    }

    deselect() {
        this.clip = false;
        this.borderColor = "black"
        this.s.selectedBloc = null
        if (this.s.trashOver) this.delete();
    }
}

class BlocInput extends DraggableComponent {
    inputBoxes = []
    structure
    isMenuItem
    startX_offset
    parent
    constructor(template) {
        const { s, x, y, structure, color, isMenuItem, startX_offset, w, h, parent } = template;

        super(s, x, y, w, h, color)

        this.structure = structure;
        this.isMenuItem = isMenuItem ?? false;
        this.startX_offset = startX_offset ?? 5;
        this.parent = parent ?? null;

        this.parseStructure()
    }

    parseStructure() {
        for (const element of this.structure) {
            if (typeof element !== "string") {
                this.createNewInputBox(element);
            }
        }
    }

    checkForClick() {
        for (const inputBox of this.inputBoxes) {
            inputBox.checkForClick()
        }
        if (!this.s.mousePressed && this.isSelected()) {
            this.deselect()
        } else if (this.s.selectedBloc == null && this.s.mousePressed && this.isHovering()) {
            if (this.hasParentInput()) {
                this.removeParentInput()
                this.s.blocs.push(this)
            }
            this.select()
        }
    }

    update() {
        if (this instanceof Operator && this.isMenuItem) {
            this.y += this.s.menu.y
            if (this.s.mouseX <= this.x + this.w && this.s.mouseX >= this.x && this.s.mouseY - this.s.menu.y <= this.y + this.h && this.s.mouseY - this.s.menu.y >= this.y && this.s.mousePressed && this.s.selectedBloc == null) {
                this.s.spawnCopy(this)
            }
        }
        if (this.isSelected() && !this.hasParentInput()) {
            this.x = this.s.mouseX - this.diff.x
            this.y = this.s.mouseY - this.diff.y
        } else if (this.hasParentInput()) {
            this.x = this.parent.x
            this.y = this.parent.y
        }
        this.updateChildrenInput()
    }

    updateChildrenInput() {
        for (const inputBox of this.inputBoxes) {
            inputBox.update()
        }
    }

    createNewInputBox(value) {
        this.inputBoxes.push(
            new InputBox(
                this.s,
                this.inputBoxes.length == 0 ? this.w + this.startX_offset : this.w + 15,
                5,
                this,
                value.defaultValue
            )
        );
        this.updateSize();
    }

    updateSize() {
        for (const inputBox of this.inputBoxes) {
            inputBox.updateSize()
        }
        this.h = 10
        let startX = this.x
        let endX = startX
        for (let inputBox of this.inputBoxes) {
            endX = inputBox.x + inputBox.w > endX ? inputBox.x + inputBox.w + 5 : endX
            this.h = inputBox.h > this.h ? inputBox.h : this.h
        }
        this.w = endX - startX
        this.h += 10
    }

    hasParentInput() {
        return (this.parent != null && (this.parent.inputBoxes == null || this.parent.inputBoxes.includes(this)))
    }

    setParentInput(parent) {
        if (!(parent instanceof InputBox)) return
        if (this.hasParentInput()) this.removeParentInput()
        this.parent = parent
        this.parent.child = this
        this.updateAllParentsInput()
        let highestParent = this.getHighestParent()
        if (highestParent instanceof Bloc) highestParent.updateChildren()
        if (highestParent instanceof BlocEvent) this.s.convert()
        this.s.blocs = this.s.blocs.filter(value => { return value != this })
    }

    removeParentInput() {
        this.parent.child = null
        this.updateSize()
        this.updateAllParentsInput()
        let highestParent = this.getHighestParent()
        if (highestParent instanceof Bloc) highestParent.updateChildren()
        this.parent = null
        this.clippingTo = null
        this.s.blocs.push(this)
    }

    updateAllParentsInput() {
        this.updateSize()
        this.updateChildrenInput()
        this.updateSize()
        this.updateChildrenInput()
        if (this.hasParentInput()) {
            this.parent.updateAllParentsInput()
        }
    }

    draw() {
        this.s.fill(this.color);
        this.s.rect(this.x, this.y, this.w, this.h);
        let next_x = 0;
        const padding = 5;

        for (let i = 0; i < this.structure.length; i++) {
            const element = this.structure[i];

            if (typeof element === "string") {
                this.s.fill("black");
                this.s.text(element, next_x, this.y + this.h / 2 + 6);
            } else {
                if (i < this.inputBoxes.length - 1) {
                    const inputBox = this.inputBoxes[i];
                    inputBox.draw();
                    next_x = inputBox.x + inputBox.w + padding;
                }
            }
        }
        if (this.isMenuItem) {
            this.y -= this.s.menu.y;
        }
    }
}



class Bloc extends BlocInput {
    constructor(s, x, y, w, h, structure, color = "yellow", isMenuItem = false, inputValues = [], startX_offset = 5) {
        super({ s, x, y, w, h, structure, color, isMenuItem, startX_offset, parent: null})
        this.clippingTo = null
        this.children = []
    }

    update() {
        if (this.isMenuItem) {
            this.y += this.s.menu.y
            if (this.s.mouseX <= this.x + this.w && this.s.mouseX >= this.x && this.s.mouseY - this.s.menu.y <= this.y + this.h && this.s.mouseY - this.s.menu.y >= this.y && this.s.mousePressed && this.s.selectedBloc == null) {
                this.s.spawnCopy(this)
            }
        }
        if (this.inputBoxes.length > 0) super.update()
        if (this.hasParent()) this.parent.updateChildren()
        else if (!this.isMenuItem) {
            this.x = this.s.mouseX - this.diff.x
            this.y = this.s.mouseY - this.diff.y
        }
        if (this.children.length > 0) this.updateChildren()
    }

    updateChildren() {
        let h = this.h
        for (let child of this.children) {
            child.x = this.x
            child.y = this.y + h
            if (child.children.length > 0) child.updateChildren()
            if (child.inputBoxes.length > 0) {
                child.updateChildrenInput()
            }
            h += child.h
        }
    }

    /*checkForClick() {
        if (!this.s.mousePressed && this.isSelected()) {
            this.deselect()
        } else if (this.s.selectedBloc == null && this.s.mousePressed && this.isHovering()) {
            this.select()
        }
    }*/


    draw() {
        this.s.stroke(this.borderColor)
        this.s.fill(this.color)
        this.s.rect(this.x, this.y, this.w, this.h)
        this.s.fill("black")
        this.s.text(this.value, this.x + 6, this.y + this.h / 2 + 4);
        if (this.isMenuItem) {
            this.y -= this.s.menu.y
        }
    }

    setParent(futureParent, index = 0) {
        if (this.hasParent()) this.removeParent()
        if (!(futureParent instanceof BlocParent) && futureParent.hasParent()) {
            index = futureParent.parent.children.indexOf(futureParent) + 1
            futureParent = futureParent.parent
        }
        this.parent = futureParent
        this.parent.children.splice(index, 0, this)

        if (!(this instanceof BlocParent)) {
            for (let child of this.children) {
                index++
                child.setParent(this.parent, index)
            }
        }
        this.parent.updateChildren()
        this.s.convert()
    }

    removeParent() {
        this.parent.children = this.parent.children.filter(value => value != this)
        this.parent.updateChildren()
        this.parent = null
        this.clippingTo = null
    }

    hasParent() {
        return this.parent != null
    }

    clipChild() {
        if (this.s.selectedBloc instanceof BlocEvent) return
        if (this.s.selectedBloc == this) return
        if (this.s.selectedBloc.children.includes(this)) return
        let dx = Math.max(this.x - this.s.mouseX + this.s.menu.w, 0, this.s.mouseX - (this.x + this.w) - this.s.menu.w);
        let dy = this.s.mouseY - (this.y + this.h);
        let dist = Math.sqrt(dx * dx + dy * dy);
        let bloc = this.s.selectedBloc
        if (dist < 20 && !bloc.hasParent()) {
            bloc.clippingTo = this
            bloc.setParent(this)
        } else if (dist >= 20 && bloc.clippingTo == this) bloc.removeParent()
    }

    delete() {
        if (this instanceof BlocEvent) return;
        /*this.s.blocs = this.s.blocs.filter(value => {
            return (value == this || this.children.includes(value)) ?
                ((value instanceof BlocParameters) ? value.input.remove() : false) :
                true;
        })
        this.s.convert();*/
    }
}

/*class BlocParameters extends Bloc {
    constructor(s, x, y, w, h, value, color = "yellow") {
        super(s, x, y, w, h, value, color)
        new InputBox(this.s, this.w + 5, 5, this)
    }

    draw() {
        this.s.stroke(this.borderColor)
        this.s.fill(this.color)
        this.s.rect(this.x, this.y, this.w, this.h)
        this.s.fill("black")
        this.s.text(this.value, this.x + 6, this.y + this.h / 2 + 4);
    }
}*/

class BlocParent extends Bloc {
    constructor(s, x, y, w, h, structure, color = "yellow") {
        super({ s, x, y, w, h, structure, color })
    }
}

class BlocEvent extends BlocParent {
    constructor(s, x, y, w, h, structure, color = "yellow") {
        super(s, x, y, w, h, structure, color)
    }
}


/*class Operator extends DraggableComponent {
    constructor(s, x, y, w, h, value, color) {
        super(s, x, y, w, h, value, color)
    }

    draw() {
        this.s.fill(this.color)
        this.s.rect(this.x, this.y, this.w, this.h, 50)
    }
}

class OperatorVariable extends Operator {
    constructor(s, x, y, w, h, value, color) {
        super(s, x, y, w, h, value, color)
    }
}
*/



class BlocParameters extends Bloc {
    constructor(s, x, y, structure, color, isMenuItem = false, startX_offset = 70, w = 0, h = 30, parent = null) {
        super({ s, x, y, w, h, structure, color, isMenuItem, startX_offset, parent })
    }

    draw() {
        this.s.stroke(this.borderColor)
        this.s.fill(this.color)
        this.s.rect(this.x, this.y, this.w, this.h)
        this.s.fill("black")
        this.s.text(this.value, this.x + 6, this.y + this.h / 2 + 4);
        let i = 0
        for (const inputBox of this.inputBoxes) {
            inputBox.draw()
            if (i < this.inputBoxes.length - 1) {
                this.s.fill("black")
                this.s.text(this.operators[i], inputBox.x + inputBox.w + 5, this.y + this.h / 2 + 6)
            }
            i++
        }
        if (this.isMenuItem) {
            this.y -= this.s.menu.y
        }
    }
}

class Operator extends BlocInput {
    constructor(s, x, y, color, isMenuItem = false, startX_offset = 5, w = 0, h = 30, parent = null) {
        super({ s, x, y, w, h, color, startX_offset, parent, isMenuItem })
    }

    draw() {
        this.s.stroke(this.borderColor)
        this.s.fill(this.color)
        this.s.rect(this.x, this.y, this.w, this.h, 1000 / this.h)
        let i = 0
        for (const inputBox of this.inputBoxes) {
            inputBox.draw()
            if (i < this.inputBoxes.length - 1) {
                this.s.fill("black")
                this.s.text(this.operators[i], inputBox.x + inputBox.w + 5, this.y + this.h / 2 + 6)
            }
            i++
        }
        if (this.isMenuItem) {
            this.y -= this.s.menu.y
        }
    }
}

class InputBox extends Component {
    constructor(s, offsetX, offsetY, parent) {
        let x = parent.x + offsetX
        let y = parent.y + offsetY
        let w = 30
        let h = 20
        super(s, x, y, w, h, "white")
        this.offsetX = offsetX
        this.offsetY = offsetY
        this.parent = parent
        this.child = null

        this.defaultW = 15
        this.defaultH = 20

        this.s.inputBoxes.push(this)

    }

    checkForClick() {
        if (this.child != null) {
            this.child.checkForClick()
        } else {
            if (this.s.mousePressed && this.isSelected()) {
                this.deselect()
            } else if (this.s.selectedBloc == null && this.s.mousePressed && this.isHovering()) {
                this.select()
            }
        }
    }

    select() {
        this.s.selectedBloc = this
        this.htmlInput = this.s.createInput(this.value.toString())
        this.htmlInput.size(this.w, this.h)
        this.htmlInput.position(this.s.menu.w + 7 + this.x - this.s.canvasDiv[0].scrollLeft, 75 + this.y - this.s.canvasDiv[0].scrollTop);
        setTimeout(() => {
            this.htmlInput.elt.focus()
            this.htmlInput.elt.select()
        }, 10)
    }

    deselect() {
        this.s.selectedBloc = null
        let oldValue = this.value
        this.value = this.htmlInput.value()
        this.updateAllParentsInput()
        if (oldValue != this.value && this.getHighestParent() instanceof BlocEvent) this.s.convert()
        this.htmlInput.remove()
    }

    clipChild() {
        if (!(this.s.selectedBloc instanceof Operator)) return
        if (this.child != null && this.child != this.s.selectedBloc) return
        if (this.s.selectedBloc.inputBoxes[0] == this) return
        if (this.s.selectedBloc.inputBoxes[1] == this) return
        if (this.parent.isMenuItem) return
            /*let dx = Math.max(this.x - this.s.mouseX, 0, this.s.mouseX - (this.x + this.w));
            let dy = this.s.mouseY - (this.y + this.h);
            let dist = Math.sqrt(dx * dx + dy * dy);*/

        let collide = this.s.isMouseInside(this.x, this.y, this.w, this.h)

        let operator = this.s.selectedBloc
        if (collide && !operator.hasParentInput()) {
            operator.clippingTo = this
            operator.setParentInput(this)
        } else if (!collide && operator.clippingTo == this) operator.removeParentInput()
    }

    update() {
        this.x = this.parent.x + this.offsetX
        this.y = this.parent.y + this.offsetY
        if (this.child != null) {
            this.child.update()
        }
    }

    updateSize() {
        if (this.child != null) {
            this.w = this.child.w
            this.h = this.child.h
        } else {
            this.s.textSize(15)
            this.w = this.s.textWidth(this.value) + this.defaultW
            this.h = this.defaultH
        }

        let x = this.parent.startXOffset
        for (let inputBox of this.parent.inputBoxes) {
            if (inputBox == this) {
                this.offsetX = x
                break;
            }
            x += inputBox.w + 20
        }

        this.offsetY = (this.parent.h - this.h) / 2
        this.y = this.parent.y + this.offsetY
    }

    draw() {
        this.s.stroke(this.parent.borderColor)
        this.s.fill("white")
        this.s.rect(this.x, this.y, this.w, this.h, 50)
        if (this.s.value == null) {
            this.s.fill("black")
            this.s.textAlign(this.s.CENTER)
            this.s.text(this.value, this.x + this.w / 2, this.y + this.h / 2 + 5)
            this.s.textAlign(this.s.LEFT)
        }
        if (this.child != null) this.child.draw()
    }

    updateAllParentsInput() {
        this.updateSize()
        this.update()
        if (this.hasParent()) {
            this.parent.updateAllParentsInput()
        }
    }

    addChild(child) {
        this.child = child
    }
}

class BlocGrabber {
    constructor(menu, s, x, y, w, h, value, color) {
        this.menu = menu
        this.s = s
        this.x = x
        this.y = y
        this.w = w
        this.h = h
        this.value = value
        this.color = color
        this.borderColor = "black"
    }

    update() {
        if (this.s.mouseX <= this.x + this.w && this.s.mouseX >= this.x && this.s.mouseY - this.menu.y <= this.y + this.h && this.s.mouseY - this.menu.y >= this.y) this.hover()
        else this.borderColor = "black"
        this.draw()
    }

    draw() {
        this.s.fill(this.color)
        this.s.stroke(this.borderColor)
        this.s.rect(this.x + this.menu.x, this.y + this.menu.y, this.w, this.h)
        this.s.fill("black")
        this.s.textSize(20)
        this.s.text(this.value, this.x + 10 + this.menu.x, this.y + this.h / 2 + 5 + this.menu.y)
        this.s.textSize(15);
    }

    hover() {
        this.borderColor = "white"
        if (this.s.mousePressed && this.s.selectedBloc == null) {
            let newBloc
            let x = this.s.mouseX - this.menu.w - 5
            let y = this.s.mouseY - 5
            switch (this.value) {
                case ACTION_AVANCER:
                    newBloc = new BlocParameters(s, x, y, this.value, this.color)
                    break;
                case ACTION_RECULER:
                    newBloc = new BlocParameters(s, x, y, this.value, this.color)
                    break;
                case ACTION_STOP:
                    newBloc = new Bloc(s, x, y, 150, 30, this.value, this.color)
                    break;
                case ACTION_TOURNER_DROITE:
                    newBloc = new Bloc(s, x, y, 150, 30, this.value, this.color)
                    break;
                case ACTION_TOURNER_GAUCHE:
                    newBloc = new Bloc(s, x, y, 150, 30, this.value, this.color)
                    break;
                case ACTION_ATTENDRE:
                    newBloc = new BlocParameters(s, x, y, this.value, this.color)
                    break;
                case UTILITAIRE_AFFICHER:
                    newBloc = new BlocParameters(s, x, y, this.value, this.color)
                    break
            }

            newBloc.select()
            this.s.blocs.push(newBloc)
        }
    }
}

class MenuSeparator {
    constructor(menu, s, x, y, text) {
        this.menu = menu
        this.s = s
        this.x = x
        this.y = y
        this.text = text
    }

    update() {
        this.draw()
    }

    draw() {
        this.s.fill("black")
        this.s.noStroke()
        this.s.textSize(20)
        this.s.text(this.text, this.x + this.menu.x, this.y + 30 + this.menu.y)
        this.s.textSize(15);
    }
}


new p5(sketchInterface, 'interface');

