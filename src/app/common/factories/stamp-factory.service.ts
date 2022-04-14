const StampFactory = function StampFactory(EMOJI_DATA) {

    // disallowed for content issues. it's easier to keep this as an independent list
    // than to remove specific items from the include list
    const bannedList = [
        '1f3e9',
        '1f52b',
        '1f595',
        '1f4a3',
        '1f489',
        '1f5e1',
        '1f52a',
        '1f37a',
        '1f37b',
        '1f377',
        '1f943',
        '1f942',
        '1f379',
        '1f378',
        '1f37e',
        '1f92c',
        '1f931',
        '1f6c0',
        '1f6ac',
        '2694', // crossed swords
        '1f9e8', // firecracker
        '1f9b5', // leg
        '1f46f', // wo/men with bunny ears
        '1f362', // oden/kebab. because... phallic?
        '1f3b0', // slot machine
        '1f445', // tongue
        '1f23a', '1f235', '1f232', '1f201', '3297', '3299', '1f251', '1f236', '1f21a', '1f238', '1f237', '1f250', '1f234', '1f239', '1f530', '1f22f', '1f233', '1f202', '1f201',// kanji

    ];

    //  not banned per se, but emoji we're just going to skip
    const skipList = [
        '1f6cc',
        '1f491',
        '1f48f',
        '1f46a'
    ];


    const skip = (id: string) => {
        return bannedList.indexOf(id.slice(0,5)) >= 0 || skipList.indexOf(id.slice(0,5)) >= 0;
    }

    const faces = [
        '2620',
        '2639',
        '1f600',
        '1f603',
        '1f604',
        '1f601',
        '1f606',
        '1f605',
        '1f602',
        '1f923',
        '263a',
        '1f60a',
        '1f607',
        '1f642',
        '1f643',
        '1f609',
        '1f60c',
        '1f60d',
        '1f618',
        '1f970',
        '1f617',
        '1f619',
        '1f61a',
        '1f60b',
        '1f61b',
        '1f61d',
        '1f61c',
        '1f92a',
        '1f928',
        '1f9d0',
        '1f913',
        '1f60e',
        '1f929',
        '1f973',
        '1f60f',
        '1f612',
        '1f61e',
        '1f614',
        '1f61f',
        '1f615',
        '1f641',
        '1f623',
        '1f616',
        '1f62b',
        '1f629',
        '1f622',
        '1f62d',
        '1f624',
        '1f620',
        '1f621',
        '1f92c',
        '1f92f',
        '1f633',
        '1f631',
        '1f628',
        '1f630',
        '1f975',
        '1f976',
        '1f97a',
        '1f625',
        '1f613',
        '1f917',
        '1f914',
        '1f92d',
        '1f92b',
        '1f925',
        '1f636',
        '1f610',
        '1f611',
        '1f62c',
        '1f644',
        '1f62f',
        '1f626',
        '1f627',
        '1f62e',
        '1f632',
        '1f634',
        '1f924',
        '1f62a',
        '1f635',
        '1f910',
        '1f974',
        '1f922',
        '1f92e',
        '1f927',
        '1f637',
        '1f912',
        '1f915',
        '1f911',
        '1f920',
        '1f608',
        '1f47f',
        '1f479',
        '1f47a',
        '1f921',
        '1f4a9',
        '1f47b',
        '1f480',
        '1f47d',
        '1f47e',
        '1f916',
        '1f383',
        '1f63a',
        '1f638',
        '1f639',
        '1f63b',
        '1f63c',
        '1f63d',
        '1f640',
        '1f63f',
        '1f63e',
        '1f9e5',
        '1f45a',
        '1f455',
        '1f456',
        '1f454',
        '1f457',
        '1f459',
        '1f458',
        '1f97c',
        '1f460',
        '1f461',
        '1f462',
        '1f45e',
        '1f45f',
        '1f97e',
        '1f97f',
        '1f9e6',
        '1f9e4',
        '1f9e3',
        '1f3a9',
        '1f9e2',
        '1f452',
        '1f393',
        '26d1',
        '1f451',
        '1f45d',
        '1f45b',
        '1f45c',
        '1f4bc',
        '1f392',
        '1f453',
        '1f576',
        '1f97d',
        '1f302',
        '1f9b0',
        '1f9b1',
        '1f9b3',
        '1f9b2',
        '1f48d',
        '1f484',
        '1f48b',
        '1f444',
        '1f445',
        '1f463',
        '1f441',
        '1f440',
        '1f9e0',
        '1f9b4',
        '1f9b7',
        '1f5e3',
        '1f464',
        '1f465',
    ];

    const people = {
        '1f3fb': {
            diversity: '1f3fb',
            stamps: [],
        },
        '1f3fc': {
            diversity: '1f3fc',
            stamps: [],
        },
        '1f3fd': {
            diversity: '1f3fd',
            stamps: [],
        },
        '1f3fe': {
            diversity: '1f3fe',
            stamps: [],
        },
        '1f3ff': {
            diversity: '1f3ff',
            stamps: [],
        },
        'default': {
            diversity: 'default',
            stamps: [],
        },
        'none': {
            diversity: 'none',
            stamps: [],
        },
    };

    const activity = {
        '1f3fb': {
            diversity: '1f3fb',
            stamps: [],
        },
        '1f3fc': {
            diversity: '1f3fc',
            stamps: [],
        },
        '1f3fd': {
            diversity: '1f3fd',
            stamps: [],
        },
        '1f3fe': {
            diversity: '1f3fe',
            stamps: [],
        },
        '1f3ff': {
            diversity: '1f3ff',
            stamps: [],
        },
        'default': {
            diversity: 'default',
            stamps: [],
        },
        'none': {
            diversity: 'none',
            stamps: [],
        },
    };
    const stamps = {
        people,
        activity,
        faces: [],
        symbols: [],
        objects: [],
        nature: [], 
        travel: [],
        food: []
    };

    /**
     * creates a path to the resource file for a stamp
     * @param id - the unicode id of the stamp/emoji
     * @param filetype - 'svg' or 'png', default 'svg'
     */
    const getStampResource = (stampId: string, filetype ='svg') => {
        const rootDir = `https://cdn.presencelearning.com/emoji/`;
        let filename = rootDir + stampId;
        filename += '.' + filetype;
        return filename;
    }

    const makeStampObject = (type: string, id: string, name?: string, gender?: string, diversity?: string) => {
        let png = getStampResource(id, 'png');
        let svg = getStampResource(id, 'svg');
        return {
            id,
            png,
            svg,
            name,
            gender,
            diversity,
            type,
        };
    }


    const stampIDs = Object.keys(EMOJI_DATA);
    stampIDs.forEach(id => {
        if (!skip(id)) {
            const stamp = EMOJI_DATA[id];
            const category = stamp.category;
            const stampObject = makeStampObject(category, id, stamp.name);
            if (category === 'people' || category === 'activity') {
                if (!stamp.gender && stamp.genders && stamp.genders.length) {
                    // a stamp that has no gender but has children with genders is generally a dupe of one of those children
                    // skip it for now. in future this could prove to be a different gender neutral version, but in the
                    // current set (JoyPixels 4.5) the gender neutral version is just the male or female version of the art,
                    // and so appears redundant
                } else {
                    if (faces.includes(id)) {
                        stamps['faces'].push(stampObject);
                    } else {
                        let diversity;
                        if (!stamp.diversity) {
                            if (!stamp.diversities) {
                                diversity = 'none';
                            } else {
                                diversity = 'default';
                            }
                        } else {
                            diversity = stamp.diversity;
                        }
                        stamps[category][diversity].stamps.push(stampObject);
                    }
                }
            } else {
                stamps[category].push(stampObject);
            }
        }
    })
    
    return stamps;

};
import { commonFactoriesModule } from './common-factories.module';
commonFactoriesModule.service('stampFactory', ['EMOJI_DATA', StampFactory]);
