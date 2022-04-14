import { debounce, filter } from 'lodash';

const MAX_FACES_PER_RACE = 6;

export default class GuessWhoBoardController {
    static $inject = ['$log', '$scope', 'guessWhoActors', 'firebaseAppModel', 'currentUserModel',
        '$window', '$timeout', 'guidService', 'hotkeys'];

    xray = false;
    showOverlay = false;
    imagesLoadded = 0;
    uuid: string;
    link: any;
    $log: (msg: any) => any;

    shiftPressed = false;
    expandCardMode = false;
    clickedCardFilename = '';
    clickedCardName = '';

    model: any = {
        names: [],
        faces: [],
        cross: [],
        autoSelect: false,

        student: {
            face: -1,
            faces: [],
        },

        clinician: {
            face: -1,
            faces: [],
        },
    };

    hotkeysConfig = [{
        combo: 'shift',
        action: 'keyup',
        description: 'Expanding mode for cards',
        callback: () => this.shiftPressed = false,
    }, {
        combo: 'shift',
        action: 'keydown',
        callback: () => this.shiftPressed = true,
    }];
    showMyAvatar: boolean;

    static getFirebaseModel(images, maleNames, femaleNames, autoSelect) {
        const studentFaces = GuessWhoBoardController.shuffle(
            GuessWhoBoardController.getRandomFaces(images, maleNames, femaleNames));
        const clinicianFaces = GuessWhoBoardController.shuffle(JSON.parse(JSON.stringify(studentFaces)));

        return {
            autoSelect: autoSelect || false,
            student: { face: -1, faces: studentFaces },
            clinician: { face: -1, faces: clinicianFaces },
        };
    }

    static indexes(length) {
        const result = [];

        for (let i = 0; i < length; i++) {
            result[i] = i;
        }

        return result;
    }

    static shuffle(array) {
        for (let i1 = 0; i1 < array.length; i1++) {
            const i2 = Math.floor(Math.random() * array.length);

            [array[i1], array[i2]] = [array[i2], array[i1]];
        }

        return array;
    }

    static getRandomFaces(images, maleNames, femaleNames) {
        const result = [];
        const notSpecified = 'not specified';

        const races = new Map([
            ['a', []],
            ['b', []],
            ['c', []],
            ['h', []],
        ]);

        const age = {
            am: 'adult',
            af: 'adult',
            cm: 'child',
            cf: 'child',
            sf: 'senior',
            sm: 'senior',
            sw: 'senior',
        };

        const gender = {
            am: 'male',
            cm: 'male',
            sm: 'male',
            af: 'female',
            cf: 'female',
            sf: 'female',
            sw: 'female',
        };

        images.forEach((faceUrl) => { // race is encoded in image name
            const components = faceUrl.toLowerCase().split('/').pop().split('.')[0].split('_');

            const ageGender = 0;
            const race = 1;
            const hair = 2;
            const eyes = 3;
            const accessories = 4;

            // 2 is the index of regexp match thet corresponds to a race
            races.get(components[race]).push({
                url: '/lightyear/assets/guess_who/' + faceUrl,  // support legacy users with 'url'
                filename: faceUrl,
                hair: components[hair] || notSpecified,
                eyes: components[eyes] || notSpecified,
                age: age[components[ageGender]] || notSpecified,
                gender: gender[components[ageGender]] || notSpecified,
                ageGender: components[ageGender] || notSpecified,
                accessories: components[accessories] || notSpecified,
            });
        });
        const selectedFemaleNames = [];
        const selectedMaleNames = [];

        races.forEach((race, raceName) => {
            // Different races can have different amount of images
            const indexes = GuessWhoBoardController.shuffle(GuessWhoBoardController.indexes(race.length));
            let max = MAX_FACES_PER_RACE;

            for (let i = 0; i < max && i < indexes.length; i++) {
                const face = race[indexes[i]];
                face.race = raceName;

                if (GuessWhoBoardController.checkImages(face, result)) {
                    max++;
                    continue;
                }

                const name = face.gender === 'male' ?
                    GuessWhoBoardController.getName(maleNames, selectedMaleNames) :
                    GuessWhoBoardController.getName(femaleNames, selectedFemaleNames);

                result.push(Object.assign({
                    name,
                    cross: false,
                    race: raceName,
                },                        face));
            }
        });

        return result;
    }

    static checkAccessories(face1, face2) {
        face1.splice(0, 1);
        face2.splice(0, 1);
        if (face1.length === face2.length) {
            return true;
        }
        for (let i = 0, length = face1.length; i < length; i++) {
            if (-1 !== face2.indexOf(face1[i])) {
                return true;
            }
        }
        return false;
    }

