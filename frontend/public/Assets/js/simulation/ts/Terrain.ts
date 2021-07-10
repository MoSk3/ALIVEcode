
class Terrain extends Shape {
    frictionCoef: number

    // Classe Terrain concerne tout les "shapes" comme le gazon par exemple.
    constructor(s: any, templateName: TemplateNames<typeof Terrain>, ...points: any[]) {
        super(s, ...points)
        this.class = 'Terrain'
        this.templateName = templateName;
        this.carInteraction = true
        this.loadFromTemplate()
    }
    
    override loadFromTemplate() {
        this.frictionCoef = Terrain.templates[this.templateName].frictionCoef
    }

    static readonly templates = {
        "slow": {
            frictionCoef: 1.05
        },
        "basic": {
            frictionCoef: 1
        },
        "fast": {
            frictionCoef: 0.95
        }
    }

    
}
