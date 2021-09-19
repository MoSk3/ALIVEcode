import { Shape } from "../Shape"

export type LevelTypes = 'simulation' | 'code';

export type Template<
	TemplateNames extends string,
	Type extends Shape & SerializableShape<TemplateNames, Type>,
> = {
	[name in `${TemplateNames}`]: {
		[name in keyof Omit<
			Type,
			keyof SerializableShape<TemplateNames, Type>
		>]?: Type[name];
	};
};

export type TemplateProperties<
	Type extends Shape & SerializableShape<string, Type>,
> = {
	[Property in keyof Omit<
		Type,
		keyof SerializableShape<string, Type>
	>]?: Type[Property];
};

export interface SerializedLevel {
	version: string;
	layout: BaseLayoutObj[];
}

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

/**
 * @param vertices a list of all points that make the shape
 * @param rotation a vector {x, y} describing the rotation of the shape
 */
export interface ShapeInfo {
	position: {
		x: number;
		y: number;
	};
	vertices: {
		x: number;
		y: number;
	}[];
	rotation: {
		x: number;
		y: number;
	};
}

/**
 * theme/name/variant
 */
export type imagePathType = `${string}/${string}/${string}`;

/**
 * @param id unique identifier used to describe relationship between objects
 * @param shapeType the name of the class from wich the object must be created
 * @param templateName tell the deserializer which template to use to build the object
 * @param shapeInfo stores the object's position, size and rotation
 * @param properties stores the properties unique to that object
 */
export interface BaseLayoutObj {
	id: number;
	shapeType: string;
	templateName: string;
	shapeInfo: ShapeInfo;
	imageName: string;
	properties: {
		[key: string]: any;
	};
}



