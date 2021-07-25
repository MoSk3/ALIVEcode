
import { Shape } from '../Shape';
import { TemplateNames } from './typesSimulation';

export class Terrain extends Shape {
    public frictionCoef: number = 0;

    // Classe Terrain concerne tout les "shapes" comme le gazon par exemple.

    // TODO fix type TemplateNames<typeof Terrain>
    constructor(s: any, templateName: any, ...points: any[]) {
        super(s, ...points)
        this.class = 'Terrain'
        this.templateName = templateName;
        this.carInteraction = true
        this.loadFromTemplate()
    }
    
    override loadFromTemplate() {
        this.frictionCoef = Terrain.templates[this.templateName].frictionCoef
    }

    static readonly templates: any = {
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
