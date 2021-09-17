import { ResourceWithOptions } from 'adminjs';
import { courseParent } from './course.parent';
import { CourseEntity } from '../../../models/course/entities/course.entity';

const CourseResource: ResourceWithOptions = {
  resource: CourseEntity,
  options: { parent: courseParent },
};

export default CourseResource;