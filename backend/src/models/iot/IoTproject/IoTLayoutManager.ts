import { IoTProjectLayout } from './entities/IoTproject.entity';

class IoTError extends Error {}

export class IoTLayoutManager {
  constructor(private layout: IoTProjectLayout) {}

  updateComponent(id: string, value: any) {
    const component = this.layout.components.find(c => c.id === id);
    if (!component) throw new IoTError(`No component with id ${id}`);

    component.value = value;
  }
}