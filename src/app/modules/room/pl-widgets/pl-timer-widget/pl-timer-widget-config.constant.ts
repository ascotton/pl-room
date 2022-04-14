export const TimerWidgetConfig = {
    digits: {
        max: 4,
    },
    timeService: {
        maxSecondsInMinute: 59,
        minutesInHour: 60,
        mSecInSecond: 1000,
        maxTime: 3600000,
    },
    interval: {
        defaultTick: 1000,
    },
    state: {
        editModes: {
            seconds: 'seconds',
            none: 'none',
            running: 'running',
            minutes: 'minutes',
        } ,
        status: {
            suspended: 'suspended',
            running: 'running',
            initial: 'initial',
            force: 'force',
        },
    },
    keypress: {
        // Reserved for probable use
        more: [], // [38],
        less: [], // [40],
        mode: [], // [37, 39],
        minutes_mode: [37, 38],
        seconds_mode: [39, 40],
        backspace: [8],
        enter: [13],
        exit: [48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105],
    },
};
