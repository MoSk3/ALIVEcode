import { Shape } from '../Shape';
import { TemplateProperties, Template } from './typesSimulation';

export interface SerializableShape<
	TemplateNames extends string,
	T extends Shape & SerializableShape<TemplateNames, T>,
> {
	readonly shapeType: string;
	readonly templateName: string;
	readonly defaultTemplate: string;
	readonly templates: Template<TemplateNames, T>;

	get uniqueProperties(): TemplateProperties<T>;
}

