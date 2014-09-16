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
        sprite.initialX = pos[0];
        sprite.initialY = pos[1];
        return sprite;
    }

    function getFlashing(dur, times, frame1, frame2, odd, stop) {
        var arr = new Array();
        for (var j=0; j<times; j++) {
            for (var i=0; i<dur; i++) {
                arr[i+2*j*dur]     = frame1;
                arr[i+(2*j+1)*dur] = frame2;
            }
        }
        if(odd) {
            for(var i=0; i<dur; i++) {
                arr[arr.length] = frame1;
            }
        }
        if(stop) {
            arr[arr.length] = null;
        }
        return arr;
    }

    function eventWithIn(evt, obj) {
        if( evt.localX >= obj.x && evt.localX <= obj.x + obj.width
            && evt.localY >= obj.y && evt.localY <= obj.y + obj.height) {
            return true;
        } else {
            return false;
        }
    }

    game.onload = function() {
        console.log("Let's start!");

        // Create sprites
        var bowSize = [125, 60];
        var bowInitialPos = {
            green  : [10, 320],
            pink   : [145, 320],
            purple : [280, 320],
            dotted : [145, 400]
        };
        var flash = getFlashing(6, 3, 3, 4, true, true);
        var bows = {
            green  : getSprite(BOWS_IMAGE, 0, bowSize, bowInitialPos.green),
            pink   : getSprite(BOWS_IMAGE, 1, bowSize, bowInitialPos.pink),
            purple : getSprite(BOWS_IMAGE, 2, bowSize, bowInitialPos.purple),
            dotted : getSprite(BOWS_IMAGE, flash, bowSize, bowInitialPos.dotted)
        }
        var strawSize = [125, 300]

        var titleScene, choiceScene, rescueScene;

        // Start choosing bows
        choiceScene = new Scene();
        choiceScene.addChild(bows.green);
        choiceScene.addChild(bows.pink);
        choiceScene.addChild(bows.purple);
        choiceScene.addChild(bows.dotted);

        var bowTarget;

        choiceScene.on('touchstart', function(evt) {
            if(eventWithIn(evt, bows.green)) {
                bowTarget = bows.green;
            } else if (eventWithIn(evt, bows.pink)) {
                bowTarget = bows.pink;
            } else if (eventWithIn(evt, bows.purple)) {
                bowTarget = bows.purple;
            } else {
                bowTarget = undefined;
            }
        });

        choiceScene.on('touchmove', function(evt) {
            if(bowTarget) {
                bowTarget.x = evt.localX - bowTarget.width/2;
                bowTarget.y = evt.localY - bowTarget.height/2;
            }
        });

        choiceScene.on('touchend', function(evt) {
            if(bowTarget) {
                if(eventWithIn(evt, bows.dotted)) {
                     
                } else {
                    bowTarget.x = bowTarget.initialX;
                    bowTarget.y = bowTarget.initialY;  
                }
                
            }
        });

        game.pushScene(choiceScene);



    }

    game.start();
}