import { ClassConstructor } from "class-transformer";
import { Figure } from "./figure";
import { Car } from '../Car';
import { Obstacle } from './obstacle';
import { Road } from './road';
import { Terrain } from './Terrain';
import { TextObject } from './textObject';
import { Decoration } from './decoration';
import { Interactive } from './Interactive';
import { Shape } from '../Shape';
import { SerializableShape } from './typesSimulation';

export const classes: {
	[key: string]: ClassConstructor<Shape & SerializableShape<any, any>>;
} = {
	Decoration: Decoration,
	Figure: Figure,
	Obstacle: Obstacle,
	Interactive: Interactive,
	Terrain: Terrain,
	Road: Road,
	TextObject: TextObject,
};

