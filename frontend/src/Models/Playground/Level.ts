import { COURSE_ACCESS } from '../../Types/Playground/courseType';


export interface Level {
    id: string;
    creator: string;
    name: string;
    description: string;

    hint: string[];
    solution: string;

    access: COURSE_ACCESS;

    type: "SimulationLevel" | "CodeLevel" | "AiLevel";
}

const mySimLevel: SimulationLevel = {
    id: '',
    creator: '',
    name: '',
    description: '',
    hint: [],
    solution: '',
    access: COURSE_ACCESS.PU,
    type: "SimulationLevel",
}


export interface SimulationLevel extends Level {
    
}


