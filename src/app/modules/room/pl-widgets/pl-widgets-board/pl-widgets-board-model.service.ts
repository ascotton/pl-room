import { Injectable, NgZone } from '@angular/core';
import { CurrentUserModel } from '@root/src/app/common/models/CurrentUserModel';
import { FirebaseAppModel } from '@root/src/app/common/models/firebase/firebase-app-model.service';
import { FirebaseModel } from '@root/src/app/common/models/firebase/FirebaseModel';
import { each, extend, findIndex, merge } from 'lodash';
import { Subject } from 'rxjs';
import { PLWidget } from '../pl-widget.model';
import { PLWidgetsOverlayService } from '../pl-widgets-overlay/pl-widgets-overlay.service';
import { Store } from '@ngrx/store';
import { AppStore } from '@app/appstore.model';
import { DrawerState, selectDrawer } from '../../pl-drawers/store';
import { AppState } from '@root/src/app/store';
import { PLWidgetsService } from '../pl-widgets.service';

interface WidgetState {
    widgets: Array<PLWidget>;
    references: any;
}

@Injectable()
export class PLWidgetsBoardModelService {
    private scaleChangedSource = new Subject<void>();
    scaleChanged$ = this.scaleChangedSource.asObservable();

    state: WidgetState = {
        widgets: [],
        references: {},
    };
    removedReferences = [];
    ref: any;
    width: number;
    height: number;

    serverTimeOffset = 0;
    changed: boolean;

    ready = false;

    widgetBoardElement: any = null;
    widgetBoardRecalcTimeout: any = null;

    constructor(private firebaseModel: FirebaseModel,
                private firebaseAppModel: FirebaseAppModel,
                private widgetsOverlayModel: PLWidgetsOverlayService,
                private currentUserModel: CurrentUserModel,
                private zone: NgZone,
                private store: Store<AppStore>,
                private store2: Store<AppState>,
                private widgetsService: PLWidgetsService,
                ) {
        this.ref = firebaseModel.getFirebaseRef('widgets');
        this.updateServerTimeOffset();
        this.setupFirebaseHandlers();
    }

    private updateServerTimeOffset() {
        const timeRef = firebase.database().ref();
        timeRef.child('.info/serverTimeOffset').on('value', (snap) => {
            this.serverTimeOffset = snap.val();
        });
    }

    getFirebaseTime() {
        return Date.now() + this.serverTimeOffset;
    }

    private setupFirebaseHandlers() {
        this.store2.select(selectDrawer).subscribe((drawer) => {
            this.recalcBoardLoop(null, null, null, null);
        }),

        this.store.select('firebaseStateStore').subscribe(
            (data: any) => {
                if (!data) {
                    return;
                }
                const type = data.type;
                const payload = data.payload;
                switch (type) {
                        case 'FIREBASE_UPDATE':
                            setTimeout(() => {
                                this.recalcBoardLoop(null, null, null, null);
                            }, 10);
                            return;
                }
            },
        );

        this.ref.on('value', (snap) => {
            if (!this.ready) {
                const widgets = this.state.widgets;
                each(snap.val(), (value, key) => {
                    // Get default param values for widget type
                    // to ensure that we always have all properties filled
                    let defaultParams = {};
                    const widgetCatalog = this.widgetsService.getWidgets();
                    const defaultwidget = widgetCatalog.find(widget => widget.type === value.type);
                    if (defaultwidget) {
                        defaultParams = defaultwidget.params;
                    }
                    // Must copy, since we mutate widgets and want to preserve
                    // the firebase value. Otherwise will lose the original and
                    // first load can start in the wrong position because this
                    // gets overwritten with a bad value.
                    widgets.push({ ...value, params: { ...defaultParams, ...value.params }, $id: key });
                });
                this.changeWidgetboardState();
            }
            this.ready = true;
            setTimeout(() => {
                this.scaleChangedSource.next();
                this.recalcBoardLoop(null, null, null, null);
            },         10);
        });

        this.ref.on('child_added', (snap, prevChild) => {
            if (this.ready) {
                const widgets = this.state.widgets;
                const msg = snap.val();
                msg.$id = snap.key;
                this.zone.run(() => {
                    widgets.push(msg);
                });
                this.changeWidgetboardState();
                setTimeout(() => {
                    this.scaleChangedSource.next();
                    this.recalcBoardLoop(null, null, null, null);
                },         0);
            }
        });

        this.ref.on('child_removed', (snap) => {
            const widgets = this.state.widgets;
            const key = snap.key;

            this.removedReferences.push(key);

            const idx = findIndex(widgets, { $id: key });

            this.zone.run(() => {
                if (idx >= 0) {
                    widgets.splice(idx, 1);
                }
                delete(this.state.references[key]);
            });
            this.changeWidgetboardState();
            setTimeout(() => {
                this.scaleChangedSource.next();
                this.recalcBoardLoop(null, null, null, null);
            },         10);
        });

        this.ref.on('child_changed', (snap) => {
            const key = snap.key;

            const widgets = this.state.widgets;
            const idx = findIndex(widgets, { $id: key });

            this.changeWidgetboardState();

            if (idx >= 0) {
                const val = snap.val();
                const widget = { ...widgets[idx] };

                widget.initial_top_x = val.initial_top_x;
                widget.initial_top_y = val.initial_top_y;
                widget.initial_width = val.initial_width;
                widget.zIndex = val.zIndex;
                widget.hidden = val.hidden;
                widget.params = { ...val.params };

                this.zone.run(() => {
                    widgets[idx] = widget;
                });
            }

            setTimeout(() => {
                this.scaleChangedSource.next();
                this.recalcBoardLoop(null, null, null, null);
            },         10);
        });
    }

