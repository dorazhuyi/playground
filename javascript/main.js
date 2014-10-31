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



window.onload = function() {

    var game = new Core(480, 640);
    game.fps = 30;

    // Images
    var BOWS_IMAGE  = "res/img/bows.png";
    var STRAW_IMAGE = "res/img/straws.png";
    var HANDS_IMAGE = "res/img/hands.png";
    var BOX_IMAGE = "res/img/box.png";
    var SPLASH_IMAGE = "res/img/splash.png";
    game.preload(BOWS_IMAGE);
    game.preload(STRAW_IMAGE);
    game.preload(HANDS_IMAGE);
    game.preload(BOX_IMAGE);
    game.preload(SPLASH_IMAGE);
    

    game.onload = function() {
        console.log("Let's start!");

        var titleScene, choiceScene, rescueScene;
        choiceScene = new Scene();
        rescueScene = new Scene();


        //============ Starte Define Object Classes ===============
        var Background = Class.create(Sprite,{
            initialize : function(config) {
                Sprite.apply(this, [480, 640]);

                this.image = config.img;
                this.frame = config.frame || 0;
            }
        });

       var Bow = Class.create(Sprite,{
            initialize : function(config) {
                Sprite.apply(this, [125, 60]);
                
                this.image = game.assets[BOWS_IMAGE];
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

                        choiceScene.addChild(config.hand);
                    } else {
                        this.x = config.initX;
                        this.y = config.initY;
                        
                        if(this.isReset) {
                            config.frameStack.pop();
                            if(config.frameStack.length < 1) {
                                choiceScene.removeChild(config.hand);
                            }
                        }
                    }
                });

                choiceScene.addChild(this);
            }
        });

        var Box = Class.create(Sprite,{
            initialize : function(config) {
                Sprite.apply(this, [112, 150]);
                this.x = 0;
                this.y = 490;
                
                this.image = game.assets[BOX_IMAGE];
                this.frame = 0;

                this.addEventListener(Event.ADDED_TO_SCENE, function(evt){
                    this.tl.moveBy(368, 0, Math.floor(Math.random()*(45-15))+15)
                           .moveBy(-368, 0, Math.floor(Math.random()*(45-15))+15)
                           .loop();
                });
            }
        });

        var Hand = Class.create(Sprite,{
            initialize : function(config) {
                Sprite.apply(this, [66, 54]);
                
                this.image = game.assets[HANDS_IMAGE];
                this.frame = 0;
                this.x = 180;
                this.y = 180;

                this.removeNodes = [];

                this.hasBox = false;

                this.addEventListener(Event.TOUCH_START, function(){
                    this.frame = 1;
                    this.x = 170;
                    this.removeNodes.forEach(function(element, index, array) {
                        choiceScene.removeChild(element);
                    });
                    config.straw.frame = config.frameStack[config.frameStack.length - 1];
                    if(!this.hasBox) {
                        choiceScene.addChild(config.box);
                        this.hasBox = true;
                    }
                });

                this.addEventListener(Event.TOUCH_MOVE, function(evt){
                    this.y = evt.y - 54/2;
                    config.straw.y = evt.y - 80 - 54/2;
                    if(this.within(config.box, 490 - 180)
                        && this.y > 180 + (490 - 400)
                        && config.box.x > (145 - 112/2) && config.box.x < (145 + 112/2)) 
                    {
                        config.box.tl.pause();
                        this.clearEventListener();
                        choiceScene.addChild(config.juice);
                        // after splash finishes, move to next scene
                        choiceScene.tl.delay(65)
                                      .then(function(){game.replaceScene(rescueScene);});
                        
                    }
                });
            }
        });

        var Straw = Class.create(Sprite,{
            initialize : function(config) {
                Sprite.apply(this, [125, 300]);
                
                this.image = game.assets[STRAW_IMAGE];
                this.frame = 3;
                this.x = 145;
                this.y = 100;

                choiceScene.addChild(this);
            }
        });
        // ================== End Define Object Classes ==================

        

        // ==================  Start of Choice Scene =========================
        

        var label = new Label();
        label.x = 345;
        label.y = 250;
        label.color = "black";
        label.font = "16px black";
        choiceScene.addChild(label);

        var box = new Box();
        var straw = new Straw();

        var dottedBow = new Sprite(125, 60);
        dottedBow.image = game.assets[BOWS_IMAGE];
        dottedBow.x = 145;
        dottedBow.y = 118;
        dottedBow.frame = Utility.flashing(12, 3, 4, 3, false, true);
        choiceScene.addChild(dottedBow);

        var frameStack = [];

        var juice = new Background({
            img        : game.assets[SPLASH_IMAGE],
            frame      : Utility.flashing(15, 1, 0, 1, false, false)
                                .concat(Utility.flashing(15, 1, 2, 3, false, true))
        });

        var hand = new Hand({
            straw      : straw,
            box        : box,
            juice      : juice,
            frameStack : frameStack
        });

        var bows = [];
        for(var i=0; i<3; i++) {
            bows[i] = new Bow({
                frame       : i,
                initX       : 10+i*135,
                initY       : 20,
                target      : dottedBow,
                label       : label,
                hand        : hand,
                frameStack  : frameStack

            });
            
        }

        hand.removeNodes = [bows[0], bows[1], bows[2], dottedBow];

        game.pushScene(choiceScene);

        // ==================  End of Choice Scene =========================

        // === Rescue
        var fixedJuice = new Background({
            img   : game.assets[SPLASH_IMAGE],
            frame   : 3
        });

        rescueScene.addChild(fixedJuice);




    }

    game.start();
}