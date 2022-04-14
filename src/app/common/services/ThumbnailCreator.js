var ThumbnailCreator = function($q) {
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');

    this.cardImageSize = 376;
    this.thumbImageSize = 150;

    this.canvas.width = this.cardImageSize;
    this.canvas.height = this.cardImageSize;

    /**
     *
     * @param file Original file containing image
     * @param callback Callback that should be called after image is prepared.
     * @param errorCallback
     * Signature is function(image) {};
     */
    this.createImageFromFile = function(file, callback, errorCallback) {

        this.context.clearRect(0, 0, 3000, 3000);

        var image = new Image;
        var fileReader = new FileReader;

        fileReader.onload = (e) => {

            image.onload = () => {
                callback(image);
            };

            image.onerror = (err) => {
                errorCallback(err);
            };

            image.src = e.target.result;
        };

        fileReader.onerror = (e) => {
            errorCallback(e);
        };

        fileReader.readAsDataURL(file);
    };

    this.createScaledImage = function(file, callback, errorCallback) {
        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');

        var me = this;

        var image = new Image;
        var fileReader = new FileReader;

        fileReader.onload = function () {
            image.onload = function () {

                if (image.width < image.height) {
                    canvas.width = 150;
                    canvas.height = image.height * (150 / image.width);
                } else {
                    canvas.width = 240;
                    canvas.height = image.height * (240 / image.width);
                }

                context.save();

                context.drawImage(image,
                    0,
                    0,
                    image.width,
                    image.height,
                    0,
                    0,
                    canvas.width,
                    canvas.height);

                context.restore();

                var scaledImage = new Image;

                scaledImage.onload = function () {
                    callback(scaledImage);
                };

                scaledImage.onerror = (err) => {
                    errorCallback(err);
                };

                scaledImage.src = canvas.toDataURL();
            };

            image.onerror = (e) => {
                errorCallback(e);
            };

            image.src = fileReader.result;
        };

        fileReader.onerror = (e) => {
            errorCallback(e);
        };

        fileReader.readAsDataURL(file);
    };

    /**
     *
     * @param file Original file containing image
     * @param offsetX Offset of new image in original image (X axis)
     * @param offsetY Offset of new image in original image (Y axis)
     * @param size Size of new image (both width and height)
     * @param rotation Rotation of new image (both width and height)
     * @param callback Callback that should be called after image is cropped.
     * Signature is function(image, data) {};
     */
    this.createSquaredImage = function(file, offsetX, offsetY, size, rotation, callback) {
        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');

        canvas.width = this.cardImageSize;
        canvas.height = this.cardImageSize;

        var me = this;

        var image = new Image;
        var fileReader = new FileReader;

        fileReader.onload = function () {

            image.onload = function () {

                context.save();

                context.translate(me.cardImageSize / 2, me.cardImageSize / 2);
                context.rotate(rotation * Math.PI / 180);
                context.translate(-me.cardImageSize / 2, -me.cardImageSize / 2);

                context.drawImage(image,
                    offsetX,
                    offsetY,
                    size,
                    size,
                    0,
                    0,
                    me.cardImageSize,
                    me.cardImageSize);

                context.restore();

                var croppedImage = new Image;

                croppedImage.onload = function () {
                    callback(croppedImage, canvas.toDataURL());
                };

                croppedImage.src = canvas.toDataURL();
            };

            image.src = fileReader.result;
        };

        fileReader.readAsDataURL(file);
    };
};

ThumbnailCreator.$inject = ['$q'];

module.exports = ThumbnailCreator;