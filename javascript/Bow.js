/*******************
Bow.js

Define a bow object
*******************/

Bow = (function() {
    function Bow(img, frame, size) {
        Sprite.apply(this, size);
        this.img = Game.instance.assets(img);
        this.frame = frame;
    }

    return Bow;
}());
