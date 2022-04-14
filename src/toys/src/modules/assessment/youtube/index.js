module.exports = angular.module('toys.assessment.youtube', [])
	.controller('YoutubeAssessmentController', require('./YoutubeAssessmentController'))
	.controller('YoutubeAssessmentDrawerController', require('./YoutubeAssessmentDrawerController'))
    .directive('youtubeassessmentplayer', require('./YouTubeAssessmentPlayerDirective'))
    .factory('youtubeassessmentloader', require('./YouTubeAssessmentLoader'))
;

