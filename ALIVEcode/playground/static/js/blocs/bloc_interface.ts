//------------------------ Types ----------------------------//

type Style = {
    color?: string
    borderColor?: string
    font?: string
    fontSize?: number

}


type InputType = {
    [name in keyof { texte, entier, decimal, variable, liste, booleen }]: {
        defaultValue: any;
        style: Style;
        validValue: (value: any) => boolean;
        toAliveScript: (value: any) => string;
    };
};

const inputModels: InputType = {
    texte: {
        defaultValue: 'hello world!',
        style: {
            color: "#E53935"
        },
        validValue: (value) => true,
        toAliveScript: (value) => String(`"${value}"`),
    },
    entier: {
        defaultValue: 0,
        style: {
            color: "#4FC3F7"
        },
        validValue: (value) => !isNaN(value) && String(value).length > 0,
        toAliveScript: (value) => String(value),
    },
    decimal: {
        defaultValue: 0.0,
        style: {
            color: "#4FC3F7"
        },
        validValue: (value) => !isNaN(value) && String(value).length > 0,
        toAliveScript: (value) => String(value),
    },
    variable: {
        defaultValue: "x",
        style: {

        },
        validValue: (value) => isNaN(value),
        toAliveScript: (value) => String(value),
    },
    liste: {
        defaultValue: "{}",
        style: {

        },
        validValue: (value) => true,
        toAliveScript: (value) => String(`{${value}}`),
    },
    booleen: {
        defaultValue: "vrai",
        style: {
            color: "lightgreen"
        },
        validValue: (value) => value === "vrai" || value === "faux",
        toAliveScript: (value) => String(value),
    },
};

type inputTypeName = keyof typeof inputModels;

type structureType = Array<string | InputBox | CodeBox>
type structureTemplate = Array<string | { type: inputTypeName; valeur?: any }>

type Position = { x: number, y: number }


type Menu = {
    x: number
    y: number
    w: number
    h: number
    components: MenuComponent[]
    setComponents: () => void
    draw: () => void
    resize: () => void
}


interface sType {
    blocs: CodeBox[];
    mousePressed: boolean;
    selectedBloc: CodeBox;
    pause: boolean;
    trashOver: boolean;
    blocs_interface: any;
    preload: () => void;
    loadImage(path: string): any;
    setup: () => void;
    canvasDiv: any;
    startBloc: Commande;
    createCanvas(width: number, height: number): any;
    noStroke: () => void;
    fill(r: number, g: number, b: number): void;
    fill(colorName: string): void;
    rect(x: any, y: any, w: any, h: any);
    textSize(size: number): number;
    frameRate(fps: number): void;
    isMouseInside: (x: number, y: number, w: number, h: number) => boolean;
    mouseX: number;
    mouseY: number;
    draw: () => void;
    background(color: number): void;
    translate(x: number, y: number): void;
    image(image: any, x: number, y: number, w: number, h: number): void;
    spawnBloc: (value: any, color: any) => void;
    spawnCopy: (bloc: CodeBox) => void;
    cloneObject(bloc: CodeBox);
    convert: () => void;
    lines: any[];
    blocParametersToLine: (bloc: any, n?: number) => string;
    leftPannel: any;
    menu: Menu;

}





//------------------------ Components ----------------------------//

abstract class Component {
    public s: any;
    public x: number;
    public y: number;
    public w: number;
    public h: number;
    public style: Style;
    public roundness: number = 0;

    constructor(
        s: any,
        x: number,
        y: number,
        w: number,
        h: number,
        style: Style
    ) {
        this.s = s;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.style = style;
    }

    collidePoint(x: number, y: number): boolean {
        return (
            x > this.x - this.s.menu.w && x < this.x - this.s.menu.w + this.w && y > this.y && y < this.y + this.h
        );
    }

    setPos(x: number, y: number): void {
        this.x = x
        this.y = y
    }

    move(relativeX: number, relativeY: number): void {
        this.x -= relativeX
        this.y -= relativeY
    }

    get rect() {
        return this.s.rect(this.x, this.y, this.w, this.h, this.roundness)
    }

    get center(): { x: number, y: number } {
        return { x: this.x + this.w / 2, y: this.y + this.h / 2 }
    }

