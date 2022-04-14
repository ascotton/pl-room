var YouTubeAssessmentLoader = function($q, $window) {
    var tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    var loaded = false;
    var delay = $q.defer();

    $window.onYouTubeIframeAPIReady = function() {
        if (!loaded) {
            loaded = true;
            delay.resolve();
        }
    }

    return {
        whenLoaded : function() {
            if (loaded) {
                return true;
            } else {
                return delay.promise;
            }
        }
    };
}

YouTubeAssessmentLoader.$inject = ['$q', '$window'];
module.exports = YouTubeAssessmentLoader;