
class Interactive extends Shape {
    isCoin: boolean;
    isObjectif: boolean;
    isButton: boolean;
    linkedId: any[];

    // Classe Collectable concerne tout les "shapes" comme les objets à collecter afin de compléter un niveau par exemple.
    constructor(s: any, isCoin: boolean, isObjectif: boolean, isButton: boolean, ...points) {
        super(s, ...points)
        this.class = 'Interactive'
        this.isCoin = isCoin
        this.isObjectif = isObjectif
        this.isButton = isButton
        this.linkedId = []
        this.carInteraction = true
    }

    templates = {

    }
}