    abstract update(): void;

    abstract draw(): void;
}

abstract class MenuComponent extends Component {

    abstract onClick(): void;

    collidePoint(x: number, y: number): boolean {
        return (
            x > this.x && x < this.x + this.w && y > this.y && y < this.y + this.h
        );
    }

}


abstract class BlocComponent extends Component {
    private draggable: boolean
    protected focus: boolean = false;

    constructor(
        s: any,
        x: number,
        y: number,
        w: number,
        h: number,
        draggable: boolean,
        style: Style
    ) {
        super(s, x, y, w, h, style)
        this.draggable = draggable
    }

    get isDraggable(): boolean {
        return this.draggable;
    }

    public abstract set isFocus(value: boolean);

    public abstract get isFocus(): boolean;

    abstract delete(): void;
}


//------------------------ Boxes ----------------------------//

class InputBox extends BlocComponent {
    private inputType: { defaultValue: any; style: Style; validValue: (value: any) => boolean; toAliveScript: (value: any) => string };
    private inputTypeName: inputTypeName;
    private value: any;
    private htmlInput: any;
    private htmlTypeChoice: any;


    constructor(
        s: any,
        x: number,
        y: number,
        h: number,
        inputType: inputTypeName = "texte",
        value?: any,
        w?: number
    ) {
        super(s, x, y, w ?? 0, h, false, { color: "white" });
        this.inputTypeName = inputType;
        this.inputType = inputModels[inputType];
        this.value = value ?? this.inputType.defaultValue;
        this.update();
        this.style = this.inputType.style;
        this.roundness = 50
    }

    setInputType(inputTypeName: inputTypeName) {
        this.inputType = inputModels[inputTypeName];
        this.style = this.inputType.style;
    }

    setValue(v: any) {
        this.value = v;
    }

    toAliveScript(): string {
        return this.inputType.toAliveScript(this.value)
    }

    update(): void {
        this.w = this.s.textSize() * String(this.value).length / 2 + 10
    }

    delete(): void { }

    public get isFocus(): boolean {
        return this.focus
    }

    public set isFocus(value: boolean) {
        this.focus = value
        if (this.isFocus) {
            this.htmlTypeChoice = this.s.createSelect()
            this.htmlTypeChoice.position(this.s.menu.w + 7 + this.x - this.s.canvasDiv[0].scrollLeft - 50,
                75 + this.y - this.s.canvasDiv[0].scrollTop);

            /* show the type options */
            this.htmlTypeChoice.option(this.inputTypeName);
            Object.keys(inputModels).filter(t => t !== this.inputTypeName).forEach(t => this.htmlTypeChoice.option(t))

            this.htmlInput = this.s.createInput(this.value.toString())
            this.htmlInput.size(Math.max(this.w + 20, 75), this.h)
            this.htmlInput.position(this.s.menu.w + 7 + this.x - this.s.canvasDiv[0].scrollLeft + 50, 75 + this.y - this.s.canvasDiv[0].scrollTop);
            setTimeout(() => {
                this.htmlInput.elt.focus()
                this.htmlInput.elt.select()
            }, 10)
        } else {
            this.inputTypeName = this.htmlTypeChoice?.value() ?? this.inputTypeName;
            this.setInputType(this.inputTypeName)

            const newValue = this.htmlInput?.value() ?? this.value

            if (this.inputType.validValue(newValue)) {
                this.value = newValue;
            } else {
                /* FAIRE UNE ERREUR POUR DIRE AU USER QUE SON ENTRÉE EST PAS VALIDE */
                this.value = this.inputType.defaultValue;
            }

            this.htmlInput?.remove()
            this.htmlTypeChoice?.remove()
            this.w = this.s.textSize() * String(this.value).length
        }
    }

    draw(): void {
        this.update()
        this.s.fill(this.style.color ?? "white")
        this.rect
        if (this.s.value == null) {
            this.s.fill("black")
            this.s.textAlign(this.s.CENTER)
            this.s.text(this.value, this.center.x, this.center.y + 5)
            this.s.textAlign(this.s.LEFT)
        }
    }
}