    static checkImages(face, selectedFaces) {
        const faces = filter(selectedFaces, {
            gender: face.gender,
            ageGender: face.ageGender,
            age: face.age,
            hair: face.hair,
            race: face.race,
            eyes: face.eyes,
        });
        if (!faces.length) {
            return false;
        }
        for (let i = 0, length = faces.length; i < length; i++) {
            const isNotValid = GuessWhoBoardController.checkAccessories(
                face.accessories.split(''),
                (<any>faces[i]).accessories.split(''),
            );
            if (isNotValid) {
                return true;
            }
        }
        return false;
    }

    static getName(names, selectedNames) {
        let newName;
        do {
            newName = names[Math.floor(Math.random() * names.length)];
        } while (-1 !== selectedNames.indexOf(newName));
        selectedNames.push(newName);
        return newName;
    }

    // the old lightyear code wrote the actual lightyear-specific asset path
    // to firebase. we need to generalize it
    static fixLegacyFirebaseData(message: any) {
        const fixFaces = (faces: any[]) => {
            faces.forEach((face) => {
                if (face.url && !face.filename) {
                    face.filename = face.url.substring(face.url.lastIndexOf('/') + 1);
                }
            });
            return faces;
        };
        if (message.model && message.model.clinician) {
            message.model.clinician.faces = fixFaces(message.model.clinician.faces);
        }
        if (message.model && message.model.student) {
            message.model.student.faces = fixFaces(message.model.student.faces);
        }
        return message;
    }

    constructor($log,
                $scope,
                private guessWhoActors,
                firebaseAppModel,
                private currentUserModel,
                $window,
                private $timeout,
                guidService,
                hotkeys) {
        this.showOverlayTimeout();

        this.uuid = guidService.generateUUID();
        this.link = firebaseAppModel.ref.child('guesswho');
        this.$log = msg => $log.debug('[GuessWho]: ' + msg);

        this.hotkeysConfig.forEach(item => hotkeys.add(item));

        this.link.on('value', (firebaseData) => {
            this.$log('Firebase brought new game state');

            let message = firebaseData.val();

            if (message) {
                // skip self-update event call, just ignore it
                if (message.uuid !== this.uuid) {
                    this.$log(`Game state change was issued by another user and here\'s \\
                            how the game state looks like right now:`);

                    message = GuessWhoBoardController.fixLegacyFirebaseData(message);

                    this.model = message.model || this.model;

                    if (this.model.clinician.face < 0) {
                        this.showMyAvatar = false;
                    }
                } else {
                    this.$log('Game state change was issued by us so no need to do anything');
                }
            } else {
                this.$log('Game state was empty so let\'s initialize one');

                this.reset();
            }
        });

        const win = $($window);
        const container = $('.guesswho-board');
        let styleTag = null;

        // Are we using firefox? This is used for border precision workaround.
        $scope.isFirefox = $window.navigator.userAgent.indexOf('Firefox') > -1;

        function resizeHandler(e) {
            const canonicWidth = 1024;
            const canonicHeight = 768;
            const canonicRatio = canonicWidth / canonicHeight;
            const realWidth = container.width();
            const realHeight = container.height();
            const realRatio = realWidth / realHeight;
            const scale = canonicRatio > realRatio ?
                realWidth / canonicWidth :
                realHeight / canonicHeight;

            $scope.scale = scale;

            container.find('.guesswho-scale-wrapper')
                .css('transform', `scale3d(${scale},${scale},${scale})`);

            if ($scope.isFirefox) {

                if (!styleTag) {
                    styleTag = $('<style type="text/css"></style>').appendTo('head');
                }

                const invScale = 1 / scale;

                styleTag.html(
                    `.guesswho-board .card,
                    .guesswho-board .whait-for-opponent .card:hover,
                    .guesswho-board .game-running .card:hover {
                        border: none !important;
                        background-size:
                        10px ${invScale}px,
                        10px ${invScale}px,
                        ${invScale}px 10px,
                        ${invScale}px 10px !important;
                        background-position: 0 0,  0 100%,  0 0,  100% 0 !important;
                        background-repeat: repeat-x,  repeat-x,  repeat-y,  repeat-y !important;
                        background-image:
                        linear-gradient(to right, #edeeef 50%, #edeeef 50%),
                        linear-gradient(to right, #edeeef 50%, #edeeef 50%),
                        linear-gradient(to bottom, #edeeef 50%, #edeeef 50%),
                        linear-gradient(to bottom, #edeeef 50%, #edeeef 50%) !important;
                    }
                    .guesswho-board .card:hover {
                        border: none !important;
                        background-size:
                        10px ${invScale}px,
                        10px ${invScale}px,
                        ${invScale}px 10px,
                        ${invScale}px 10px !important;
                        background-position: 0 0,  0 100%,  0 0,  100% 0 !important;
                        background-repeat: repeat-x,  repeat-x,  repeat-y,  repeat-y !important;
                        background-image:
                        linear-gradient(to right, #46b1e1 50%, #46b1e1 50%),
                        linear-gradient(to right, #46b1e1 50%, #46b1e1 50%),
                        linear-gradient(to bottom, #46b1e1 50%, #46b1e1 50%),
                        linear-gradient(to bottom, #46b1e1 50%, #46b1e1 50%) !important;
                    }`,
                );
            }
        }

        win.on('resize', () => debounce(() => $scope.$evalAsync(), 100)());

        $scope.$watch(() => container.width(), resizeHandler);
        $scope.$watch(() => sessionStorage.getItem('activeDrawer'), resizeHandler);
        $scope.$on('$destroy', () => {
            this.hotkeysConfig.forEach(item => hotkeys.del(item.combo));
        });

        resizeHandler(null);
    }

