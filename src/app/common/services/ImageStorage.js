var ImageStorage = function() {

    var originalImages = [];
    var squaredImages = {};

    this.generateUID = function() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        });
    };

    this.saveOriginalImage = function (image) {
        originalImages.push(image);
        return originalImages.length;
    };

    this.saveSquaredImage = function (image, imageData) {
        var uid = this.generateUID();
        squaredImages[uid] = [image, imageData];
        return uid;
    };

    this.retrieveOriginalImage = function(index) {
        return originalImages[index];
    };

    this.retrieveSquaredImage = function(key) {
        return squaredImages[key];
    };
};

module.exports = ImageStorage;
