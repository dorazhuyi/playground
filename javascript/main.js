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

    function eventWithInObj(evt, obj) {
        if( evt.localX >= obj.x && evt.localX <= obj.x + obj.width
            && evt.localY >= obj.y && evt.localY <= obj.y + obj.height) {
            return true;
        } else {
            return false;
        }
    }

    function eventWithInRange(evt, topLeft, botRight) {
        if( evt.localX >= topLeft[0] && evt.localX <= botRight[0]
            && evt.localY >= topLeft[1] && evt.localY <= botRight[1]) {
            return true;
        } else {
            return false;
        }
    }

    game.onload = function() {
        console.log("Let's start!");

        // Create sprites
        var bowSize = [125, 60];
        // bow color order: green, pink, purple, dotted flash, dotted
        var bowInitialPos = [[10, 220], [145, 220], [280, 220], [145, 318]];
        var flash = getFlashing(12, 3, 4, 3, false, true);
        var bows = [];
        for(var i=0; i<3; i++) {
            bows[i] = getSprite(BOWS_IMAGE, i, bowSize, bowInitialPos[i]);
        }
        bows[3] = getSprite(BOWS_IMAGE, flash, bowSize, bowInitialPos[3]);
        bows[4] = getSprite(BOWS_IMAGE, 3, bowSize, bowInitialPos[3]);
        console.log(bows);

        // Straw color order: green, pink, purple, origin
        var strawSize = [125, 300];
        var strawInitialPos = [145, 300];
        var straw = getSprite(STRAW_IMAGE, 0, strawSize, strawInitialPos);

        var titleScene, choiceScene, juiceScene, rescueScene;

        // ==================  Start of Choice Scene =========================
        choiceScene = new Scene();
        choiceScene.addChild(straw);
        for(var i=0; i<4; i++) {
            choiceScene.addChild(bows[i]);
        }

        var targetIndex;
        var isReset;
        var preIndex;
        var move;

        choiceScene.on('touchstart', function(evt) {
            if(targetIndex > -1 && isReset === undefined) {
                choiceScene.removeChild(bows[3]);
                choiceScene.addChild(bows[4]);
            }
            //check only for actual bows
            for(var i=0; i<3; i++) {
                if(eventWithInObj(evt, bows[i])) {
                    if(targetIndex && preIndex !== i) {
                        bows[targetIndex].x = bowInitialPos[targetIndex][0];
                        bows[targetIndex].y = bowInitialPos[targetIndex][1];
                    }
                    targetIndex = i;
                    isReset = 0;
                    move = 1;
                }
            }
            if(targetIndex > -1 && eventWithInRange(evt, bowInitialPos[3], 
                [bowInitialPos[3][0]+bowSize[0], bowInitialPos[3][1]+bowSize[1]]))
            {
                isReset = 1;
                choiceScene.addChild(bows[4]);
                move = 1;
            }
            console.log("targetIndex: " + targetIndex + " isReset: " + isReset + " preIndex: " + preIndex);
        });

        choiceScene.on('touchmove', function(evt) {
            if(targetIndex > -1) {
                bows[targetIndex].x = evt.localX - bows[targetIndex].width/2;
                bows[targetIndex].y = evt.localY - bows[targetIndex].height/2;
            }
            console.log("targetIndex: " + targetIndex + " isReset: " + isReset + " preIndex: " + preIndex);

        });

        choiceScene.on('touchend', function(evt) {
            if(targetIndex > -1) {
                if(isReset) {
                    bows[targetIndex].x = bowInitialPos[targetIndex][0];
                    bows[targetIndex].y = bowInitialPos[targetIndex][1];
                    isReset = 0;
                } else if (eventWithInObj(evt, bows[3])) {
                    choiceScene.removeChild(bows[4]);
                    bows[targetIndex].x = bowInitialPos[3][0];
                    bows[targetIndex].y = bowInitialPos[3][1];
                } else if (move) {
                    bows[targetIndex].x = bowInitialPos[targetIndex][0];
                    bows[targetIndex].y = bowInitialPos[targetIndex][1];
                } 
                preIndex = targetIndex;
                move = 0;
            }
            console.log("targetIndex: " + targetIndex + " isReset: " + isReset + " preIndex: " + preIndex);

        });
        // ==================  End of Choice Scene =========================

        game.pushScene(choiceScene);



    }

    game.start();
}