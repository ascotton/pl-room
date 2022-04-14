function CurrentUserResolver(currentUserModel) {
    return currentUserModel.user;
}
CurrentUserResolver.$inject = ['currentUserModel'];
export default CurrentUserResolver;

import { commonResolversModule } from './common-resolvers.module';
commonResolversModule.factory('currentUserResolver', CurrentUserResolver);
