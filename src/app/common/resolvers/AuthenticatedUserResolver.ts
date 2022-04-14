function AuthenticatedUserResolver(currentUserModel) {
    return currentUserModel.getAuthenticatedUser();
}
AuthenticatedUserResolver.$inject = ['currentUserModel'];
export default AuthenticatedUserResolver;

import { commonResolversModule } from './common-resolvers.module';
commonResolversModule.factory('authenticatedUserResolver', AuthenticatedUserResolver);
