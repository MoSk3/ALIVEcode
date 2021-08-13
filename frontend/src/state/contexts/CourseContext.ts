import { createContext } from "react";
import Course from "../../Models/Playground/Course";

export const CourseContext = createContext<{
	course?: Course;
	loadActivity: (id: string) => any;
}>({ loadActivity: (id: string) => {} });