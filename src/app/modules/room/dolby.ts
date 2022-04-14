// import { Observable } from "./observable";
// import { BroadcastOptions, StreamType, VideoProvider, VideoProviderEventHandler, VideoProviderEventMap, VideoProviderObservable } from "./services";
// import VoxeetSDK from "@voxeet/voxeet-web-sdk";
// import Conference from "@voxeet/voxeet-web-sdk/types/models/Conference";
// import _ from "lodash";
// import { Participant } from "@voxeet/voxeet-web-sdk/types/models/Participant";
// import { MediaStreamWithType } from "@voxeet/voxeet-web-sdk/types/models/MediaStream";

// interface ConferenceStream {
//     stream: MediaStream;
//     type: StreamType;
// }

// export class DolbyProvider implements VideoProvider {
//     /** A mapping of event names to observables */
//     readonly observers: VideoProviderObservable;

//     readonly apiKey: string;
//     readonly secretKey: string;
//     readonly userName: string;
//     readonly userToken: string;

//     /** A mapping of stream names to ConferenceStreams */
//     readonly streamNameMap: Map<string, ConferenceStream>;

//     constructor(apiKey: string, secretKey: string, userName: string, userToken: string) {
//         this.observers = {
//             connect: new Observable(),
//             disconnect: new Observable(),
//             startBroadcast: new Observable(),
//             stopBroadcast: new Observable(),
//             remoteStartBroadcast: new Observable(),
//             remoteStopBroadcast: new Observable(),
//         }

//         this.apiKey = apiKey;
//         this.secretKey = secretKey;
//         this.userName = userName;
//         this.userToken = userToken;

//         this.streamNameMap = new Map();

//         VoxeetSDK.conference.on("joined", () => {
//             this.observers.connect.notify(null);
//         });

//         VoxeetSDK.conference.on("left", () => {
//             this.observers.disconnect.notify({ reason: "Left the conference gracefully" });
//         });

//         VoxeetSDK.conference.on("error", (err: Error) => {
//             this.observers.disconnect.notify({ reason: err.message });
//         });

//         VoxeetSDK.conference.on("streamAdded", (participant: Participant, stream: MediaStreamWithType) => {
//             // TODO: How to handle stream names? Append participant id with stream type?
//             this.observers.remoteStartBroadcast.notify({ stream, streamName: stream });
//         });

//         VoxeetSDK.initialize(this.apiKey, this.secretKey);
//     }

//     connect(): Promise<void> {
//         return new Promise((resolve, reject) => {
//             VoxeetSDK.session.open({ name: this.userName })
//                 .then(() => {
//                     // This only creates a new conference if one with the alias doesn't exist.
//                     // If it does exist it just returns the existing conference object.
//                     // https://docs.dolby.io/communications-apis/docs/conferencing#joining-conferences-using-the-conference-alias
//                     VoxeetSDK.conference.create({ alias: this.userToken })
//                         .then(conference => {
//                             VoxeetSDK.conference.join(conference, {})
//                                 .then(() => resolve())
//                                 .catch(reject);
//                         })
//                         .catch(reject);
//                 })
//                 .catch(reject);
//         });
//     }

//     disconnect() {
//         VoxeetSDK.session.close();
//     }

//     broadcast(streamName: string, stream: MediaStream, options: BroadcastOptions = {}): Promise<void> {
//         console.assert(this.conference);

//         options = {
//             broadcastAudio: _.defaultTo(options.broadcastAudio, true),
//             broadcastVideo: _.defaultTo(options.broadcastVideo, true),
//             streamType: _.defaultTo(options.streamType, "camera"),
//         };

//         return new Promise((resolve, reject) => {
//             // TODO: handle stream type
//             const type = options.streamType;

//             VoxeetSDK.conference.startStream(stream)
//                 .then(() => {
//                     this.streamNameMap.set(streamName, { stream, type });
//                     resolve();
//                 })
//                 .catch(reject);
//         });
//     }

//     stopBroadcast(streamName: string) {
//         console.assert(this.conference);

//         const cStream = this.streamNameMap.get(streamName);
//         console.assert(cStream);

//         VoxeetSDK.conference.stopStream(cStream.stream);
//         this.streamNameMap.delete(streamName);
//     }

//     updateBroadcast(streamName: string, stream: MediaStream): Promise<void> {
//         console.assert(this.conference);

//         const cStream = this.streamNameMap.get(streamName);
//         console.assert(cStream);

//         this.stopBroadcast(streamName);
//         return this.broadcast(streamName, stream, { streamType: cStream.type });
//     }

//     broadcastAudio(streamName: string, enabled: boolean) {
//         if (enabled) {
//             VoxeetSDK.conference.startAudio(this.self);
//         } else {
//             VoxeetSDK.conference.stopAudio(this.self);
//         }
//     }

//     broadcastVideo(streamName: string, enabled: boolean) {
//         if (enabled) {
//             VoxeetSDK.conference.startVideo(this.self, {});
//         } else {
//             VoxeetSDK.conference.stopVideo(this.self);
//         }
//     }

//     receiveAudio(streamName: string, enabled: boolean) {
//         // TODO: How to handle stream name for remote streams?
//     }

//     receiveVideo(streamName: string, enabled: boolean) {
//         // TODO: How to handle stream name for remote streams?
//     }

//     setReceiveVolume(streamName: string, volume: number) {
//         // TODO: Unsupported?
//     }

//     streamExists(streamName: string): boolean {
//         return this.streamNameMap.has(streamName);
//     }

//     on<T extends keyof VideoProviderEventMap>(event: T, handler: VideoProviderEventHandler[T]) {
//         this.observers[event].add(handler);
//     }

//     off<T extends keyof VideoProviderEventMap>(event: T, handler: VideoProviderEventHandler[T]) {
//         this.observers[event].remove(handler);
//     }

//     private get conference(): Conference {
//         return VoxeetSDK.conference.current;
//     }

//     private get self(): Participant {
//         return VoxeetSDK.session.participant;
//     }
// }
