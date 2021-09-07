import { Shape } from "../Shape";
import { Template } from "./typesSimulation";
import { SerializableShape } from './serializableShape';

type TemplateNamesFigure = 'base';

export class Figure
	extends Shape
	implements SerializableShape<TemplateNamesFigure, Figure>
{
	readonly shapeType = 'Figure';
	readonly templateName: TemplateNamesFigure;

	constructor(s: any, templateName: TemplateNamesFigure, ...points: any[]) {
		super(s, ...points);
		this.class = 'Figure';
		this.templateName = templateName;
	}

	get uniqueProperties() {
		return {
			color: this.color,
		};
	}

	readonly defaultTemplate: TemplateNamesFigure = 'base';
	readonly templates: Template<TemplateNamesFigure, Figure> = {
		base: {},
	};
}