module.exports = angular.module('toys.config', [])
    .constant('flavor', '<%= FLAVOR %>')
    .constant('sha', '<%= sha.toString() %>')
    .constant('lastCommit', '<%= lastCommit.toString() %>')
    .constant('analytics_conf', {
        heap: '<%= heap_conf %>',
        sentry: '<%= sentry_conf %>',
    })
    .constant('applicationDefaults', JSON.parse('<%= JSON.stringify(applications) %>'));
