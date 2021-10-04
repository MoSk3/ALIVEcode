import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CourseEntity } from './entities/course.entity';
import { Repository } from 'typeorm';
import { SectionEntity } from './entities/section.entity';
import { generate } from 'randomstring';
import { ProfessorEntity } from '../user/entities/professor.entity';
import { ActivityEntity } from './entities/activity.entity';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(CourseEntity) private courseRepository: Repository<CourseEntity>,
    @InjectRepository(SectionEntity) private sectionRepository: Repository<SectionEntity>,
    @InjectRepository(ActivityEntity) private activityRepository: Repository<ActivityEntity>,
  ) {}

  async create(professor: ProfessorEntity, createCourseDto: CourseEntity) {
    const course = this.courseRepository.create(createCourseDto);
    course.code = generate({
      length: 10,
      charset: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890',
    });
    course.creator = professor;
    return await this.courseRepository.save(course);
  }

  async findAll() {
    return await this.courseRepository.find();
  }

  async findOne(id: string) {
    if (!id) throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    const course = await this.courseRepository.findOne(id);
    if (!course) throw new HttpException('Course not found', HttpStatus.NOT_FOUND);
    return course;
  }

  async update(id: string, updateCourseDto: CourseEntity) {
    return await this.courseRepository.update(id, updateCourseDto);
  }

  async remove(course: CourseEntity) {
    return await this.courseRepository.remove(course);
  }

  async findOneWithSections(courseId) {
    const course = await this.courseRepository.findOne(courseId, { relations: ['sections'] });
    if (!course) throw new HttpException('Course not found', HttpStatus.NOT_FOUND);
    return course;
  }

  async createSection(courseId: string, createSectionDTO: SectionEntity) {
    const course = await this.findOneWithSections(courseId);

    const section = this.sectionRepository.create(createSectionDTO);
    await this.sectionRepository.save(section);

    course.sections.push(section);
    this.courseRepository.save(course);
    return section;
  }

  async getSections(courseId: string) {
    const course = await this.findOneWithSections(courseId);
    return course.sections;
  }

  async findSection(courseId: string, sectionId: string) {
    const course = await this.findOne(courseId);
    const section = await this.sectionRepository.findOne({
      where: { id: sectionId, course },
      relations: ['activities'],
    });
    if (!section) throw new HttpException('Section not found', HttpStatus.NOT_FOUND);
    return section;
  }

  async findActivity(courseId: string, sectionId: string, activityId: string) {
    const section = await this.findSection(courseId, sectionId);
    let activity = section.activities.find(a => a.id.toString() === activityId);
    if (!activity) throw new HttpException('Activity not found', HttpStatus.NOT_FOUND);

    activity = await this.activityRepository.findOne(activity.id, { relations: ['levels'] });
    return activity;
  }

  async getActivities(courseId: string, sectionId: string) {
    const section = await this.findSection(courseId, sectionId);
    section.activities = section.activities.map(a => {
      delete a.content;
      return a;
    });
    return section.activities;
  }

  async addActivity(courseId: string, sectionId: string, activity: ActivityEntity) {
    activity = this.activityRepository.create(activity);
    await this.activityRepository.save(activity);

    const section = await this.findSection(courseId, sectionId);
    section.activities.push(activity);
    await this.sectionRepository.save(section);
    return activity;
  }
}
