# Room


## Development server

- Run `npm start` then open `http://localhost:3013`


## Build

Run `npm run build-{ENV}` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

NOTE: AOT did NOT work with the hybrid (ng2 + ng1) app. It caused a `Zone already loaded` error. Removing `--aot` from the build fixed it.
Not sure if this is something in our code that needs to be fixed or an inherent limitation of hybrid apps.
Additionally, in angular 6 / 7, `aot` (and `buildOptimizer`) led to a crash (and intensive CPU / memory usage) when trying to build, so these must both be set to `false` in `angular.json`.

AND, `optimization` initially seemed to work, but led to at least one issue (jumbotron mode did not close the white board / main screen properly due to a javascript error from the uglification / terser process). So ALL optimization has now been disabled :(


## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).


## Hybrid issues

- Upgrading to Angular 6 required a hack on ng1 components / directives of changing from `templateUrl` to `template: require()`
    - https://github.com/angular/angular-cli/issues/11523#issuecomment-406819887 


## Purposefully outdated dependencies:

- angular.js & uirouter (multiple) 1.5.5 (breaking changes to get up to 1.6 or 1.7)
- bootstrap 3.3.6 (missing bootstrap less file)
- pdfjs-dist 1.5.201 (need to update pdfjs code to update to v2)
- typescript <3.6.0 (angular limitation)
- @types/lodash <=4.14.119 (AuthInterceptor errors >=4.4.126)

- (Angular 8) update notes:
    - had to switch from `ng build` to 1node --max_old_space_size=8192 ..` due to source map build failure: https://github.com/angular/angular-cli/issues/12645#issuecomment-482451837
    - had to add custom webpack extra config due to html-loader issue: https://github.com/angular/angular-cli/issues/14566#issuecomment-505244632