abstract class CodeBox extends BlocComponent {
    public readonly stackable: boolean
    public structure: structureType
    private initialStructure: structureTemplate
    protected padding: number = 5
    public diffPos: Position;
    private aliveScriptTemplate: structureTemplate

    constructor(
        s: any,
        x: number,
        y: number,
        w: number,
        h: number,
        stackable: boolean,
        color: string,
        borderColor: string,
        structureTemplate: structureTemplate,
        aliveScriptTemplate?: structureTemplate
    ) {
        super(s, x, y, w, h, true, { color, borderColor });
        this.stackable = stackable;
        this.initialStructure = structureTemplate;
        this.aliveScriptTemplate = aliveScriptTemplate;
        this.structure = this.initStructure();
        this.w = this.getWidth()
    }

    collidePoint(x: number, y: number): boolean {
        return (
            x > this.x - this.s.menu.w && x < this.x - this.s.menu.w + this.w && y > this.y && y < this.y + this.h
        );
    }

    move(relativeX: number, relativeY: number): void {
        super.move(relativeX, relativeY);
        this.interactiveElements.forEach(element => {
            element.move(relativeX, relativeY)
        });
    }

    setPos(x: number, y: number): void {
        const prevPos: Position = { x: this.x, y: this.y }
        super.setPos(x, y);
        this.interactiveElements.forEach(element => {
            element.move(prevPos.x - this.x, prevPos.y - this.y)
        });
    }

    insertStackable(element: CodeBox) {
        for (const child of this.interactiveElements) {
            if (this.s.isMouseInside(child.x, child.y, child.w, child.h)) {
                if (child instanceof InputBox) {
                    const idx = this.structure.findIndex(b => b === child);
                    const ancienChild = this.structure[idx] as InputBox;
                    element.setPos(ancienChild.x, ancienChild.y)
                    this.structure[idx] = element;
                    element.delete()
                } else {
                    child.insertStackable(element);
                }
                return
            }
        }
    }

    initStructure(): structureType {
        let next_x = this.x;
        return this.initialStructure.map(v => {
            if (typeof v === "string") {
                next_x += this.s.textSize() * v.length / 2 + this.padding;
                return v;
            }
            const next_input = new InputBox(this.s, next_x, this.y, this.h, v.type, v.valeur);
            next_x += next_input.w + this.padding;
            return next_input;
        });
    }

    updateStructure(): void {
        let next_x = this.x;
        for (let i = 0; i < this.structure.length; i++) {
            const struc = this.structure[i];
            if (struc == null) {
                const type = this.initialStructure[i] as { type: inputTypeName; valeur?: any };
                this.structure[i] = new InputBox(this.s, next_x, this.y, this.h, type.type);
            }
            else next_x += (typeof struc === "string" ? this.s.textSize() * struc.length / 2 : struc.w) + this.padding;
        }
    }

    public get interactiveElements(): CodeBox[] {
        return this.structure.filter(v => v instanceof InputBox || v instanceof CodeBox) as CodeBox[]
    }

    public get isFocus() {
        return this.focus;
    }

    public set isFocus(value: boolean) {
        this.focus = value
        if (this.isFocus) {
            for (const child of this.interactiveElements) {
                if (this.s.isMouseInside(child.x, child.y, child.w, child.h)) {
                    child.isFocus = true;
                    if (this.s.selectedBloc === child) {
                        this.s.blocs.push(child)
                        this.structure = this.structure.map(e => e === child ? null : e);
                        this.updateStructure()
                    }
                    return
                }
            }
            this.s.selectedBloc = this
            this.diffPos = {
                x: this.s.mouseX - this.x,
                y: this.s.mouseY - this.y
            }
        } else {
            this.interactiveElements.forEach(e => e.isFocus = false);
        }
    }

    getWidth(): number {
        return this.structure.reduce((acc, v) => {
            if (v instanceof InputBox || v instanceof CodeBox)
                acc += v.w + this.padding
            if (typeof v === "string")
                acc += this.s.textSize() * v.length / 2 + this.padding;
            return acc
        }, this.padding)
    }