    getAlertText() {
        let returnString = '';

        if (this.xray) {
            returnString += 'Client board';
        }

        if (this.myModel().face < 0) {
            if (returnString !== '') returnString += '. ';
            returnString += 'Pick an avatar from cards below';
        }

        if (this.myModel().face >= 0 && this.opponentModel().face < 0) {
            if (returnString !== '') returnString += '. ';
            returnString += 'Please wait for an opponent to pick card';
        }

        return returnString;
    }

    hideMyAvatar() {
        this.showMyAvatar = false;
    }

    showOverlayTimeout() {
        this.$timeout(() => {
            this.showOverlay = true;
        },            500);
    }

    setXRay(value) {
        this.xray = value;
        this.showMyAvatar = false;
    }

    setAutoSelect(value) {
        this.model.autoSelect = value;
        this.saveToFirebase();
    }

    getAutoSelect() {
        return this.model.autoSelect;
    }

    selectFaces() {
        const max = this.model.student.faces.length;
        this.model.student.face = Math.round(Math.random() * max);
        this.model.clinician.face = Math.round(Math.random() * max);
        this.saveToFirebase();
    }

    reset() {
        this.$log('Initializing new game state');

        this.imagesLoadded = 0;
        this.showMyAvatar = false;
        this.showOverlay = false;
        this.showOverlayTimeout();

        const filenames = {};
        const model = this.model;

        for (let i = 0; i < model.student.faces.length; i++) {
            const face = model.student.faces[i];

            filenames[face.filename] = true;
        }

        this.model = GuessWhoBoardController.getFirebaseModel(
            this.guessWhoActors.images,
            this.guessWhoActors.maleNames,
            this.guessWhoActors.femaleNames,
            this.model.autoSelect,
        );

        if (this.model.autoSelect) {
            this.selectFaces();
        }

        for (let i = 0; i < this.model.student.faces.length; i++) {
            const face = this.model.student.faces[i];

            if (filenames[face.filename]) {
                this.imagesLoadded++;
            }
        }

        this.saveToFirebase();
    }

    isClinician() {
        return this.currentUserModel.user.isClinicianOrExternalProvider();
    }

    currentModel() {
        return this.isClinician() && !this.xray ? this.model.clinician : this.model.student;
    }

    myModel() {
        return this.isClinician() && !this.xray ? this.model.clinician : this.model.student;
    }

    opponentModel() {
        return this.isClinician() && !this.xray ? this.model.student : this.model.clinician;
    }

    face(index) {
        return this.model.faces[index];
    }

    getMyAvatarFilename() {
        const model = this.currentModel();
        return model.face >= 0 ? model.faces[model.face].filename : 'question.svg';
    }

    getMyAvatarName() {
        const model = this.currentModel();

        return model.face >= 0 ? model.faces[model.face].name : 'Pick Avatar';
    }

    saveToFirebase() {
        this.$log('Saving guesswho to firebase');

        return this.link.update({
            uuid: this.uuid,
            model: this.model,
        });
    }

    click(index) {
        this.$log('Clicked on card #' + index);

        let personModel = null;
        if (this.isClinician() && !this.xray) {
            personModel = this.model.clinician;
        } else {
            personModel = this.model.student;
        }

        if (this.shiftPressed) {
            this.expandCardMode = true;

            this.clickedCardFilename = personModel.faces[index].filename;

            this.clickedCardName = personModel.faces[index].name;
        } else {
            if (this.currentModel().face < 0) {
                this.currentModel().face = index;

                this.saveToFirebase();
            } else {
                if (this.opponentModel().face >= 0) {
                    const model = this.currentModel();

                    model.faces[index].cross = !model.faces[index].cross;

                    this.saveToFirebase();
                }
            }
        }
    }

}
