import { ClassConstructor } from "class-transformer";
import { Car } from '../Car';
import { Obstacle } from '../Obstacle';
import { Road } from '../Road';
import { Shape } from '../Shape';
import { Terrain } from '../Terrain';
import { TextObject } from '../TextObject';
import { Vector } from '../Vector';
import { Decoration } from './decoration';
import { Figure } from './figure';
import { Interactive } from './interactive';
import { SerializableShape } from './serializableShape';
import {
	BaseLayoutObj,
	LevelTypes,
	SerializedLevel,
	ShapeInfo,
} from './typesSimulation';

export class Serializer {
	static readonly version = '1.0';

	static readonly classes: {
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

	static serialize(
		s: any,
		type: LevelTypes,
		initialCode: string[],
	): SerializedLevel {
		const layout: BaseLayoutObj[] = [];

		if (type === 'simulation') {
			const shapes: Shape[] = s.shapes.flat() as Shape[];
			for (const shape of Object.values(shapes)) {
				// test if the shape is a serializable shape
				if ('shapeType' in shape) {
					layout.push({
						id: shape.id,
						shapeType: (shape as unknown as SerializableShape<string, any>)
							.shapeType,
						templateName: (shape as unknown as SerializableShape<string, any>)
							.templateName,
						shapeInfo: {
							position: { x: shape.pos!.x, y: shape.pos!.y },
							vertices: shape.vertices.map(v => {
								return { x: v.x, y: v.y };
							}),
							rotation: {
								x: shape.rotation.x,
								y: shape.rotation.y,
							},
						},
						properties: (shape as unknown as SerializableShape<string, any>)
							.uniqueProperties,
					});
				}
			}
		}

		const serializedLevel: SerializedLevel = {
			version: this.version,
			type: type,
			'initial-code': initialCode,
			layout: layout,
		};

		return serializedLevel;
	}

	static vectorToCoord(shapeInfo: ShapeInfo) {
		const { position, vertices, rotation } = shapeInfo;

		const points = vertices.map(vector => {
			const point: Vector = new Vector(vector.x, vector.y);
			point.rotate(
				(rotation.x * Math.PI) / 180,
				new Vector(position.x, position.y),
			);
			return point;
		});

		return points;
	}

	static deserialize(s: any, challenge: SerializedLevel): void {
		const layout = challenge.layout;
		if (layout) {
			const shapes: Shape[] = [];

			for (const serializedShape of layout) {
				const points = this.vectorToCoord(serializedShape.shapeInfo);
				const shape: Shape & SerializableShape<string, any> =
					new Serializer.classes[serializedShape.shapeType](
						s,
						serializedShape.templateName,
						...points,
					);
				Object.assign(shape, shape.templates[shape.templateName]);
				Object.assign(shape, serializedShape.properties);
				shapes.push(shape);
			}
		}
	}
}

