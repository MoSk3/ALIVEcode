import { COURSE_ACCESS } from '../../Types/Playground/courseType';
import { Layout } from '../../Components/PlayComponents/Simulation/Sketch/simulation/ts/typesSimulation';


export class Level {
    constructor(
        public id: string,
        public creator: string,
        public name: string,
        public description: string,
        public hint: string[],
        public access: COURSE_ACCESS,
        public type?: SimulationLevel | CodeLevel | AiLevel
    ) {
        
    }
}

export class CodeLevel {
    constructor(
        public initialCode: string[],
        public tests: string[]
    ) {}
}

export class AiLevel {
    constructor(
        public initialCode: string[]
    ) {}
}

export class SimulationLevel {
    constructor(
        public layout: Layout,
        public initialCode: string[]
    ) {}

}

const mySimLevel: Level = {
    id: '',
    creator: '',
    name: '',
    description: '',
    hint: [],
    access: COURSE_ACCESS.PU,
    //new SimulationLevel({}, []),
}



