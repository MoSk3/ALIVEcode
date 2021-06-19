//------------------------ Types ----------------------------//
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var inputModels = {
    texte: {
        defaultValue: 'hello world!',
        style: {
            color: "#E53935"
        },
        validValue: function (value) { return true; },
        toAliveScript: function (value) { return String("\"" + value + "\""); }
    },
    entier: {
        defaultValue: 0,
        style: {
            color: "#4FC3F7"
        },
        validValue: function (value) { return !isNaN(value) && String(value).length > 0; },
        toAliveScript: function (value) { return String(value); }
    },
    decimal: {
        defaultValue: 0.0,
        style: {
            color: "#4FC3F7"
        },
        validValue: function (value) { return !isNaN(value) && String(value).length > 0; },
        toAliveScript: function (value) { return String(value); }
    },
    variable: {
        defaultValue: "x",
        style: {},
        validValue: function (value) { return isNaN(value); },
        toAliveScript: function (value) { return String(value); }
    },
    liste: {
        defaultValue: "{}",
        style: {},
        validValue: function (value) { return true; },
        toAliveScript: function (value) { return String("{" + value + "}"); }
    },
    booleen: {
        defaultValue: "vrai",
        style: {
            color: "lightgreen"
        },
        validValue: function (value) { return value === "vrai" || value === "faux"; },
        toAliveScript: function (value) { return String(value); }
    }
};
//------------------------ Components ----------------------------//
var Component = /** @class */ (function () {
    function Component(s, x, y, w, h, style) {
        this.roundness = 0;
        this.s = s;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.style = style;
    }
    Component.prototype.collidePoint = function (x, y) {
        return (x > this.x - this.s.menu.w && x < this.x - this.s.menu.w + this.w && y > this.y && y < this.y + this.h);
    };
    Component.prototype.setPos = function (x, y) {
        this.x = x;
        this.y = y;
    };
    Component.prototype.move = function (relativeX, relativeY) {
        this.x -= relativeX;
        this.y -= relativeY;
    };
    Object.defineProperty(Component.prototype, "rect", {
        get: function () {
            return this.s.rect(this.x, this.y, this.w, this.h, this.roundness);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Component.prototype, "center", {
        get: function () {
            return { x: this.x + this.w / 2, y: this.y + this.h / 2 };
        },
        enumerable: false,
        configurable: true
    });
    return Component;
}());
var MenuComponent = /** @class */ (function (_super) {
    __extends(MenuComponent, _super);
    function MenuComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MenuComponent.prototype.collidePoint = function (x, y) {
        return (x > this.x && x < this.x + this.w && y > this.y && y < this.y + this.h);
    };
    return MenuComponent;
}(Component));
var BlocComponent = /** @class */ (function (_super) {
    __extends(BlocComponent, _super);
    function BlocComponent(s, x, y, w, h, draggable, style) {
        var _this = _super.call(this, s, x, y, w, h, style) || this;
        _this.focus = false;
        _this.draggable = draggable;
        return _this;
    }
    Object.defineProperty(BlocComponent.prototype, "isDraggable", {
        get: function () {
            return this.draggable;
        },
        enumerable: false,
        configurable: true
    });
    return BlocComponent;
}(Component));
//------------------------ Boxes ----------------------------//
var InputBox = /** @class */ (function (_super) {
    __extends(InputBox, _super);
    function InputBox(s, x, y, h, inputType, value, w) {
        if (inputType === void 0) { inputType = "texte"; }
        var _this = _super.call(this, s, x, y, w !== null && w !== void 0 ? w : 0, h, false, { color: "white" }) || this;
        _this.inputTypeName = inputType;
        _this.inputType = inputModels[inputType];
        _this.value = value !== null && value !== void 0 ? value : _this.inputType.defaultValue;
        _this.update();
        _this.style = _this.inputType.style;
        _this.roundness = 50;
        return _this;
    }
    InputBox.prototype.setInputType = function (inputTypeName) {
        this.inputType = inputModels[inputTypeName];
        this.style = this.inputType.style;
    };
    InputBox.prototype.setValue = function (v) {
        this.value = v;
    };
    InputBox.prototype.toAliveScript = function () {
        return this.inputType.toAliveScript(this.value);
    };
    InputBox.prototype.update = function () {
        this.w = this.s.textSize() * String(this.value).length / 2 + 10;
    };
    InputBox.prototype["delete"] = function () { };
    Object.defineProperty(InputBox.prototype, "isFocus", {
        get: function () {
            return this.focus;
        },
        set: function (value) {
            var _this = this;
            var _a, _b, _c, _d, _e, _f;
            this.focus = value;
            if (this.isFocus) {
                this.htmlTypeChoice = this.s.createSelect();
                this.htmlTypeChoice.position(this.s.menu.w + 7 + this.x - this.s.canvasDiv[0].scrollLeft - 50, 75 + this.y - this.s.canvasDiv[0].scrollTop);
                /* show the type options */
                this.htmlTypeChoice.option(this.inputTypeName);
                Object.keys(inputModels).filter(function (t) { return t !== _this.inputTypeName; }).forEach(function (t) { return _this.htmlTypeChoice.option(t); });
                this.htmlInput = this.s.createInput(this.value.toString());
                this.htmlInput.size(Math.max(this.w + 20, 75), this.h);
                this.htmlInput.position(this.s.menu.w + 7 + this.x - this.s.canvasDiv[0].scrollLeft + 50, 75 + this.y - this.s.canvasDiv[0].scrollTop);
                setTimeout(function () {
                    _this.htmlInput.elt.focus();
                    _this.htmlInput.elt.select();
                }, 10);
            }
            else {
                this.inputTypeName = (_b = (_a = this.htmlTypeChoice) === null || _a === void 0 ? void 0 : _a.value()) !== null && _b !== void 0 ? _b : this.inputTypeName;
                this.setInputType(this.inputTypeName);
                var newValue = (_d = (_c = this.htmlInput) === null || _c === void 0 ? void 0 : _c.value()) !== null && _d !== void 0 ? _d : this.value;
                if (this.inputType.validValue(newValue)) {
                    this.value = newValue;
                }
                else {
                    /* FAIRE UNE ERREUR POUR DIRE AU USER QUE SON ENTRÉE EST PAS VALIDE */
                    this.value = this.inputType.defaultValue;
                }
                (_e = this.htmlInput) === null || _e === void 0 ? void 0 : _e.remove();
                (_f = this.htmlTypeChoice) === null || _f === void 0 ? void 0 : _f.remove();
                this.w = this.s.textSize() * String(this.value).length;
            }
        },
        enumerable: false,
        configurable: true
    });
    InputBox.prototype.draw = function () {
        var _a;
        this.update();
        this.s.fill((_a = this.style.color) !== null && _a !== void 0 ? _a : "white");
        this.rect;
        if (this.s.value == null) {
            this.s.fill("black");
            this.s.textAlign(this.s.CENTER);
            this.s.text(this.value, this.center.x, this.center.y + 5);
            this.s.textAlign(this.s.LEFT);
        }
    };
    return InputBox;
}(BlocComponent));
var CodeBox = /** @class */ (function (_super) {
    __extends(CodeBox, _super);
    function CodeBox(s, x, y, w, h, stackable, color, borderColor, structureTemplate, aliveScriptTemplate) {
        var _this = _super.call(this, s, x, y, w, h, true, { color: color, borderColor: borderColor }) || this;
        _this.padding = 5;
        _this.stackable = stackable;
        _this.initialStructure = structureTemplate;
        _this.aliveScriptTemplate = aliveScriptTemplate;
        _this.structure = _this.initStructure();
        _this.w = _this.getWidth();
        return _this;
    }
    CodeBox.prototype.collidePoint = function (x, y) {
        return (x > this.x - this.s.menu.w && x < this.x - this.s.menu.w + this.w && y > this.y && y < this.y + this.h);
    };
    CodeBox.prototype.move = function (relativeX, relativeY) {
        _super.prototype.move.call(this, relativeX, relativeY);
        this.interactiveElements.forEach(function (element) {
            element.move(relativeX, relativeY);
        });
    };
    CodeBox.prototype.setPos = function (x, y) {
        var _this = this;
        var prevPos = { x: this.x, y: this.y };
        _super.prototype.setPos.call(this, x, y);
        this.interactiveElements.forEach(function (element) {
            element.move(prevPos.x - _this.x, prevPos.y - _this.y);
        });
    };
    CodeBox.prototype.insertStackable = function (element) {
        var _loop_1 = function (child) {
            if (this_1.s.isMouseInside(child.x, child.y, child.w, child.h)) {
                if (child instanceof InputBox) {
                    var idx = this_1.structure.findIndex(function (b) { return b === child; });
                    var ancienChild = this_1.structure[idx];
                    element.setPos(ancienChild.x, ancienChild.y);
                    this_1.structure[idx] = element;
                    element["delete"]();
                }
                else {
                    child.insertStackable(element);
                }
                return { value: void 0 };
            }
        };
        var this_1 = this;
        for (var _i = 0, _a = this.interactiveElements; _i < _a.length; _i++) {
            var child = _a[_i];
            var state_1 = _loop_1(child);
            if (typeof state_1 === "object")
                return state_1.value;
        }
    };
    CodeBox.prototype.initStructure = function () {
        var _this = this;
        var next_x = this.x;
        return this.initialStructure.map(function (v) {
            if (typeof v === "string") {
                next_x += _this.s.textSize() * v.length / 2 + _this.padding;
                return v;
            }
            var next_input = new InputBox(_this.s, next_x, _this.y, _this.h, v.type, v.valeur);
            next_x += next_input.w + _this.padding;
            return next_input;
        });
    };
    CodeBox.prototype.updateStructure = function () {
        var next_x = this.x;
        for (var i = 0; i < this.structure.length; i++) {
            var struc = this.structure[i];
            if (struc == null) {
                var type = this.initialStructure[i];
                this.structure[i] = new InputBox(this.s, next_x, this.y, this.h, type.type);
            }
            else
                next_x += (typeof struc === "string" ? this.s.textSize() * struc.length / 2 : struc.w) + this.padding;
        }
    };
    Object.defineProperty(CodeBox.prototype, "interactiveElements", {
        get: function () {
            return this.structure.filter(function (v) { return v instanceof InputBox || v instanceof CodeBox; });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CodeBox.prototype, "isFocus", {
        get: function () {
            return this.focus;
        },
        set: function (value) {
            this.focus = value;
            if (this.isFocus) {
                var _loop_2 = function (child) {
                    if (this_2.s.isMouseInside(child.x, child.y, child.w, child.h)) {
                        child.isFocus = true;
                        if (this_2.s.selectedBloc === child) {
                            this_2.s.blocs.push(child);
                            this_2.structure = this_2.structure.map(function (e) { return e === child ? null : e; });
                            this_2.updateStructure();
                        }
                        return { value: void 0 };
                    }
                };
                var this_2 = this;
                for (var _i = 0, _a = this.interactiveElements; _i < _a.length; _i++) {
                    var child = _a[_i];
                    var state_2 = _loop_2(child);
                    if (typeof state_2 === "object")
                        return state_2.value;
                }
                this.s.selectedBloc = this;
                this.diffPos = {
                    x: this.s.mouseX - this.x,
                    y: this.s.mouseY - this.y
                };
            }
            else {
                this.interactiveElements.forEach(function (e) { return e.isFocus = false; });
            }
        },
        enumerable: false,
        configurable: true
    });
    CodeBox.prototype.getWidth = function () {
        var _this = this;
        return this.structure.reduce(function (acc, v) {
            if (v instanceof InputBox || v instanceof CodeBox)
                acc += v.w + _this.padding;
            if (typeof v === "string")
                acc += _this.s.textSize() * v.length / 2 + _this.padding;
            return acc;
        }, this.padding);
    };
    CodeBox.prototype.update = function () {
        var _this = this;
        this.w = Math.max(this.getWidth(), 100);
        if (this.s.selectedBloc === this) {
            var startPos_1 = { x: this.x, y: this.y };
            this.x = this.s.mouseX - this.diffPos.x;
            this.y = this.s.mouseY - this.diffPos.y;
            this.interactiveElements.forEach(function (element) {
                element.move(startPos_1.x - _this.x, startPos_1.y - _this.y);
            });
        }
    };
    CodeBox.prototype.draw = function () {
        var _this = this;
        this.update();
        if (this.s.selectedBloc === this) {
            this.s.stroke("white");
        }
        else {
            this.s.stroke(this.style.borderColor);
        }
        this.s.fill(this.style.color);
        this.rect;
        var next_x = this.padding;
        this.structure.forEach(function (e) {
            if (typeof e === "string") {
                _this.s.fill("black");
                _this.s.text(e, _this.x + next_x, _this.y + _this.h / 2 + 5);
                next_x += Math.max(_this.s.textSize() * e.length / 2, 2 * _this.padding);
            }
            else {
                e.x = _this.x + next_x;
                e.draw();
                next_x += e.w + _this.padding;
            }
        });
    };
    CodeBox.prototype["delete"] = function () {
        var _this = this;
        this.s.blocs = this.s.blocs.filter(function (b) { return b !== _this; });
    };
    CodeBox.prototype.toAliveScript = function () {
        var aliveScriptStruc = this.structure.map(function (e) { return e; });
        if (this.aliveScriptTemplate) {
            for (var i = 0; i < aliveScriptStruc.length; i++) {
                aliveScriptStruc[i] = typeof aliveScriptStruc[i] === "string" ? this.aliveScriptTemplate[i] : aliveScriptStruc[i];
            }
        }
        return aliveScriptStruc.map(function (e) { return e instanceof BlocComponent ? e.toAliveScript() : e; }).join(" ");
    };
    return CodeBox;
}(BlocComponent));
//------------------------ Specific Boxes ----------------------------//
var Commande = /** @class */ (function (_super) {
    __extends(Commande, _super);
    function Commande(s, x, y, w, h, color, structure, structureTemplate, borderColor) {
        if (borderColor === void 0) { borderColor = "black"; }
        var _this = _super.call(this, s, x, y, w, h, false, color, borderColor, structure, structureTemplate) || this;
        _this.childBox = null;
        _this.childPreview = null;
        return _this;
    }
    Object.defineProperty(Commande.prototype, "child", {
        get: function () {
            return this.childBox;
        },
        set: function (newChild) {
            if (newChild === null) {
                this.childBox = null;
                return;
            }
            if (this.child !== null) {
                newChild.child = this.child;
            }
            this.childBox = newChild;
            this.child.setPos(this.x, this.y + this.h);
        },
        enumerable: false,
        configurable: true
    });
    Commande.prototype.checkForChildPreview = function () {
        var _a;
        if (this.s.mousePressed) {
            if (this.s.selectedBloc === this || this.s.selectedBloc === this.child || this.s.selectedBloc === null || !(this.s.selectedBloc instanceof Commande))
                return;
            var dx = Math.max(this.x - this.s.mouseX + this.s.menu.w, 0, this.s.mouseX - (this.x + this.w) - this.s.menu.w);
            var dy = this.s.mouseY - (this.y + this.h);
            var dist = Math.sqrt(dx * dx + dy * dy);
            var bloc = this.s.selectedBloc;
            if (dist < 20) {
                this.childPreview = bloc;
            }
            else {
                if (this.childPreview !== null)
                    (_a = this.child) === null || _a === void 0 ? void 0 : _a.setPos(this.x, this.y + this.h);
                this.childPreview = null;
            }
        }
    };
    Commande.prototype.update = function () {
        var _a;
        var startPos = { x: this.x, y: this.y };
        _super.prototype.update.call(this);
        if (this.s.selectedBloc === this)
            (_a = this.child) === null || _a === void 0 ? void 0 : _a.move(startPos.x - this.x, startPos.y - this.y);
        else if (this.s.mousePressed) {
            if (this.child !== null && this.s.isMouseInside(this.child.x, this.child.y, this.child.w, this.child.h)) {
                this.child.isFocus = true;
                if (this.s.selectedBloc === this.child)
                    this.child = null;
            }
        }
    };
    Commande.prototype.draw = function () {
        var _a, _b;
        _super.prototype.draw.call(this);
        if (this.childPreview !== null) {
            this.childPreview.setPos(this.x, this.y + this.h);
            (_a = this.child) === null || _a === void 0 ? void 0 : _a.setPos(this.x, this.y + this.h + this.childPreview.h);
        }
        (_b = this.child) === null || _b === void 0 ? void 0 : _b.draw();
    };
    Commande.prototype["delete"] = function () {
        var _a;
        _super.prototype["delete"].call(this);
        (_a = this.child) === null || _a === void 0 ? void 0 : _a["delete"]();
    };
    Commande.prototype.toAliveScript = function () {
        var childCode = this.child ? "\n" + this.child.toAliveScript() : "";
        return _super.prototype.toAliveScript.call(this) + childCode;
    };
    return Commande;
}(CodeBox));
var Expression = /** @class */ (function (_super) {
    __extends(Expression, _super);
    function Expression(s, x, y, w, h, color, structure, structureTemplate, borderColor) {
        if (borderColor === void 0) { borderColor = "black"; }
        var _this = _super.call(this, s, x, y, w, h, true, color, borderColor, structure, structureTemplate) || this;
        _this.roundness = 50;
        _this.padding = 10;
        return _this;
    }
    return Expression;
}(CodeBox));
var MenuCategory = /** @class */ (function (_super) {
    __extends(MenuCategory, _super);
    function MenuCategory(menu, s, x, y, text) {
        var _this = _super.call(this, s, x, y, 210, s.blocs_interface.height(), {}) || this;
        _this.elements = [];
        _this.state = "open";
        _this.menu = menu;
        _this.text = text;
        return _this;
    }
    MenuCategory.prototype.getState = function () {
        return this.state;
    };
    MenuCategory.prototype.update = function () {
        this.draw();
    };
    MenuCategory.prototype["delete"] = function () {
    };
    MenuCategory.prototype.onClick = function () {
        console.log("test");
        if (this.getState() === "open")
            this.close();
        else if (this.getState() === "close")
            this.open();
    };
    MenuCategory.prototype.close = function () {
        var _this = this;
        this.s.menu.components = this.s.menu.components.filter(function (e) { return !(e instanceof MenuBlocTemplate) || !_this.elements.includes(e); });
        this.state = "close";
    };
    MenuCategory.prototype.open = function () {
        for (var _i = 0, _a = this.elements; _i < _a.length; _i++) {
            var element = _a[_i];
            this.s.menu.components.push(element);
        }
        this.state = "open";
    };
    MenuCategory.prototype.toAliveScript = function () {
        throw new Error("Method not implemented.");
    };
    MenuCategory.prototype.draw = function () {
        this.s.fill("black");
        this.s.noStroke();
        this.s.textSize(20);
        this.s.text(this.text, this.x + this.menu.x, this.y + 30);
        this.s.textSize(15);
    };
    return MenuCategory;
}(MenuComponent));
var MenuBlocTemplate = /** @class */ (function (_super) {
    __extends(MenuBlocTemplate, _super);
    function MenuBlocTemplate(template, menu) {
        var _this = _super.call(this, template.s, template.x, template.y, template.w, template.h, template.style) || this;
        _this.template = template;
        _this.template.update();
        menu.elements.push(_this);
        return _this;
    }
    MenuBlocTemplate.prototype.onClick = function () {
        var newBloc = this.s.cloneObject(this.template);
        newBloc.structure = newBloc.initStructure();
        this.s.selectedBloc = newBloc;
        newBloc.diffPos = {
            x: newBloc.s.mouseX - newBloc.x,
            y: newBloc.s.mouseY - newBloc.y
        };
        this.s.blocs.push(newBloc);
    };
    MenuBlocTemplate.prototype.update = function () {
        this.draw();
    };
    MenuBlocTemplate.prototype.draw = function () {
        this.template.setPos(this.x, this.y + 15);
        this.template.draw();
    };
    return MenuBlocTemplate;
}(MenuComponent));
//---------------------------------- load --------------------------------------------//
var trashCan;
var trashCanOpen;
var editor;
function sketchInterface(s) {
    var width = 1500;
    var height = 1000;
    var canvas;
    s.menu;
    s.leftPannel;
    s.blocs = [];
    var parents = [];
    s.mousePressed = false;
    s.selectedBloc = null;
    s.pause = false;
    s.trashOver = false;
    s.blocs_interface = $('#blocs-interface');
    s.preload = function () {
        trashCan = s.loadImage('/static/images/trash.png');
        trashCanOpen = s.loadImage('/static/images/trashOpen.png');
    };
    s.setup = function () {
        s.canvasDiv = s.blocs_interface;
        s.startBloc = new Commande(s, 70, 50, 200, 30, "lightgreen", ["DÉBUT"], ["# début du programme"]);
        s.blocs.push(s.startBloc);
        /*
        s.blocs.push(new Operator(s, 100, 100, "qqlchose", [Operator_ADDITION, Operator_ADDITION], "yellow", 3))
        s.blocs.push(new Operator(s, 100, 150, "addition", [Operator_ADDITION], "yellow", 2))
        s.blocs.push(new Operator(s, 100, 200, "addition", [Operator_ADDITION], "yellow", 2))
        s.blocs.push(new Operator(s, 100, 250, "soustraction", [Operator_SOUSTRACTION], "yellow", 2))
        s.blocs.push(new Operator(s, 100, 300, "multiplication", [Operator_MULTIPLICATION], "yellow", 2))
        s.blocs.push(new Operator(s, 100, 350, "division", [Operator_DIVISION], "yellow", 2))
        s.blocs.push(new Operator(s, 100, 400, "exposant", [Operator_EXPOSANT], "yellow", 2))
        */
        canvas = s.createCanvas(width, height);
        canvas.parent("blocs-interface");
        canvas.mousePressed(mousePressed);
        canvas.mouseReleased(mouseReleased);
        var menu = {
            x: 0,
            y: 0,
            w: 220,
            h: s.blocs_interface.height(),
            components: [],
            setComponents: function () {
                var _this = this;
                this.components = [];
                var addComponents = function () {
                    var elements = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        elements[_i] = arguments[_i];
                    }
                    var i = _this.components.length;
                    for (var _a = 0, elements_1 = elements; _a < elements_1.length; _a++) {
                        var el = elements_1[_a];
                        el.y = 40 * i;
                        _this.components.push(el);
                        i++;
                    }
                };
                var catMouvement = new MenuCategory(this, s, 20, 0, "Mouvements");
                var catMaths = new MenuCategory(this, s, 20, 0, "Maths");
                addComponents(catMouvement, new MenuBlocTemplate(new Commande(s, 20, 0, 150, 30, "#ffbd00", ["afficher", { type: "texte", valeur: "hello world!" }]), catMouvement), new MenuBlocTemplate(new Commande(s, 20, 0, 150, 30, "#ffbd00", ["lire dans", { type: "variable", valeur: "msg" }]), catMouvement), new MenuBlocTemplate(new Commande(s, 20, 0, 150, 30, "#ffbd00", ["avancer"]), catMouvement), new MenuBlocTemplate(new Commande(s, 20, 0, 150, 30, "#ffbd00", ["reculer"]), catMouvement), new MenuBlocTemplate(new Commande(s, 20, 0, 150, 30, "#ffbd00", ["tournerDroite"]), catMouvement), new MenuBlocTemplate(new Commande(s, 20, 0, 150, 30, "#ffbd00", ["tournerGauche"]), catMouvement), new MenuBlocTemplate(new Commande(s, 20, 0, 150, 30, "#ffbd00", ["avancer ", { type: "entier", valeur: 1 }], ["avancer", null]), catMouvement), new MenuBlocTemplate(new Commande(s, 20, 0, 150, 30, "#ffbd00", ["reculer", { type: "entier", valeur: 1 }]), catMouvement), new MenuBlocTemplate(new Commande(s, 20, 0, 150, 30, "#ffbd00", ["attendre", { type: "entier", valeur: 1 }]), catMouvement), new MenuBlocTemplate(new Commande(s, 20, 0, 150, 30, "#ffbd00", ["tourner", { type: "entier", valeur: 45 }]), catMouvement), new MenuBlocTemplate(new Commande(s, 20, 0, 150, 30, "#ffbd00", ["variable:", { type: "variable", valeur: "x" }, "valeur:", { type: "texte", valeur: "abc" }], ["", null, "=", null]), catMouvement), 
                //new Bloc(s, 20, 0, 150, 30, ACTION_RECULER, "#ffbd00", true),
                //new BlocParameters(s, 20, 0, ACTION_AVANCER, "#ffbd00", true, [1]),
                //new BlocParameters(s, 20, 0, ACTION_RECULER, "#ffbd00", true, [1]),
                //new Bloc(s, 20, 0, 150, 30, ACTION_STOP, "red", true),
                //new BlocParameters(s, 20, 170, ACTION_TOURNER, "yellow", true, [180]),
                //new Bloc(s, 20, 0, 150, 30, ACTION_TOURNER_DROITE, "yellow", true),
                //new Bloc(s, 20, 0, 150, 30, ACTION_TOURNER_GAUCHE, "yellow", true),
                catMaths, new MenuBlocTemplate(new Expression(s, 20, 0, 150, 30, "lightgray", [{ type: "entier", valeur: 1 }, "+", { type: "entier", valeur: 1 }]), catMaths), new MenuBlocTemplate(new Expression(s, 20, 0, 150, 30, "lightgray", [{ type: "entier", valeur: 1 }, "-", { type: "entier", valeur: 1 }]), catMaths), new MenuBlocTemplate(new Expression(s, 20, 0, 150, 30, "lightgray", [{ type: "entier", valeur: 1 }, "×", { type: "entier", valeur: 1 }], [null, "*", null]), catMaths), new MenuBlocTemplate(new Expression(s, 20, 0, 150, 30, "lightgray", [{ type: "entier", valeur: 1 }, "/", { type: "entier", valeur: 1 }]), catMaths));
            },
            draw: function () {
                this.y = s.blocs_interface[0].scrollTop;
                s.noStroke();
                s.fill("white");
                s.rect(this.x, this.y, this.w, this.h);
                s.fill("#20201f");
                s.rect(this.x + this.w, this.y, 1, this.h);
                for (var _i = 0, _a = this.components; _i < _a.length; _i++) {
                    var component = _a[_i];
                    component.draw();
                }
            },
            resize: function () {
                this.h = s.blocs_interface.height();
            }
        };
        s.menu = menu;
        s.menu.setComponents();
        resize();
        $(window).on('resize', resize);
        s.textSize(15);
        s.frameRate(60);
    };
    s.isMouseInside = function (x, y, w, h) {
        return (s.mouseX - s.menu.w > x && s.mouseX - s.menu.w < x + w && s.mouseY > y && s.mouseY < y + h);
    };
    s.draw = function () {
        var _a;
        if (!s.pause) {
            s.background(255);
            s.menu.draw();
            s.translate(s.menu.w, 0);
            if (!s.isMouseInside(0, 0, 50, 50) || s.selectedBloc == null) {
                s.image(trashCan, 0, 0, 50, 50);
                s.trashOver = false;
            }
            else {
                s.image(trashCanOpen, 0, 0, 50, 50);
                s.trashOver = true;
            }
            s.fill(255, 0, 0);
            s.blocs.forEach(function (bloc) {
                bloc.draw();
                if (bloc instanceof Commande) {
                    bloc.checkForChildPreview();
                }
            });
            var newLine = (_a = s.blocs.find(function (b) { return b === s.startBloc; })) === null || _a === void 0 ? void 0 : _a.toAliveScript();
            if (newLine)
                editor.setValue(newLine);
            else
                editor.setValue("");
        }
    };
    s.spawnBloc = function (value, color) {
        var newBloc;
        var x = s.mouseX - s.menu.w - 5;
        var y = s.mouseY - 5;
        s.blocs.push(newBloc);
    };
    s.spawnCopy = function (bloc) {
        var clone = s.cloneObject(bloc);
        clone.select();
        s.blocs.push(clone);
    };
    s.cloneObject = function (obj) {
        var clone = Object.assign(Object.create(Object.getPrototypeOf(obj)), obj);
        clone.x -= s.menu.w;
        return clone;
    };
    var mousePressed = function () {
        var _a;
        s.mousePressed = true;
        if (s.selectedBloc === null) {
            var bloc = s.blocs.reverse().find(function (bloc) { return s.isMouseInside(bloc.x, bloc.y, bloc.w, bloc.h); });
            s.blocs.reverse();
            (_a = s.blocs.filter(function (element) { return element.isFocus; })) === null || _a === void 0 ? void 0 : _a.forEach(function (element) { return element.isFocus = false; });
            if (bloc !== undefined) {
                bloc.isFocus = true;
            }
        }
        for (var _i = 0, _b = s.menu.components; _i < _b.length; _i++) {
            var blocMenu = _b[_i];
            if (blocMenu.collidePoint(s.mouseX, s.mouseY)) {
                blocMenu.onClick();
            }
        }
    };
    var mouseReleased = function () {
        s.mousePressed = false;
        if (s.selectedBloc !== null) {
            if (s.trashOver && s.selectedBloc !== s.startBloc)
                s.selectedBloc["delete"]();
            else if (s.selectedBloc.stackable) {
                for (var _i = 0, _a = s.blocs.filter(function (b) { return b !== s.selectedBloc; }); _i < _a.length; _i++) {
                    var bloc = _a[_i];
                    if (s.isMouseInside(bloc.x, bloc.y, bloc.w, bloc.h)) {
                        bloc.insertStackable(s.selectedBloc);
                    }
                }
            }
            else if (s.selectedBloc instanceof CodeBox) {
                for (var _b = 0, _c = s.blocs.filter(function (b) { return b !== s.selectedBloc; }); _b < _c.length; _b++) {
                    var bloc = _c[_b];
                    if (bloc instanceof Commande && bloc.childPreview === s.selectedBloc) {
                        bloc.child = s.selectedBloc;
                    }
                }
            }
        }
        s.selectedBloc = null;
    };
    s.convert = function () {
        s.lines = [];
        editor.setValue(s.lines.join("\n"), 1);
    };
    s.blocParametersToLine = function (bloc, n) {
        if (n === void 0) { n = 0; }
        var line = n != 0 ? "(" : "";
        var i = 0;
        for (var _i = 0, _a = bloc.inputBoxes; _i < _a.length; _i++) {
            var inputBox = _a[_i];
            if (inputBox.child != null) {
                line += s.blocParametersToLine(inputBox.child, n + 1);
                line += (i == bloc.inputBoxes.length - 1 ? "" : " " + bloc.inputValues[i] + " ");
            }
            else {
                line += inputBox.value + (i == bloc.inputBoxes.length - 1 ? "" : " " + bloc.inputValues[i] + " ");
            }
            i++;
        }
        return line + (n != 0 ? ")" : "");
    };
    var resize = function () {
        s.menu.resize();
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
    };
}
