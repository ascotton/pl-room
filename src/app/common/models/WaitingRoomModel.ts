import { commonModelsModule } from './models.module';
commonModelsModule.service('waitingRoomModel',
    function WaitingRoomModel() {
        this.value = null;
    },
);
