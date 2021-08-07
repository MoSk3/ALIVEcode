import { Shape } from '../Shape';
import { CanvasCamera } from '../Camera';
import { Vector } from '../Vector';
import {
	Layout,
	LevelTypes,
	SerializedLevel,
	BaseLayoutObj,
} from './typesSimulation';

export class Serializer {
	static readonly version = 1;

	// TODO remove void return
	static serialize(
		s: any,
		type: LevelTypes,
		initialCode: string[],
	): SerializedLevel | void {
		const layout: Layout = {
			Camera: s.canvasCamera as CanvasCamera,
			Car: [],
			Decoration: [],
			Figure: [],
			Interactive: [],
			Obstacle: [],
			Road: [],
			Terrain: [],
			Text: [],
		};

		const shapes: Shape[] = s.shapes as Shape[];

		// TODO fix serialize
		/*for (const [idx, shape] of Object.entries(shapes)) {
            if (shape.class in layout) {
                (layout[shape.class] as Array<BaseLayoutObj>).push({
                    id: shape.id,
                    idx: Number(idx),
                    templateName: "",
                    shapeInfo: {
                        vertices: (shape.vertices as Vector[]).map(v => {return {x: v.x, y: v.y}}),
                        rotation: {
                            x: shape.rotation.x, 
                            y: shape.rotation.y
                        }
                    }
                })
            }
        }*/
	}

	static deserialize(level: SerializedLevel) {
		const layout = level.layout;
		if (layout) {
			for (const className of Object.keys(layout)) {
			}
		}
	}
}

