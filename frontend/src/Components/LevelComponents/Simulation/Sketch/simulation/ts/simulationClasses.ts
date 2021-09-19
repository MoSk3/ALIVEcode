import { ClassConstructor } from "class-transformer";
import { Figure } from "./figure";
import { Car } from '../Car';
import { Obstacle } from '../Obstacle';
import { Road } from '../Road';
import { Terrain } from '../Terrain';
import { TextObject } from '../TextObject';
import { Decoration } from './decoration';
import { Interactive } from './Interactive';

export const classes: {
	[className: string]: ClassConstructor<any>;
} = {
	Decoration: Decoration,
	Figure: Figure,
	Obstacle: Obstacle,
	Interactive: Interactive,
	Terrain: Terrain,
	Car: Car,
	Road: Road,
	TextObject: TextObject,
};
