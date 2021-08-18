import { Exclude, Type } from 'class-transformer';
import api from '../api';
import { CreatedByUser } from '../Generics/createdByUser.entity';
import { Professor } from '../User/user.entity';

export class Classroom extends CreatedByUser {
	@Exclude({ toPlainOnly: true })
	@Type(() => Professor)
	creator: Professor;

	getStudents() {
		return api.db.classrooms.getStudents(this.id);
	}

	getSubjectDisplay() {
		return '';
	}
}
