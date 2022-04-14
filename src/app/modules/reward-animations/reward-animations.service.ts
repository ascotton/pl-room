import { Injectable } from '@angular/core';
import { FirebaseModel } from '../../common/models/firebase/FirebaseModel';
import { BehaviorSubject, Observable } from 'rxjs';

interface AnimationDataBase {
    name: string;
    hasSound?: boolean;
    iconPath: string;
}

interface EmojiAnimationData extends AnimationDataBase {
    type: 'emojiReward' | 'emojiAlert';
    gifPath: string;
}

interface VideoAnimationData extends AnimationDataBase {
    type: 'reward' | 'alert';
    mp4Path: string;
    webmPath: string;
    fallbackGifPath?: string;
}

export interface GiphyAnimationData extends Omit<AnimationDataBase, 'iconPath'> {
    type: 'giphy';
    gifPath: string;
}

export type CommonAnimationData = VideoAnimationData | EmojiAnimationData;

export type AnimationData = CommonAnimationData | GiphyAnimationData;
export type AnimationType = CommonAnimationData['type'];

interface RewardAnimationMeta {
    message?: string;
    soundOn?: boolean;
}

export type RewardAnimation = AnimationData & RewardAnimationMeta;

const ASSETS_PATH = 'https://cdn.presencelearning.com/reward-animations/';

/**
     * The simplest way to add new animations is to add new asset files named per the conventions in the defaultXPath
     * functions above and simply add the animation name to this list. If custom assets naming/paths are desired, then
     * define your own animation object, e.g.
     *     {name: animationName, iconPath: iconPath, mp4Path: mp4Path, webmPath: webmPath}
     * and push it to rewardAnimationData.
     * Eventually we might consider specifying this via build/ENV vars.
     */

const animationsNames: Record<AnimationType, string[]> = {
    reward: ['balloons', 'highfive', 'sloth', 'browncow', 'orca', 'pig', 'racecars', 'butterflies', 'birthday', 'penguins', 'halloween', 'leaves', 'turkey', 'snowman'],
    alert: ['slowdown', 'crabstop', 'stopsign', 'focus'],
    emojiReward: [
        'check_mark_button',
        'clapper_board',
        'clapping_hands',
        'collision',
        'confetti_ball',
        'crossed_fingers',
        'direct_hit',
        'drum',
        'eyes',
        'fire',
        'fireworks',
        'handshake',
        'hundred_points',
        'light_bulb',
        'love_you_gesture',
        'musical_notes',
        'party_popper',
        'raising_hands',
        'sparkles',
        'thumbs_up',
        'trophy',
        'writing_hand',
    ],
    emojiAlert: [
        'alarm_clock',
        'clock',
        'police_car_light',
        'prohibited',
        'warning',
    ],
};

const animationsWithSound = [
    'balloons',
    'highfive',
    'sloth',
    'browncow',
    'orca',
    'pig',
    'racecars',
    'butterflies',
    'birthday',
    'penguins',
    'halloween',
    'leaves',
    'turkey',
    'snowman',
    'slowdown',
    'crabstop',
    'stopsign',
    'focus',
];

const animationData: Record<AnimationType, AnimationData[]> = generateAnimationData();

@Injectable({ providedIn: 'root' })
export class RewardAnimationsService {
    frameDelta = 0;

    animationRef: firebase.database.Reference;
    soundRef: firebase.database.Reference;

    soundOnSubject = new BehaviorSubject<boolean>(true);
    soundOn$: Observable<boolean>;

    queuedAnimationSubject = new BehaviorSubject<RewardAnimation>(null);
    queuedAnimation$: Observable<RewardAnimation>;

    constructor(
        firebaseModel: FirebaseModel,
    ) {
        this.queuedAnimation$ = this.queuedAnimationSubject.asObservable();
        this.soundOn$ = this.soundOnSubject.asObservable();

        const soundValue = (snap: firebase.database.DataSnapshot) => {
            const value = snap.val();
            if (value) {
                this.soundOnSubject.next(value.soundOn);
            }
        };

        /**
         *  When a new animation is queued by a remote clinician,
         *  this callback gets call. Set our local queued animation
         *  to this value for playback by the RewardAnimationDirective
         */
        const animationAdded = (snap: firebase.database.DataSnapshot) => {
            const animation = snap.val();
            const queuedAnimation = this.queuedAnimationSubject.getValue();
            if (!queuedAnimation || (queuedAnimation.name !== animation.name)) {
                this.queuedAnimationSubject.next(animation);
            }
        };

        const setupHandlers = () => {
            this.animationRef.on('child_added', animationAdded);
            this.soundRef.on('value', soundValue);
        };

        this.animationRef = firebaseModel.getFirebaseRef('rewardAnimation');
        this.soundRef = firebaseModel.getFirebaseRef('animationSoundOn');
        setupHandlers();
    }

