/***************
A Birthday gift for Naomi's friend

All copyright by Yi Zhu (dora.zhuyi@gmail.com)
08 - 12, 2014
****************/


enchant();

Utility = (function() {

    return {

        flashing : function(dur, times, frame1, frame2, odd, stop) {
            var arr = [];
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
    };
}());

// Bow 
var Bow = Class.create(Sprite,{
    initialize : function(config) {
        Sprite.apply(this, [125, 60]);
        
        this.image = config.img;
        this.frame = config.frame;
        this.x = config.initX;
        this.y = config.initY;

        this.isReset = false;

        this.addEventListener(Event.TOUCH_START, function(){
            config.label.text = "Hmmmmm...";
            if(this.within(config.target, 60/2)) {
                this.isReset = true;
            } else {
                this.isReset = false;
            }
        });

        this.addEventListener(Event.TOUCH_MOVE, function(evt){
            this.x = evt.x - 125/2;
            this.y = evt.y - 60/2;
        });

        this.addEventListener(Event.TOUCH_END, function(evt){
            if(this.within(config.target, 60/2))
            {
                this.x = config.target.x;
                this.y = config.target.y;
                config.label.text = "literally, the gayest";

                if(!this.isReset) {
                    config.frameStack.push(this.frame);
                    config.frameStack.sort(function(a, b) {
                        return a - b;
                    });
                }

                config.scene.addChild(config.hand);
            } else {
                this.x = config.initX;
                this.y = config.initY;
                
                if(this.isReset) {
                    config.frameStack.pop();
                    if(config.frameStack.length < 1) {
                        config.scene.removeChild(config.hand);
                    }
                }
            }
            console.log(config.frameStack);
        });
    }
});

var Straw = Class.create(Sprite,{
    initialize : function(config) {
        Sprite.apply(this, [125, 300]);
        
        this.image = config.img;
        this.frame = 3;
        this.x = 145;
        this.y = 200;
    }
});

var Hand = Class.create(Sprite,{
    initialize : function(config) {
        Sprite.apply(this, [66, 54]);
        
        this.image = config.img;
        this.frame = 0;
        this.x = 180;
        this.y = 280;

        this.removeNodes = [];

        this.addEventListener(Event.TOUCH_START, function(){
            this.frame = 1;
            this.x = 170;
            this.removeNodes.forEach(function(element, index, array) {
                config.scene.removeChild(element);
            });
            config.straw.frame = config.frameStack[config.frameStack.length - 1];
        });

        this.addEventListener(Event.TOUCH_MOVE, function(evt){
            this.y = evt.y - 54/2;
            config.straw.y = evt.y - 80 - 54/2;
        });
    }
});

var Box = Class.create(Sprite,{
    initialize : function(config) {
        Sprite.apply(this, [66, 54]);
        
        this.image = config.img;
        this.frame = 0;
        this.x = 180;
        this.y = 280;
    }
});

window.onload = function() {

    var game = new Core(480, 640);
    game.fps = 30;

    // Images
    var BOWS_IMAGE  = "res/img/bows.png";
    var STRAW_IMAGE = "res/img/straws.png";
    var HANDS_IMAGE = "res/img/hands.png";
    game.preload(BOWS_IMAGE);
    game.preload(STRAW_IMAGE);
    game.preload(HANDS_IMAGE);
    

    game.onload = function() {
        console.log("Let's start!");

        var titleScene, choiceScene, juiceScene, rescueScene;

        // ==================  Start of Choice Scene =========================
        choiceScene = new Scene();

        var label = new Label();
        label.x = 145;
        label.y = 50;
        label.color = "black";
        label.font = "16px black";
        choiceScene.addChild(label);

        var straw = new Straw({
            img     : game.assets[STRAW_IMAGE]
        });
        choiceScene.addChild(straw);

        var dottedBow = new Sprite(125, 60);
        dottedBow.image = game.assets[BOWS_IMAGE];
        dottedBow.x = 145;
        dottedBow.y = 218;
        dottedBow.frame = Utility.flashing(12, 3, 4, 3, false, true);
        choiceScene.addChild(dottedBow);

        var frameStack = [];

        var hand = new Hand({
            img        : game.assets[HANDS_IMAGE],
            straw      : straw,
            frameStack : frameStack,
            scene      : choiceScene
        });

        var bows = [];
        for(var i=0; i<3; i++) {
            bows[i] = new Bow({
                img         : game.assets[BOWS_IMAGE],
                frame       : i,
                initX       : 10+i*135,
                initY       : 120,
                target      : dottedBow,
                label       : label,
                hand        : hand,
                frameStack  : frameStack,
                scene       : choiceScene

            });
            choiceScene.addChild(bows[i])
        }

        hand.removeNodes = [bows[0], bows[1], bows[2], dottedBow];


        // ==================  End of Choice Scene =========================

        game.pushScene(choiceScene);



    }

    game.start();
}