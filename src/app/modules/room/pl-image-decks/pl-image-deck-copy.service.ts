import { Injectable } from '@angular/core';

import {
    PLHttpService,
    PLUrlsService,
} from '@root/index';

@Injectable()
export class PLImageDeckCopyService {

    constructor(
        private plHttp: PLHttpService,
        private plUrls: PLUrlsService,
    ) {
    }

    // Iterates through all existing flashcard & memory activities and creates a new copy
    // as an image deck.
    // This would be much more performant to do on the backend, but there are < 20k of these
    // activities and this only needs to be run once (per environment), so should be okay.
    // To prevent duplicates, we will append to the slug of the new image deck and check for
    // that slug before creating. NOTE: It would be more performant (less API queries)
    // to update the activity we copy with the uuid of the new image deck BUT for safety
    // we want to avoid modifying the existing activities at all.
    copy(urlBase='', activity_types=['memory', 'flashcards'], countTotal=99999, pageInput=1) {
        activity_types.forEach((activity_type) => {
            this.copyType(activity_type, countTotal, pageInput, urlBase);
        });
    }

    copyType(activity_type='memory', countTotal=99999, page=1, urlBase='', checkCount=0, copyCount=0) {
        console.log('copyType', activity_type, countTotal, page, checkCount);
        this.copyBatch(activity_type, page, checkCount, urlBase).then((res: any) => {
            page = res.page;
            checkCount = res.checkCount;
            copyCount += res.copyCount;
            console.log('copyType2', activity_type, page, checkCount);
            if (!res.done && copyCount < countTotal) {
                this.copyType(activity_type, countTotal, page, urlBase, checkCount, copyCount);
            } else {
                console.log('DONE', activity_type, 'copied', copyCount, 'of',
                     Math.min(countTotal, res.maxCount), 'checked', checkCount,
                    'maxCount', res.maxCount);
            }
        }, (err) => {
            console.log('copyType error, stopping', activity_type);
        });
    }

    copyBatch(activity_type='memory', page=1, checkCount=0, urlBase='', limit=20, retryCount=0) {
        return new Promise((resolve, reject) => {
            const url = (urlBase === '') ? this.plUrls.urls.activity : `${urlBase}/api/v1/activity/`;
            const data: any = {
                activity_type: activity_type,
                disabled: false,
                order_by: '-count',
                limit: limit,
                page: page,
            };
            let done = 0;
            let maxCount = 0;
            const promises = [];
            this.plHttp.get('', data, url).subscribe((res: any) => {
                res.results.forEach((activity) => {
                    promises.push(this.copyOne(activity));
                });
                maxCount = res.count;
                checkCount += res.results.length;
                if (checkCount >= maxCount) {
                    done = 1;
                }
                Promise.all(promises).then((items) => {
                    let copyCount = 0;
                    items.forEach((item) => {
                        if (item && item.copyCount) {
                            copyCount += item.copyCount;
                        }
                    });
                    resolve({ page: (page + 1), checkCount, done, maxCount, copyCount });
                }, (err) => {
                    reject(err);
                });
            }, (err) => {
                if (retryCount < 3) {
                    console.log('get error, retrying', activity_type, err);
                    return this.copyBatch(activity_type, page, checkCount, urlBase, limit, (retryCount + 1));
                } else {
                    console.log('get error, too many retries', activity_type, err);
                    reject(err);
                }
            });
        });
    }

    checkIfAlreadyCopied(activity) {
        return new Promise((resolve, reject) => {
            // First check if we should even copy at all.
            const descriptor = activity.descriptor ? JSON.parse(activity.descriptor) : null;
            // Skip empty activities.
            if (!descriptor || !descriptor.cards) {
                resolve({ alreadyCopied: 1 });
            } else {
                const data = {
                    tag: [this.formCopyTag(activity)],
                };
                const url = `${this.plUrls.urls.activity}`;
                this.plHttp.get('', data, url, { suppressError: true }).subscribe((res: any) => {
                    if (res.results && res.results.length) {
                        resolve({ alreadyCopied: 1 });
                    } else {
                        resolve({ alreadyCopied: 0 });
                    }
                }, (err) => {
                    resolve({ alreadyCopied: 0 });
                });
            }
        });
    }

    formCopyTag(activity) {
        return `cid-${activity.slug}`;
    }

    copyOne(activity) {
        return new Promise((resolve, reject) => {
            this.checkIfAlreadyCopied(activity).then((res: any) => {
                if (res.alreadyCopied) {
                    resolve({ copyCount: 0 });
                } else {
                    console.log('copying', activity.activity_type, activity.uuid, activity.name, activity);
                    const descriptor = activity.descriptor ? JSON.parse(activity.descriptor) : null;
                    // Create new image deck from this activity.
                    const url = this.plUrls.urls.activity;
                    // Append copy tag to be able to look up later to prevent duplicate copies.
                    const copyTag = this.formCopyTag(activity);
                    const tags = activity.tags;
                    const tagUrl = this.plUrls.urls.activityTag;
                    tags.push({
                        name: copyTag,
                        _resource_uri: tagUrl,
                    });
                    const data = Object.assign({}, activity, {
                        activity_type: 'imageDeck',
                        type: 'imageDeck',
                        descriptor: JSON.stringify(this.descriptorToImageDeck(descriptor)),
                        tags: tags,
                    });
                    delete data.uuid;
                    delete data.id;
                    // delete data.resource_uri;
                    delete data.slug;
                    // Extra safety check - do NOT want to modify any existing activities!
                    if (data.activity_type === 'imageDeck' && data.type === 'imageDeck') {
                        this.plHttp.save('', data, url).subscribe((res: any) => {
                            resolve({ copyCount: 1 });
                        }, (err) => {
                            console.log('failed saving new image deck', activity.name, err);
                            reject(err);
                        });
                    } else {
                        console.log('safety check failed, not imageDeck');
                        reject({});
                    }
                }
            });
        });
    }

    descriptorToImageDeck(descriptor) {
        const images = [];
        descriptor.cards.forEach((card) => {
            images.push({
                id: card.id,
                title: card.title,
                url: card.url || card.thumbnail_url,
                thumbnail_url: card.thumbnail_url || card.url,
                copies: 1,
            });
        });
        return {
            images: images,
        };
    }
}
