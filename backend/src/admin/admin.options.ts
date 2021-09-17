import { AdminJSOptions } from 'adminjs';
import ProfessorResource from './resources/users/professor.resource';
import StudentResource from './resources/users/student.resource';
import UserResource from './resources/users/user.resource';
import LevelResource from './resources/levels/level.resource';
import LevelCodeResource from './resources/levels/levelCode.resource';
import LevelAliveResource from './resources/levels/levelAlive.resource';
import ClassroomResource from './resources/classrooms/classroom.resource';
import MaintenanceResource from './resources/siteStatus/maintenance.resource';
import CourseResource from './resources/courses/course.resource';
import IoTProjectResource from './resources/iot/iotProject.resource';
import IoTObjectResource from './resources/iot/iotObject.resource';

export type AdminParent =
  | {
      name?: string;
      icon?: string;
    }
  | string;

export const adminOptions: AdminJSOptions = {
  rootPath: '/api/admin',
  loginPath: '/api/admin/login',
  logoutPath: '/api/admin/logout',
  resources: [
    UserResource,
    StudentResource,
    ProfessorResource,
    LevelResource,
    LevelCodeResource,
    LevelAliveResource,
    ClassroomResource,
    CourseResource,
    IoTProjectResource,
    IoTObjectResource,
    MaintenanceResource,
  ],
  branding: {
    companyName: 'ALIVEcode',
  },
};
