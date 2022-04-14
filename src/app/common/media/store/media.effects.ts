import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';
import { Action } from '@ngrx/store';
import { createEffect, Actions, ofType, OnInitEffects } from '@ngrx/effects';
import { DevicesService } from '../devices.service';
import { MediaActions, MediaActionTypes } from './media.actions';
import { DeviceInfo, DeviceType, DeviceDirection } from './media.model';

@Injectable()
export class MediaEffects implements OnInitEffects {
    refresh$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(
                MediaActions.init,
                MediaActions.refresh,
                MediaActions.devicesChanged,
            ),
            switchMap(({ type }) => {
                const requestPermissions = type === MediaActionTypes.refresh;
                return this.listDevices(requestPermissions).pipe(
                    map(devices => MediaActions.refreshSuccess({ devices })),
                    catchError((error) => {
                        const errObj = {
                            error,
                        };
                        console.error('LIST_DEVICES', errObj);
                        return of(MediaActions.refreshError(errObj));
                    }),
                );
            }),
        );
    });

    devicesChanged$ = createEffect(
        () => {
            return this.devicesService.onDeviceChange().pipe(
                map(() => MediaActions.devicesChanged()),
            );
        },
    );

    ngrxOnInitEffects(): Action {
        return MediaActions.init();
    }

    private listDevices(requestPermissions = true) {
        const devices$ = this.devicesService.listDevices().pipe(
            map(devices => devices.map(d => this.parseDevice(d))),
        );

        if (!requestPermissions) {
            return devices$;
        }

        return this.devicesService.requestPermissions({ audio: true, video: true }).pipe(
            switchMap(() => devices$),
        );
    }

    private parseDevice(device: MediaDeviceInfo): DeviceInfo {
        const [kind, type, direction] = device.kind.match(/(\w+)(input|output)/i);
        return {
            ...device.toJSON(),
            kind: kind as MediaDeviceKind,
            type: type as DeviceType,
            direction: direction as DeviceDirection,
        };
    }

    constructor(
        private actions$: Actions,
        private devicesService: DevicesService,
    ) { }
}
