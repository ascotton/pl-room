import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
    PLHttpService,
    PLUrlsService,
} from '@root/index';

@Injectable()
export class PLImageSaveService {

    constructor(
        private plHttp: PLHttpService,
        private plUrls: PLUrlsService,
        private http: HttpClient,
    ) {
    }

    save(imageUrl, title, imageId, imgEle) {
        return new Observable((observer: any) => {
            const url = `${this.plUrls.urls.platformFE}/api/v1/asset/`;
            const extInfo: any = this.getExtensionFromUrl(imageUrl);
            const imgData = this.getImageData(imgEle);
            const filename = `${title.replace(/ /g, '-')}.${extInfo.ext}`;

            const data = {
                file_type: 'image',
                filename: filename,
                mime_type: extInfo.mime,
                title: title,
                // Apparently a required field?
                tags: [],
            };
            this.plHttp.save('', data, url).subscribe((res: any) => {
                // The first call just gives us info for doing the actual file upload to Amazon S3.
                // Must use form data otherwise get an error about request needing to be multipart form data.
                const fd = new FormData();
                // Apparently key order matters..
                const keys = ['key', 'AWSAccessKeyId', 'acl', 'success_action_redirect', 'Content-Type', 'policy', 'signature'];
                keys.forEach((key) => {
                    fd.append(key, res.manifest[key]);
                });
                // File data must be binary.
                fd.append('file', this.base64toBlob(imgData, extInfo.mime));
                this.http.post(res.upload_url, fd).subscribe((resUpload: any) => {
                    if (!imageId) {
                        imageId = Math.random().toString(36).substring(7);
                    }
                    // Update to the new url from our server.
                    observer.next({ url: res.download_url, id: imageId });
                }, (err) => {
                    observer.error({});
                });
            }, (err) => {
                observer.error({});
            });
        });
    }

    // https://stackoverflow.com/questions/16245767/creating-a-blob-from-a-base64-string-in-javascript
    base64toBlob(b64Data, contentType='', sliceSize=512) {
        const byteCharacters = atob(b64Data);
        const byteArrays = [];

        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);

        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
        }

        const blob = new Blob(byteArrays, {type: contentType});
        return blob;
    }

    getExtensionFromUrl(url) {
        const extensions = [
            { ext: 'jpg', mime: 'image/jpeg' },
            { ext: 'jpeg', mime: 'image/jpeg' },
            { ext: 'png', mime: 'image/png' },
        ];
        for (let ii = 0; ii < extensions.length; ii++) {
            let extensionInfo = extensions[ii];
            let index = url.indexOf(`.${extensionInfo.ext}`);
            if (index > -1) {
                return extensionInfo;
            }
        }
        // Default.
        return 'jpg';
    }

    getImageData(img, mimeType='image/png') {
        var canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        var dataURL = canvas.toDataURL(mimeType);
        return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
    }
}