    getAnimationData(type: AnimationType): AnimationData [] {
        return animationData[type].map(rad => ({ ...rad }));
    }

    getAnimation(type: AnimationType, animationName: string): AnimationData {
        const animation = animationData[type].find(rad => rad.name === animationName);
        return { ...animation };
    }

    /**
     * This is only triggered by a clinician  clicking a reward button. When it happens, set the value of the current
     * animation in Firebase so that others will get it, and also set the local value this.queuedAnimation so
     * RewardAnimationDirective picks it up and plays it.
     */
    queueAnimation(animation: AnimationData, message?: string) {
        const queuedAnimation = this.queuedAnimationSubject.getValue();
        if (!queuedAnimation) {
            // remove this when angular js context is not present anymore
            delete (animation as unknown as any).$$hashKey;

            const newAnimation: RewardAnimation = {
                ...animation,
                soundOn: this.soundOnSubject.getValue(),
                message: message || '',
            };

            this.queuedAnimationSubject.next(newAnimation);
            this.animationRef.set({ animation: newAnimation });
        }
    }

    /**
     *
     */
    queueGiphyAnimation(url: string, message?: string) {
        if (!this.queuedAnimationSubject.getValue()) {
            const animation: RewardAnimation = {
                message: message || '',
                type: 'giphy',
                name: `Giphy${(new Date()).getTime()}`,
                gifPath: url,
            };
            this.queuedAnimationSubject.next(animation);
            this.animationRef.set({ animation });
        }
    }

    /**
     * This is triggered by the video playback in RewardAnimationDirective completing. Set the Firebase animationRef to
     * null so that new joiners to the room don't play it. Everyone in the room will trigger this, not just the
     * clinician, but it's OK.
     */
    dequeueAnimation(animation) {
        const queuedAnimation = this.queuedAnimationSubject.getValue();
        if (queuedAnimation && queuedAnimation.name === animation.name) {
            this.animationRef.set(null);
            this.queuedAnimationSubject.next(null);
        }
    }

    setSoundOn(value) {
        const soundOn = this.soundOnSubject.getValue();
        if (typeof(value) !== 'undefined' && soundOn !== value) {
            this.soundRef.update({ soundOn: value });
        }
    }
}

function defaultIconPath(name: string) {
    return `${ASSETS_PATH}animation-${name}.png`;
}

function defaultMP4Path(name: string) {
    return `${ASSETS_PATH}animation-${name}.mp4`;
}

function defaultWebMPath(name: string) {
    return `${ASSETS_PATH}animation-${name}.webm`;
}

function defaultFallbackGifPath(name: string) {
    return `${ASSETS_PATH}animation-${name}.gif`;
}

function defaultEmojiIconPath(name) {
    return `${ASSETS_PATH}emoji/icons/${name}.gif`;
}

function defaultEmojiGifPath(name) {
    return `${ASSETS_PATH}emoji/${name}.gif`;
}

function buildDefaultAnimation(type: VideoAnimationData['type'], animationName: string): VideoAnimationData {
    const animation = {
        type,
        name: animationName,
        hasSound: hasSound(animationName),
        iconPath: defaultIconPath(animationName),
        mp4Path: defaultMP4Path(animationName),
        webmPath: defaultWebMPath(animationName),
        fallbackGifPath: defaultFallbackGifPath(animationName),
    };
    return animation;
}

function buildEmojiAnimation(type: EmojiAnimationData['type'], animationName: string): EmojiAnimationData {
    const animation = {
        type,
        name: animationName,
        hasSound: hasSound(animationName),
        iconPath: defaultEmojiIconPath(animationName),
        gifPath: defaultEmojiGifPath(animationName),
    };
    return animation;
}

function hasSound(animationName: string) {
    return animationsWithSound.includes(animationName);
}

function generateAnimationData() {
    return Object.keys(animationsNames).reduce(
        (map, type: AnimationType) => {
            if (type === 'emojiReward' || type === 'emojiAlert') {
                map[type] = animationsNames[type].map(name => buildEmojiAnimation(type, name));
            } else {
                map[type] = animationsNames[type].map(name => buildDefaultAnimation(type, name));
            }
            return map;
        },
        {} as Record<AnimationType, AnimationData[]>,
    );
}
