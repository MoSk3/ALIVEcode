class Serializer {

    static readonly version = 1;

    static serialize(s: any, type: LevelTypes, initialCode: string[]): SerializedLevel {
        const layout: Layout = {
            Camera: s.canvasCamera as CanvasCamera,
            Car: [],
            Decoration: [],
            Figure: [],
            Interactive: [],
            Obstacle: [],
            Road: [],
            Terrain: [],
            Text: []
        };

        const shapes: Shape[] = s.shapes as Shape[];

        for (const [idx, shape] of shapes.entries()) {
            if (shape.class in layout) {
                (layout[shape.class] as Array<BaseLayoutObj>).push({
                    id: shape.id,
                    idx,
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
        }

        return 
    }

    static deserialize(challenge: SerializedLevel) {
        const layout = challenge.layout;
        if (layout) {
            for (const className of Object.keys(layout)) {

            }
        }
    }

}

