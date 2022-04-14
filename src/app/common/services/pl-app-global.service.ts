/**
 * This global state object is for those Rare occasions
 * that you need to watch or manage global state
 * on root scope, e.g. when bootstrapping a user on
 * a top-level component.
 */
const plAppGlobal = function($rootScope, $window, plHijackHelper) {

  const APP_GLOBAL = 'plAppGlobal';

  // put a state object on the root scope;
  const _state: any = $rootScope[APP_GLOBAL] = $window[APP_GLOBAL] = {};

  const thisObj: any = {};

  // global user
  thisObj.setUser = (user) => {
    _state.user = user;
    _state.isHijacked = plHijackHelper.isUserHijacked(_state.user);
  };

  thisObj.getUser = () => {
    return _state.user;
  };

  // special case of student access - e.g. in the room
  thisObj.setStudentMode = (val = true) => {
    _state.studentMode = val;
  };

  thisObj.isStudentMode = (user) => {
    if (user) {
      return user.isInGroup('student');
    }
    return _state.studentMode;
  };

  // special case of observer access
  thisObj.setObserverMode = (val = true) => {
    _state.observerMode = val;
  };

  thisObj.isObserverMode = () => {
    return _state.observerMode;
  };

  thisObj.isAuthenticated = (user) => {
    const USER = user || _state.user;
    return USER.isAuthenticated;
  };

  thisObj.isGuest = () => {
    return !_state.user.groups || _state.user.groups.length === 0;
  };

  thisObj.isUserHijacked = () => {
    console.log('-- user', _state.user);
    console.log('-- ishijacked', plHijackHelper.isUserHijacked(_state.user));
    return _state.user && plHijackHelper.isUserHijacked(_state.user);
  };

  thisObj.getWindowGlobal = () => {
    return window['roomGlobal'];
  };

  thisObj.setIsTechCheck = (isTechCheck: boolean) => _state.isTechCheck = isTechCheck;

  return thisObj;
};
export default plAppGlobal;

import * as angular from 'angular';
import { commonServicesModule } from './common-services.module';
commonServicesModule.service('plAppGlobal', ['$rootScope', '$window', 'plHijackHelper', plAppGlobal]);

