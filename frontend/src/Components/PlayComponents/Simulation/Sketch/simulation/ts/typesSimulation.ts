import { CanvasCamera } from '../Camera';

export type TemplateNames<T> = "templates" extends keyof T ? keyof T["templates"] : never;

export type LevelTypes = "simulation" | "code"

export interface SerializedLevel {
    version: number
    type: LevelTypes
    "initial-code": string[]
    layout: Layout | {}
    winCondition?: {}
}

/**
 * @param vertices a list of all points that make the shape
 * @param rotation a vector {x, y} describing the rotation of the shape
 */
export interface ShapeInfo {
    vertices: {
        x: number
        y: number
    }[]
    rotation: {
        x: number, y: number
    }
}

/**
 * @param id unique identifier used while describing relationship between objects
 * @param idx the order in which the object will be place on the simulation at load time
 * @param templateName allow the deserializer to specify the good default properties
 * @param shapeInfo stores the object's position, size and rotation
 * @param properties stores the properties proper to that object
 */
export interface BaseLayoutObj {
    id: number
    idx: number
    templateName: string
    shapeInfo: ShapeInfo
    properties?: {
        [key: string]: any
    }
}

export interface Layout {
    Camera: CanvasCamera
    Car: BaseLayoutObj[]
    Road: BaseLayoutObj[]
    Terrain: BaseLayoutObj[]
    Obstacle: BaseLayoutObj[]
    Interactive: BaseLayoutObj[]
    Decoration: BaseLayoutObj[]
    Figure: BaseLayoutObj[]
    Text: BaseLayoutObj[]
}



