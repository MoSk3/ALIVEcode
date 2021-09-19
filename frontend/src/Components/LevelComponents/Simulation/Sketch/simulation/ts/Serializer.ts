import { Shape } from '../Shape';
import { Vector } from '../Vector';
import { classes } from './simulationClasses';

import {
	BaseLayoutObj,
	SerializedLevel,
	ShapeInfo,
	SerializableShape,
} from './typesSimulation';

export class Serializer {
	static readonly version = '1.0';
	static serialize(shapes: Shape[]): SerializedLevel {
		const layout: BaseLayoutObj[] = [];

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
					imageName: shape.img,
					properties: (shape as unknown as SerializableShape<string, any>)
						.uniqueProperties,
				});
			}
		}

		const serializedLevel: SerializedLevel = {
			version: this.version,
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

	static deserialize(s: any, challenge: SerializedLevel): Shape[] | null {
		const layout = challenge.layout;
		if (layout) {
			const shapes: Shape[] = [];

			for (const serializedShape of layout) {
				const points = this.vectorToCoord(serializedShape.shapeInfo);

				const shape: Shape & SerializableShape<string, any> = new classes[
					serializedShape.shapeType
				](s, serializedShape.templateName, ...points);

				Object.assign(shape, shape.templates[shape.templateName]);
				Object.assign(shape, serializedShape.properties);
				shapes.push(shape);
			}
			return shapes;
		}
		return null;
	}
}

