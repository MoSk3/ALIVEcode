import { createContext } from "react";
import { Course } from "../../Models/Course/course.entity";

export const CourseContext = createContext<{
	course?: Course;
	loadActivity: (id: string) => any;
}>({ loadActivity: (id: string) => {} });