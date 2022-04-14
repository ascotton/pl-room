class StampModel {

    plainTypes = ['symbols', 'objects', 'nature', 'travel', 'food', 'faces'];
    skinToneTypes = ['people', 'activity'];
    localStorageKey = 'plSkintone'

    currentSkinToneID = '1f3fd';
    skinTones = {
        '1f3fb': '#FBD4B4',
        '1f3fc': '#E2C09D',
        '1f3fd': '#B78A71',
        '1f3fe': '#906B52',
        '1f3ff': '#614A37',
        'default': '#FECC6E',
        'none': '#D3D3D3',
    };

    constructor(private $log, private stampFactory) {
        const localSkintone = localStorage.getItem(this.localStorageKey);
        if (localSkintone) {
            this.currentSkinToneID = localSkintone;
        }
    }
    isPlainType = type => this.plainTypes.includes(type);
    isSkinToneType = type => this.skinToneTypes.includes(type);

    // if the id is a valid skin tone id, sets current skin tone and returns true, else return false
    // TODO - update currently selected stamp when skintone is changed. PL-2140
    setSkinTone = (id) => {
        if (Object.keys(this.skinTones).includes(id)) {
            this.currentSkinToneID = id;
            localStorage.setItem(this.localStorageKey, id);
            return true;
        }
        this.$log.debug('[StampModel] failed to set skin tone id: ', id);
        return false;
    }

    // if an id is passed, returns the skin tone for that id, otherwise return the current skin ton
    getSkinTone = (id) => {
        if (id) {
            return this.skinTones[id];
        }
        return this.skinTones[this.currentSkinToneID];
    }

    getCurrentSkinToneID = () => this.currentSkinToneID;

    // returns the appropriate array of stamp objects for the passed type and current tone (if applicable)
    getStamps = (type) => {
        if (this.isPlainType(type)) {
            return this.stampFactory[type];
        }
        const skintoneStamps = this.stampFactory[type][this.currentSkinToneID].stamps;
        const defaultStamps = this.stampFactory[type]['none'].stamps
        return skintoneStamps.concat(defaultStamps);
    }

}

import { whiteboardcommonModelsModule } from './whiteboard-models.module';
whiteboardcommonModelsModule.service('stampModel', ['$log', 'stampFactory', StampModel]);
