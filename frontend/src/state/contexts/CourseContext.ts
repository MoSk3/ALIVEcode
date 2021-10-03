import { createContext } from "react";
import { Course } from "../../Models/Course/course.entity";
import { Section } from '../../Models/Course/section.entity';
import { Activity } from '../../Models/Course/activity.entity';

export type CourseContentValues = {
	course?: Course;
	activity?: Activity;
	addSection: (section: Section) => void;
	loadActivity: (activity: Activity) => any;
	addActivity: (section: Section, activity: Activity) => void;
};

export const CourseContext = createContext<CourseContentValues>({
	loadActivity: (activity: Activity) => {},
	addSection: (section: Section) => {},
	addActivity: (section: Section, activity: Activity) => {},
});