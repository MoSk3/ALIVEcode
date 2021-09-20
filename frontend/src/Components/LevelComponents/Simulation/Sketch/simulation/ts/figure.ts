import { Shape } from "../Shape";
import { Template } from "./typesSimulation";
import { SerializableShape } from './typesSimulation';

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

	loadFromTemplate() {
		Object.assign(this, this.templates[this.templateName]);
	}

	readonly defaultTemplate: TemplateNamesFigure = 'base';
	readonly templates: Template<TemplateNamesFigure, Figure> = {
		base: {},
	};
}