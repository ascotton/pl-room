export class PageTitleModel  {
    titlePrefix = '';
    titleText = '';
    titlePostfix = '- PresenceLearning';
    titleTicker = ' ';

    tickTock = false;
    titleInterval = null;

    constructor(private $log, private $rootScope) {
        this.startPageMonitoring();
    }

    pageTitle = function() {
        let pageTitle = this.titlePrefix;
        if (this.titleText) {
            pageTitle += ' ' + this.titleText;
        }
        if (this.titlePostfix) {
            pageTitle += ' ' + this.titlePostfix;
        }
        if (this.titleTicker) {
            pageTitle += ' ' + this.titleTicker;
        }
        document.title = pageTitle;
        return pageTitle;
    };
    set = function(title) {
        this.titleText = title;
        this.$rootScope.pageTitle = this.pageTitle();
    };
    setPrefix = function(prefix) {
        this.titlePrefix = prefix;
        this.$rootScope.pageTitle = this.pageTitle();
    };
    setPostfix = function(postfix) {
        this.titlePostfix = postfix;
        this.$rootScope.pageTitle = this.pageTitle();
    };

    /**
     * When the page is not in focus, periodically toggle the tite to prevent Chrome
     * tab suspension
     */
    private startPageMonitoring() {
        if (!document.hasFocus()) {
            this.startTitleToggle();
        }
        window.addEventListener('blur', () => {
            this.startTitleToggle();
        });
        window.addEventListener('focus', () => {
            clearInterval(this.titleInterval);
            this.titleTicker = '';
            this.$rootScope.pageTitle = this.pageTitle();
        });
    }

    startTitleToggle = function() {
        this.titleInterval = setInterval(() => {
            this.tickTock = !this.tickTock;
            this.titleTicker = this.tickTock ? '.' : '';
            this.$rootScope.pageTitle = this.pageTitle();
        }, 10000);
    }
}

export default PageTitleModel;
import { commonModelsModule } from './models.module';
commonModelsModule.service('pageTitleModel', ['$log', '$rootScope', PageTitleModel]);
