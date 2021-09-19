import { Shape } from "../Shape";
import { Template } from './typesSimulation';
import { SerializableShape } from './typesSimulation';
import { Vector } from '../Vector';

type TemplateNamesDecoration = 'base';

export class Decoration
	extends Shape
	implements SerializableShape<TemplateNamesDecoration, Decoration>
{
	readonly templateName: TemplateNamesDecoration;
	readonly shapeType = 'Decoration';

	constructor(
		s: any,
		templateName: TemplateNamesDecoration,
		...points: Vector[]
	) {
		super(s, ...points);
		this.class = 'Decoration';
		this.templateName = templateName;
	}

	get uniqueProperties() {
		return {};
	}

	readonly defaultTemplate: TemplateNamesDecoration = 'base';
	readonly templates: Template<TemplateNamesDecoration, Decoration> = {
		base: {},
	};
}
