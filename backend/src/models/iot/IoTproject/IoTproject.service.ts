import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IoTProjectEntity, IoTProjectLayout } from './entities/IoTproject.entity';
import { Repository } from 'typeorm';
import { UserEntity } from '../../user/entities/user.entity';
import { IoTRouteEntity } from '../IoTroute/entities/IoTroute.entity';
import { IoTObjectEntity } from '../IoTobject/entities/IoTobject.entity';
import { IoTSocketUpdateRequestWatcher, WatcherClient } from '../../../socket/iotSocket/iotSocket.types';
import { validUUID } from '../../../utils/types/validation.types';

@Injectable()
export class IoTProjectService {
  constructor(
    @InjectRepository(IoTProjectEntity) private projectRepository: Repository<IoTProjectEntity>,
    @InjectRepository(IoTRouteEntity) private routeRepository: Repository<IoTRouteEntity>,
  ) {}

  async create(user: UserEntity, createIoTprojectDto: IoTProjectEntity) {
    const project = this.projectRepository.create(createIoTprojectDto);
    project.creator = user;
    return await this.projectRepository.save(project);
  }

  async findAll() {
    return await this.projectRepository.find();
  }

  async findOne(id: string) {
    if (!id || !validUUID(id)) throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    const iotObject = await this.projectRepository.findOne(id);
    if (!iotObject) throw new HttpException('IoTObject not found', HttpStatus.NOT_FOUND);
    return iotObject;
  }

  async update(id: string, updateIoTprojectDto: IoTProjectEntity) {
    return await this.projectRepository.save({ id, ...updateIoTprojectDto });
  }

  async remove(id: string) {
    return await this.projectRepository.delete(id);
  }

  async updateLayout(id: string, layout: IoTProjectLayout) {
    const project = await this.findOne(id);

    layout.components = layout.components.filter((c: any) => c != null && JSON.stringify(c) != '{}');

    return await this.projectRepository.save({ ...project, layout });
  }
  async getRoutes(project: IoTProjectEntity) {
    return (await this.projectRepository.findOne(project.id, { relations: ['routes'] })).routes;
  }

  async addRoute(project: IoTProjectEntity, routeDTO: IoTRouteEntity) {
    const newRoute = this.routeRepository.create(routeDTO);
    await this.routeRepository.save(newRoute);
    project = await this.projectRepository.findOne(project.id, { relations: ['routes'] });
    project.routes.push(newRoute);
    await this.projectRepository.save(project);
    return newRoute;
  }

  async getObjects(project: IoTProjectEntity) {
    return (await this.projectRepository.findOne(project.id, { relations: ['iotObjects'] })).iotObjects;
  }

  async addObject(project: IoTProjectEntity, object: IoTObjectEntity) {
    project = await this.projectRepository.findOne(project.id, { relations: ['iotObjects'] });
    project.iotObjects.push(object);
    await this.projectRepository.save(project);
    return object;
  }

  async updateComponent(project: IoTProjectEntity, componentId: string, value: any, sendUpdate = false): Promise<void> {
    const layoutManager = project.getLayoutManager();
    layoutManager.updateComponent(componentId, value);
    await this.projectRepository.save(project);

    if (sendUpdate) {
      const watchers = WatcherClient.getClientsByProject(project.id);

      const data: IoTSocketUpdateRequestWatcher = {
        id: componentId,
        value,
      };

      watchers.forEach(w => w.sendCustom('update', data));
    }
  }
}
