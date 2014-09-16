/***************



****************/


enchant();

window.onload = function() {

    var game = new Core(480, 640);
    game.fps = 30;

    // Images
    var BOWS_IMAGE  = "res/img/bows.png";
    var STRAW_IMAGE = "res/img/straws.png";
    game.preload(BOWS_IMAGE);
    game.preload(STRAW_IMAGE);

    function getSprite(img, frame, size, pos) {
        var sprite = new Sprite(size[0], size[1]);
        sprite.image = game.assets[img];
        sprite.frame = frame;
        sprite.x = pos[0];
        sprite.y = pos[1];
        return sprite;
    }

    game.onload = function() {
        console.log("Let's start!");

        // Create sprites
        var greenBow  = getSprite(BOWS_IMAGE, 0, [125, 60], [10, 320]);
        var pinkBow   = getSprite(BOWS_IMAGE, 1, [125, 60], [145, 320]);
        var purpleBow = getSprite(BOWS_IMAGE, 2, [125, 60], [280, 320]);

        var titleScene, choiceScene, rescueScene;

        // Start choosing bows
        choiceScene = new Scene();
        choiceScene.addChild(greenBow);
        choiceScene.addChild(pinkBow);
        choiceScene.addChild(purpleBow);

        choiceScene.on('touchmove', function(evt) {
            greenBow.x = evt.localX - greenBow.width/2;
            greenBow.y = evt.localY - greenBow.height/2;
        });

        game.pushScene(choiceScene);



    }

    game.start();
}