    update(): void {
        this.w = Math.max(this.getWidth(), 100)

        if (this.s.selectedBloc === this) {
            const startPos: Position = { x: this.x, y: this.y }
            this.x = this.s.mouseX - this.diffPos.x
            this.y = this.s.mouseY - this.diffPos.y
            this.interactiveElements.forEach(element => {
                element.move(startPos.x - this.x, startPos.y - this.y)
            });
        }
    }

    draw(): void {
        this.update()

        if (this.s.selectedBloc === this) {
            this.s.stroke("white")
        } else {
            this.s.stroke(this.style.borderColor)
        }
        this.s.fill(this.style.color)
        this.rect

        let next_x = this.padding;
        this.structure.forEach(e => {
            if (typeof e === "string") {
                this.s.fill("black")
                this.s.text(e, this.x + next_x, this.y + this.h / 2 + 5);
                next_x += Math.max(this.s.textSize() * e.length / 2, 2 * this.padding);
            } else {
                e.x = this.x + next_x;
                (e as BlocComponent).draw();
                next_x += e.w + this.padding;
            }
        })
    }

    delete() {
        this.s.blocs = this.s.blocs.filter(b => b !== this)
    }

    toAliveScript(): string {
        let aliveScriptStruc = this.structure.map(e => e);
        if (this.aliveScriptTemplate) {
            for (let i = 0; i < aliveScriptStruc.length; i++) {
                aliveScriptStruc[i] = typeof aliveScriptStruc[i] === "string" ? this.aliveScriptTemplate[i] as string : aliveScriptStruc[i];
            }
        }
        return aliveScriptStruc.map(e => e instanceof BlocComponent ? e.toAliveScript() : e).join(" ");
    }
}



//------------------------ Specific Boxes ----------------------------//

class Commande extends CodeBox {
    private childBox: Commande = null;
    public childPreview: Commande = null;
    constructor(
        s: any,
        x: number,
        y: number,
        w: number,
        h: number,
        color: string,
        structure: structureTemplate,
        structureTemplate?: structureTemplate,
        borderColor: string = "black"
    ) {
        super(s, x, y, w, h, false, color, borderColor, structure, structureTemplate)
    }

    public get child() {
        return this.childBox;
    }

    public set child(newChild: Commande) {
        if (newChild === null) {
            this.childBox = null
            return
        }
        if (this.child !== null) {
            newChild.child = this.child
        }
        this.childBox = newChild
        this.child.setPos(this.x, this.y + this.h)
    }

    checkForChildPreview() {
        if (this.s.mousePressed) {
            if (this.s.selectedBloc === this || this.s.selectedBloc === this.child || this.s.selectedBloc === null || !(this.s.selectedBloc instanceof Commande)) return

            const dx = Math.max(this.x - this.s.mouseX + this.s.menu.w, 0, this.s.mouseX - (this.x + this.w) - this.s.menu.w);
            const dy = this.s.mouseY - (this.y + this.h);
            const dist = Math.sqrt(dx * dx + dy * dy);
            const bloc: Commande = this.s.selectedBloc
            if (dist < 20) {
                this.childPreview = bloc
            } else {
                if (this.childPreview !== null) this.child?.setPos(this.x, this.y + this.h)
                this.childPreview = null
            }
        }
    }

    update() {
        const startPos: Position = { x: this.x, y: this.y }
        super.update()
        if (this.s.selectedBloc === this) this.child?.move(startPos.x - this.x, startPos.y - this.y)
        else if (this.s.mousePressed) {
            if (this.child !== null && this.s.isMouseInside(this.child.x, this.child.y, this.child.w, this.child.h)) {
                this.child.isFocus = true
                if (this.s.selectedBloc === this.child) this.child = null
            }
        }
    }

    draw() {
        super.draw()
        if (this.childPreview !== null) {
            this.childPreview.setPos(this.x, this.y + this.h)
            this.child?.setPos(this.x, this.y + this.h + this.childPreview.h)
        }
        this.child?.draw()
    }

    delete() {
        super.delete()
        this.child?.delete()
    }

    toAliveScript() {
        const childCode: string = this.child ? "\n" + this.child.toAliveScript() : ""
        return super.toAliveScript() + childCode
    }
}


