import { Shape } from "../Shape";
import { Template } from "./typesSimulation";
import { SerializableShape } from './serializableShape';
import { Vector } from '../Vector';

type TemplateNamesInteractive =
	| 'objective'
	| 'collectable'
	| 'button'
	| 'spring';

export class Interactive
	extends Shape
	implements SerializableShape<TemplateNamesInteractive, Interactive>
{
	static totalCollectable = 0;

	readonly shapeType = 'Interactive';
	readonly templateName: TemplateNamesInteractive;

	isCollectable?: boolean = false;
	isObjectif?: boolean = false;
	isButton?: boolean = false;

	linkedId!: any[];

	// Classe Collectable concerne tout les "shapes" comme les objets à collecter afin de compléter un niveau par exemple.
	constructor(
		s: any,
		templateName: TemplateNamesInteractive,
		...points: Vector[]
	) {
		super(s, ...points);
		this.class = 'Interactive';
		this.templateName = templateName;
		this.linkedId = [];
		this.carInteraction = true;

		//* add the object in the interactive object's list
		s.addInteractiveObject(this);

		//* add one to the number of colletables currently in the simulation
		if (this.isCollectable) Interactive.totalCollectable++;
	}

	get uniqueProperties() {
		return { linkedId: this.linkedId };
	}

	readonly defaultTemplate: TemplateNamesInteractive = 'collectable';
	readonly templates: Template<TemplateNamesInteractive, Interactive> = {
		objective: {
			isObjectif: true,
		},
		button: {
			isButton: true,
			linkedId: [],
		},
		collectable: {
			isCollectable: true,
		},
		spring: {}, //! work in progress
	};
}