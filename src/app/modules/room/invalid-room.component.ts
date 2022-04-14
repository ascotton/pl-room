import { AuthenticatedUser } from '@common/models/users/UserModels';
import { roomModule } from './room.module';

class InvalidRoomController {
    static $inject = ['currentUserModel'];

    currentUserModel: any;
    isAuthenticated: boolean;

    constructor(currentUserModel) {
        this.isAuthenticated = currentUserModel.user instanceof AuthenticatedUser;
        this.currentUserModel = currentUserModel;
    }
    // logout = () => this.currentUserModel.logout();
    back = () => {
        window.history.back();
    };
}
export default InvalidRoomController;

roomModule.component('invalidRoom', {
    template: require('./invalid-room.component.html'),
    bindings: {
    },
    controller: InvalidRoomController,
});