    getWidgets() {
        return this.state.widgets;
    }

    createWidgetProportional(item, top_x_fractional, top_y_fractional) {
        const top_x = top_x_fractional * this.getWidth();
        const top_y = top_y_fractional * this.getHeight();
        return this.createWidget(item, top_x, top_y, this.getWidth());
    }

    createWidget(item, top_x, top_y, width) {
        const widget = {};
        const numberOfWidgets = this.getWidgets().length;
        merge(widget, item, {
            top_x,
            top_y,
            initial_top_x: top_x,
            initial_top_y: top_y,
            initial_width: width ? width : this.width,
            zIndex: numberOfWidgets + 1,
        });

        const widgetRef = this.ref.push(widget);
        return widgetRef;
    }

    setWidth(width) {
        this.width = width;
    }

    getWidth() {
        return this.width;
    }

    setHeight(height) {
        this.height = height;
    }

    getHeight() {
        return this.height;
    }

    getWidgetReferenceById(id) {
        if (this.state.references[id]) {
            return this.state.references[id];
        }

        const reference = this.firebaseModel.getFirebaseRef('widgets/' + id);
        this.state.references[id] = reference;
        return reference;
    }

    prepareWidgetToUpdate(updateWidget) {
        if (!this.currentUserModel.user.isClinicianOrExternalProvider()) {
            delete updateWidget['top_x'];
            delete updateWidget['top_y'];
            delete updateWidget['initial_top_x'];
            delete updateWidget['initial_top_y'];
            delete updateWidget['initial_width'];
        }

        delete updateWidget['actions'];
        delete updateWidget['$id'];
        return updateWidget;
    }

    syncWidget(widget) {
        const reference = this.getWidgetReferenceById(widget.$id);
        const prepared = this.prepareWidgetToUpdate({ ...widget });

        reference.once('value', (snap) => {
            const val = snap.val();
            extend(val, prepared);
            reference.set(val);
        });
    }

    deleteWidgetById(id) {
        this.getWidgetReferenceById(id).remove();
    }

    updateWidgetByIndex(widget) {
        this.getWidgetReferenceById(widget.$id).update({ ...widget });
    }
    updateWidgetByKey(key, widget) {
        this.getWidgetReferenceById(key).update({ ...widget });
    }

    syncWidgets() {
        const widgets = this.getWidgets();
        widgets.forEach((widget) => this.syncWidget(widget));
    }

    changeWidgetboardState() {
        if (this.state.widgets.length > 0) {
            this.firebaseAppModel.setWidgetboardStatus(true);
        } else {
            this.firebaseAppModel.setWidgetboardStatus(false);
        }
    }

    recalcBoardLoop(first, element1, prevWidth, prevHeight, duration= 160, interval= 10, durationCounter= 0) {
        if (durationCounter < duration) {
            this.recalcBoard(first, element1, prevWidth, prevHeight, 0);
            setTimeout(() => {
                this.recalcBoardLoop(first, element1, prevWidth, prevHeight, duration, interval, (durationCounter + interval));
            },         interval);
        }
    }

    recalcBoard(first, element1, prevWidth, prevHeight, timeout = 200) {
        // Save for next time, so can call from outside the directive, where we do not have
        // access to the element.
        if (element1) {
            this.widgetBoardElement = element1;
        }
        let resWidth = prevWidth;
        let resHeight = prevHeight;
        const element = element1 || this.widgetBoardElement;
        if (element) {
            const width = element.clientWidth != null ? element.clientWidth : element.width();
            const height = element.clientHeight != null ? element.clientHeight : element.height();
            if (first || width !== prevWidth || height !== prevHeight || this.changed) {
                resWidth = width;
                resHeight = height;
                this.changed = false;
                this.recalcBoardScale(width, height, timeout);
            }
        }
        return {
            prevWidth: resWidth,
            prevHeight: resHeight,
        };
    }

    recalcBoardScale(width, height, timeout= 200) {
        if (this.widgetBoardRecalcTimeout) {
            clearTimeout(this.widgetBoardRecalcTimeout);
        }
        this.widgetBoardRecalcTimeout = setTimeout(() => {
            this.setWidth(width);
            this.setHeight(height);
            this.scaleChangedSource.next();
            this.widgetsOverlayModel.setWidthAndScale(width);
        },                                         timeout);
    }
}
