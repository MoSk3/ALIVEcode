import { Exclude, Type } from 'class-transformer';
import api from '../api';

export class ActivityContent {
	data: string;
}

export class Activity {
	@Exclude({ toPlainOnly: true })
	id: number;

	name: string;

	@Type(() => ActivityContent)
	content?: ActivityContent;

	async getContent(courseId: string, sectionId: number) {
		if (this.content) return this.content;
		this.content = await api.db.courses.getActivityContent(
			courseId,
			sectionId,
			this.id,
		);
		return this.content;
	}
}