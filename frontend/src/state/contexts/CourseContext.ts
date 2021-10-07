import { createContext } from "react";
import { Course } from "../../Models/Course/course.entity";
import { Section } from '../../Models/Course/section.entity';
import { Activity } from '../../Models/Course/activity.entity';

export type CourseContentValues = {
	course?: Course;
	section?: Section;
	activity?: Activity;
	canEdit: boolean;
	addSection: (section: Section) => void;
	loadActivity: (section: Section, activity: Activity) => any;
	addActivity: (section: Section, activity: Activity) => void;
	saveActivity: (activity: Activity) => void;
	saveActivityContent: (data: string) => void;
};

export const CourseContext = createContext<CourseContentValues>({
	canEdit: false,
	loadActivity: (section: Section, activity: Activity) => {},
	addSection: (section: Section) => {},
	addActivity: (section: Section, activity: Activity) => {},
	saveActivity: (activity: Activity) => {},
	saveActivityContent: (data: string) => {},
});