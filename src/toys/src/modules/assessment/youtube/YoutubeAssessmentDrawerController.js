var YoutubeAssessmentDrawerController = function($log, $scope, $stateParams, AssessmentModel, Assessment) {
    AssessmentModel.foundationLoaded.then(function() {
    });
   // $scope.activity = Activity.activity;
    $scope.send = function() {
        Assessment.channel.call({
            method:'play',
            success: function(v) {
            }
        });
    };
    var init = function () {
        $log.debug("Youtubedrawer Controller");
    };
    init();
};

YoutubeAssessmentDrawerController.$inject = ['$log', '$scope', '$stateParams', 'AssessmentModel', 'Assessment'];
module.exports = YoutubeAssessmentDrawerController;