class Expression extends CodeBox {
    constructor(
        s: any,
        x: number,
        y: number,
        w: number,
        h: number,
        color: string,
        structure: structureTemplate,
        structureTemplate?: structureTemplate,
        borderColor: string = "black"
    ) {
        super(s, x, y, w, h, true, color, borderColor, structure, structureTemplate)
        this.roundness = 50
        this.padding = 10
    }
}





class MenuCategory extends MenuComponent {
    private text: string
    private menu: Menu
    public elements: MenuBlocTemplate[] = []
    private state: "open" | "close" = "open"

    constructor(menu: Menu, s: any, x: number, y: number, text: string) {
        super(s, x, y, 210, s.blocs_interface.height(), {})
        this.menu = menu
        this.text = text
    }

    getState(): "open" | "close" {
        return this.state
    }

    update() {
        this.draw()
    }

    delete(): void {

    }

    onClick(): void {
        console.log("test")
        if (this.getState() === "open") this.close()
        else if (this.getState() === "close") this.open()
    }

    close(): void {
        this.s.menu.components = this.s.menu.components.filter(e => !(e instanceof MenuBlocTemplate) || !this.elements.includes(e))
        this.state = "close"
    }

    open(): void {
        for (const element of this.elements) this.s.menu.components.push(element)
        this.state = "open"
    }

    toAliveScript(): string {
        throw new Error("Method not implemented.");
    }

    draw() {
        this.s.fill("black")
        this.s.noStroke()
        this.s.textSize(20)
        this.s.text(this.text, this.x + this.menu.x, this.y + 30)
        this.s.textSize(15);
    }
}


class MenuBlocTemplate extends MenuComponent {
    private template: CodeBox

    constructor(
        template: CodeBox,
        menu: MenuCategory
    ) {
        super(template.s, template.x, template.y, template.w, template.h, template.style);
        this.template = template
        this.template.update()
        menu.elements.push(this)
    }

    onClick(): void {
        const newBloc: CodeBox = this.s.cloneObject(this.template);
        newBloc.structure = newBloc.initStructure()
        this.s.selectedBloc = newBloc
        newBloc.diffPos = {
            x: newBloc.s.mouseX - newBloc.x,
            y: newBloc.s.mouseY - newBloc.y
        }
        this.s.blocs.push(newBloc)
    }

    update(): void {
        this.draw()
    }

    draw(): void {
        this.template.setPos(this.x, this.y + 15)
        this.template.draw()
    }
}




//---------------------------------- load --------------------------------------------//







let trashCan;
let trashCanOpen;
let editor;

