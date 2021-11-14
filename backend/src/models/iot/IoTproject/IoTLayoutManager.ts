import { IoTProjectLayout, IOT_COMPONENT_TYPE } from './entities/IoTproject.entity';

class IoTError extends Error {}

export class IoTLayoutManager {
  constructor(private layout: IoTProjectLayout) {}

  updateComponent(id: string, value: any) {
    const component = this.layout.components.find(c => c.id === id);
    if (!component) throw new IoTError(`No component with id ${id}`);

    if (component.type === IOT_COMPONENT_TYPE.LOGS) {
      component.value.push({
        text: value,
        date: new Date(),
      });
    } else {
      component.value = value;
    }
  }
}