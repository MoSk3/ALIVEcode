import { LevelExecutor } from "./AbstractLevelExecutor";
import { AsScriptService } from './as-script.service';
import { IoTProjectService } from '../iot/IoTproject/IoTproject.service';

export default class LevelIoTBackendExecutor extends LevelExecutor {
  constructor(asScriptService: AsScriptService, iotProjectService: IoTProjectService, actions: any) {
    super(asScriptService, actions);

    this.registerActions([
      {
        actionId: 900,
        action: {
          label: 'afficher',
          type: 'NORMAL',
          apply: async params => {
            if (params.length >= 3 && typeof params[0] === 'string' && typeof params[1] === 'string') {
              const [projectId, id, value] = params;
              const iotProject = await iotProjectService.findOne(projectId);
              await iotProjectService.updateComponent(iotProject, id, value);
            }
          },
        },
      },
    ]);
  }
}
