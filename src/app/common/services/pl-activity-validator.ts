/**
 * Service for accessing the browser ID for this machine
 *
*/
export class ActivityValidatorService {
    constructor(private drfActivityModel, private drfGameModel, private drfAssessmentModel, private $q) {
    }

    // returns false if a URL containing 'aws' is in the activity metadata
    // for most activities, the thumbnail_url is all that needs to be checked.
    // for flashcards, memory, and go fish, images need to be iterated through,
    // and each has a slightly different structure.
    checkURLs = function(activity) {
        if (!activity) {
            return true;
        }
        if (activity.thumbnail_url && activity.thumbnail_url.indexOf('aws') > -1) {
            return false;
        }
        if (activity.type && activity.type === 'flashcards' && activity.flashcards && activity.flashcards.state) {
            const cards = activity.flashcards.state;
            const keys = Object.keys(cards);
            for (let i = 0; i < keys.length; i++) {
                const nextCard = cards[keys[i]];
                if (nextCard && nextCard.url && nextCard.url.indexOf('aws') > -1) {
                    return false;
                }
            };
        }
        if (activity.type && activity.type === 'memory' && activity.memory && activity.memory.state) {
            const cards = activity.memory.state.cards;
            const keys = Object.keys(cards);
            for (const key in keys) {
                if (true) {
                    const nextCard = cards[key];
                    if (nextCard.url && nextCard.url.indexOf('aws') > -1) {
                        return false;
                    }
                    if (nextCard.thumbnail_url && nextCard.thumbnail_url.indexOf('aws') > -1) {
                        return false;
                    }
                }
            }
        }
        if (activity.type && activity.type === 'game-go-fish') {
            if (activity.deck && activity.deck.imageUrl) {
                if (activity.deck.imageUrl.indexOf('aws') > -1) {
                    return false;
                }
            }
            if (activity.cards) {
                const cards = activity.cards;
                const keys = Object.keys(cards);
                for (const key in keys) {
                    if (true) {
                        const nextCard = cards[key];
                        if (nextCard.imageUrl && nextCard.imageUrl.indexOf('aws') > -1) {
                            return false;
                        }
                    }
                }
            }
        }
        return true;
    }

    // an activity in firebase that has been found that needs an update gets re-pulled from the
    // back-end so the firebase data can be updated with new urls. go-fish, memory, and flashcards
    // each need to be treated as special cases.
    refetchActivity = function(activity) {
        const deferred = this.$q.defer();

        let configModel;
        if (activity.activity_type === 'game') {
            configModel = this.drfGameModel;
        } else if (activity.activity_type === 'assessment') {
            configModel = this.drfAssessmentModel;
        } else {
            configModel = this.drfActivityModel;
        }
        configModel.init();
        configModel.setKey(activity.id);
        configModel.get().subscribe((result) => {
            activity.thumbnail_url = result.thumbnail_url;

            let descriptor;
            if (result.descriptor && result.descriptor.length) {
                descriptor = JSON.parse(result.descriptor);
            }
            if (activity.type === 'game-go-fish') {
                this.updateGoFish(activity).then((updated) => {
                    deferred.resolve(updated);
                });
            } else {
                let updated: any;
                if (activity.type === 'memory') {
                    updated = this.updateMemoryActivity(activity, descriptor);
                } else if (activity.type === 'flashcards') {
                    updated = this.updateFlashcardsActivity(activity, descriptor);
                } else {
                    updated = activity;
                }
                deferred.resolve(updated);
            }
        });
        return deferred.promise;
    }

    updateGoFish(activity) {
        const deferred = this.$q.defer();
        if (!activity.deck) {
            deferred.resolve(activity);
        } else {
            const deckConfigModel = this.drfActivityModel;
            deckConfigModel.init();
            deckConfigModel.setKey(activity.deck.id);
            deckConfigModel.get().subscribe((result) => {
                activity.deck.imageUrl = result.thumbnail_url;

                const newCards = JSON.parse(result.descriptor).images;
                const newCardsUrlIndex = {};
                for (let i = 0; i < newCards.length; i++) {
                    const nextCard = newCards[i];
                    const urlFileName = this.getFileName(nextCard.thumbnail_url);
                    newCardsUrlIndex[urlFileName] = nextCard.thumbnail_url;
                }

                const cards = activity.cards;
                const keys = Object.keys(cards);

                for (let i = 0; i < keys.length; i++) {
                    const card = cards[keys[i]];

                    // if the card has a url field, update it with a new one
                    if (card.imageUrl) {
                        const filename = this.getFileName(card.imageUrl);
                        const newUrl = newCardsUrlIndex[filename];
                        card.imageUrl = newUrl;
                    }
                }

                deferred.resolve(activity);
            });
        }
        return deferred.promise;
    }

    updateMemoryActivity(activity, descriptor) {
        if (!activity || !activity.memory || !activity.memory.state || !activity.memory.state.cards) {
            return activity;
        }
        const cards = activity.memory.state.cards;
        const newCards = descriptor.cards;
        const newCardsIndex = {};
        // luckily the state cards in Memory are indexed by the same IDs as the cards
        // that come from the back end, so we can just index them that way.
        newCards.forEach((card) => {
            newCardsIndex[card.id] = card;
        });
        const updatedCards = cards.map((card) => {
            const cardId = card.id;
            const newCard = newCardsIndex[cardId];
            card.thumbnail_url = newCard.thumbnail_url;
            card.url = newCard.url;
            return card;
        });
        activity.memory.state.cards = updatedCards;
        return activity;
    }

    getFileName(url) {
        const fileName = url.substring(url.lastIndexOf('/') + 1);
        return fileName;
    }

    updateFlashcardsActivity(activity, descriptor) {
        if (!activity || !activity.flashcards || !activity.flashcards.state) {
            return activity;
        }
        // build dictionaries of the new cards, indexed by url filenames. in the absence of card
        // indexes in activity.flashcards.state, this is the only way to correlate them. pre-build
        // this index to avoid iterating over all these repeatedly.
        const newCards = descriptor.cards;
        const newCardsUrlIndex = {};
        const newCardsThumbUrlIndex = {};
        const newCardKeys = Object.keys(newCards);
        for (let i = 0; i < newCardKeys.length; i++) {
            const key = newCardKeys[i];
            const nextCard = newCards[key];
            const urlFileName = this.getFileName(nextCard.url);
            newCardsUrlIndex[urlFileName] = nextCard.url;
            const thumbUrlFileName = this.getFileName(nextCard.thumbnail_url);
            newCardsThumbUrlIndex[thumbUrlFileName] = nextCard.thumbnail_url;
        }

        const cards = activity.flashcards.state;
        const keys = Object.keys(cards);

        for (let i = 0; i < keys.length; i++) {
            const card = cards[keys[i]];

            // if the card has a url field, update it with a new one
            if (card.url) {
                const filename = this.getFileName(card.url);
                const url = newCardsUrlIndex[filename];
                card.url = url;
            }

            // if the card has a thumbnail_url field, update it with a new one
            if (card.thumbnail_url) {
                const filename = this.getFileName(card.thumbnail_url);
                const url = newCardsThumbUrlIndex[filename];
                card.thumbnail_url = url;
            }
        }
        activity.flashcards.state = cards;
        return activity;
    }
}

import { commonServicesModule } from './common-services.module';
commonServicesModule.service('activityValidatorService', [
    'drfActivityModel', 'drfGameModel', 'drfAssessmentModel', '$q',
    ActivityValidatorService]);