function sketchInterface(s: sType) {
    const width = 1500
    const height = 1000
    let canvas
    s.menu
    s.leftPannel
    s.blocs = []
    let parents = []
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

        s.startBloc = new Commande(s, 70, 50, 200, 30, "lightgreen",
            ["DÉBUT"],
            ["# début du programme"]);

        s.blocs.push(s.startBloc)
        /*
        s.blocs.push(new Operator(s, 100, 100, "qqlchose", [Operator_ADDITION, Operator_ADDITION], "yellow", 3))
        s.blocs.push(new Operator(s, 100, 150, "addition", [Operator_ADDITION], "yellow", 2))
        s.blocs.push(new Operator(s, 100, 200, "addition", [Operator_ADDITION], "yellow", 2))
        s.blocs.push(new Operator(s, 100, 250, "soustraction", [Operator_SOUSTRACTION], "yellow", 2))
        s.blocs.push(new Operator(s, 100, 300, "multiplication", [Operator_MULTIPLICATION], "yellow", 2))
        s.blocs.push(new Operator(s, 100, 350, "division", [Operator_DIVISION], "yellow", 2))
        s.blocs.push(new Operator(s, 100, 400, "exposant", [Operator_EXPOSANT], "yellow", 2))
        */

        canvas = s.createCanvas(width, height)
        canvas.parent("blocs-interface")
        canvas.mousePressed(mousePressed)
        canvas.mouseReleased(mouseReleased)

        const menu: Menu = {
            x: 0,
            y: 0,
            w: 220,
            h: s.blocs_interface.height(),
            components: [],
            setComponents: function () {
                this.components = []
                const addComponents = (...elements: Component[]) => {
                    let i = this.components.length
                    for (const el of elements) {
                        el.y = 40 * i
                        this.components.push(el)
                        i++
                    }
                }


                const catMouvement = new MenuCategory(this, s, 20, 0, "Mouvements")
                const catMaths = new MenuCategory(this, s, 20, 0, "Maths")

                addComponents(
                    catMouvement,
                    new MenuBlocTemplate(new Commande(s, 20, 0, 150, 30, "#ffbd00",
                        ["afficher", { type: "texte", valeur: "hello world!" }]), catMouvement),

                    new MenuBlocTemplate(new Commande(s, 20, 0, 150, 30, "#ffbd00",
                        ["lire dans", { type: "variable", valeur: "msg" }]), catMouvement),

                    new MenuBlocTemplate(new Commande(s, 20, 0, 150, 30, "#ffbd00",
                        ["avancer"]), catMouvement),

                    new MenuBlocTemplate(new Commande(s, 20, 0, 150, 30, "#ffbd00",
                        ["reculer"]), catMouvement),

                    new MenuBlocTemplate(new Commande(s, 20, 0, 150, 30, "#ffbd00",
                        ["tournerDroite"]), catMouvement),

                    new MenuBlocTemplate(new Commande(s, 20, 0, 150, 30, "#ffbd00",
                        ["tournerGauche"]), catMouvement),

                    new MenuBlocTemplate(new Commande(s, 20, 0, 150, 30, "#ffbd00",
                        ["avancer ", { type: "entier", valeur: 1 }],
                        ["avancer", null]), catMouvement),

                    new MenuBlocTemplate(new Commande(s, 20, 0, 150, 30, "#ffbd00",
                        ["reculer", { type: "entier", valeur: 1 }]), catMouvement),

                    new MenuBlocTemplate(new Commande(s, 20, 0, 150, 30, "#ffbd00",
                        ["attendre", { type: "entier", valeur: 1 }]), catMouvement),

                    new MenuBlocTemplate(new Commande(s, 20, 0, 150, 30, "#ffbd00",
                        ["tourner", { type: "entier", valeur: 45 }]), catMouvement),

                    new MenuBlocTemplate(new Commande(s, 20, 0, 150, 30, "#ffbd00",
                        ["variable:", { type: "variable", valeur: "x" }, "valeur:", { type: "texte", valeur: "abc" }],
                        ["", null, "=", null]), catMouvement),
                    //new Bloc(s, 20, 0, 150, 30, ACTION_RECULER, "#ffbd00", true),
                    //new BlocParameters(s, 20, 0, ACTION_AVANCER, "#ffbd00", true, [1]),
                    //new BlocParameters(s, 20, 0, ACTION_RECULER, "#ffbd00", true, [1]),
                    //new Bloc(s, 20, 0, 150, 30, ACTION_STOP, "red", true),
                    //new BlocParameters(s, 20, 170, ACTION_TOURNER, "yellow", true, [180]),
                    //new Bloc(s, 20, 0, 150, 30, ACTION_TOURNER_DROITE, "yellow", true),
                    //new Bloc(s, 20, 0, 150, 30, ACTION_TOURNER_GAUCHE, "yellow", true),
                    catMaths,

                    new MenuBlocTemplate(new Expression(s, 20, 0, 150, 30, "lightgray",
                        [{ type: "entier", valeur: 1 }, "+", { type: "entier", valeur: 1 }]), catMaths),

                    new MenuBlocTemplate(new Expression(s, 20, 0, 150, 30, "lightgray",
                        [{ type: "entier", valeur: 1 }, "-", { type: "entier", valeur: 1 }]), catMaths),

                    new MenuBlocTemplate(new Expression(s, 20, 0, 150, 30, "lightgray",
                        [{ type: "entier", valeur: 1 }, "×", { type: "entier", valeur: 1 }],
                        [null, "*", null]), catMaths),

                    new MenuBlocTemplate(new Expression(s, 20, 0, 150, 30, "lightgray",
                        [{ type: "entier", valeur: 1 }, "/", { type: "entier", valeur: 1 }]), catMaths),


                    //new BlocParameters(s, 20, 0, UTILITAIRE_AFFICHER, "#34abeb", true, ['"Hello World!"']),
                    //new BlocParameters(s, 20, 0, UTILITAIRE_LIRE, "#34abeb", true, ["a"]),
                    //new MenuSeparator(this, s, 20, 0, "Opérations"),
                    //new Operator(s, 20, 0, "+", [Operator_ADDITION], "yellow", true, [0, 0]),
                    //new Operator(s, 20, 0, "qqlchose", [Operator_SOUSTRACTION], "yellow", true, [0, 0]),
                    //new Operator(s, 20, 0, "qqlchose", [Operator_MULTIPLICATION], "yellow", true, [0, 0]),
                    //new Operator(s, 20, 0, "qqlchose", [Operator_DIVISION], "yellow", true, [0, 0]),
                    //new Operator(s, 20, 0, "qqlchose", [Operator_EXPOSANT], "yellow", true, [0, 0]),
                )
            },
            draw: function () {
                this.y = s.blocs_interface[0].scrollTop
                s.noStroke()
                s.fill("white")
                s.rect(this.x, this.y, this.w, this.h)
                s.fill("#20201f")
                s.rect(this.x + this.w, this.y, 1, this.h)

                for (let component of this.components) {
                    component.draw()
                }
            },
            resize: function () {
                this.h = s.blocs_interface.height()
            }
        }

        s.menu = menu
        s.menu.setComponents()

        resize()
        $(window).on('resize', resize)
        s.textSize(15);

        s.frameRate(60)
    }

    s.isMouseInside = (x: number, y: number, w: number, h: number) => {
        return (s.mouseX - s.menu.w > x && s.mouseX - s.menu.w < x + w && s.mouseY > y && s.mouseY < y + h)
    }

    s.draw = () => {
        if (!s.pause) {

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

            s.blocs.forEach(bloc => {
                bloc.draw()
                if (bloc instanceof Commande) {
                    bloc.checkForChildPreview()
                }
            });

            const newLine = s.blocs.find(b => b === s.startBloc)?.toAliveScript()

            if (newLine) editor.setValue(newLine);
            else editor.setValue("");
        }
    }

    s.spawnBloc = (value, color) => {
        let newBloc: CodeBox
        let x = s.mouseX - s.menu.w - 5
        let y = s.mouseY - 5

        s.blocs.push(newBloc)
    }

    s.spawnCopy = (bloc: CodeBox) => {
        const clone = s.cloneObject(bloc)
        clone.select()
        s.blocs.push(clone)
    }

    s.cloneObject = (obj: CodeBox) => {
        let clone = Object.assign(Object.create(Object.getPrototypeOf(obj)), obj)

        clone.x -= s.menu.w
        return clone
    }

    const mousePressed = () => {
        s.mousePressed = true
        if (s.selectedBloc === null) {
            const bloc: CodeBox = s.blocs.reverse().find(bloc => s.isMouseInside(bloc.x, bloc.y, bloc.w, bloc.h));
            s.blocs.reverse();
            s.blocs.filter(element => element.isFocus)?.forEach(element => element.isFocus = false);
            if (bloc !== undefined) {
                bloc.isFocus = true
            }
        }
        for (const blocMenu of s.menu.components as MenuComponent[]) {
            if (blocMenu.collidePoint(s.mouseX, s.mouseY)) {
                blocMenu.onClick()
            }
        }
    }

    const mouseReleased = () => {
        s.mousePressed = false;
        if (s.selectedBloc !== null) {
            if (s.trashOver && s.selectedBloc !== s.startBloc) s.selectedBloc.delete()
            else if (s.selectedBloc.stackable) {
                for (const bloc of s.blocs.filter(b => b !== s.selectedBloc) as CodeBox[]) {
                    if (s.isMouseInside(bloc.x, bloc.y, bloc.w, bloc.h)) {
                        bloc.insertStackable(s.selectedBloc);
                    }
                }
            }
            else if (s.selectedBloc instanceof CodeBox) {
                for (const bloc of s.blocs.filter(b => b !== s.selectedBloc) as CodeBox[]) {
                    if (bloc instanceof Commande && bloc.childPreview === s.selectedBloc) {
                        bloc.child = s.selectedBloc;
                    }
                }
            }
        }
        s.selectedBloc = null;
    }

    s.convert = () => {
        s.lines = []
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

    const resize = () => {
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



