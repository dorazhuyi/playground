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
    var BORDER_IMAGE = "res/img/border.png";
    var BOWS_IMAGE  = "res/img/bows.png";
    var BOX_IMAGE = "res/img/box.png";
    var HANDS_IMAGE = "res/img/hands.png";
    var ICON_IMAGE  = "res/img/icons.png";
    var JUICE_IMAGE = "res/img/juice.png";
    var STRAW_IMAGE = "res/img/straws.png";
    game.preload(BORDER_IMAGE);
    game.preload(BOWS_IMAGE);
    game.preload(BOX_IMAGE);
    game.preload(HANDS_IMAGE);
    game.preload(ICON_IMAGE);
    game.preload(JUICE_IMAGE);
    game.preload(STRAW_IMAGE);
    

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

        var Message = Class.create(Group, {
            initialize : function(config) {
                Group.apply(this);

                if(config.border) {
                    var bd = new Sprite(config.border.width, config.border.height);
                    bd.image = game.assets[BORDER_IMAGE];
                    bd.frame = config.border.frame;
                    if(config.border.scale) {
                        bd.scaleX = config.border.scale[0];
                        bd.scaleY = config.border.scale[1];
                    }
                    this.addChild(bd);
                }

                var label = new Label(config.initText);
                label.color = config.textColor;
                label.font = config.textFont;
                label.textAlign = 'center';
                if(config.border) {
                    label.width = config.border.width;
                }

                this.addChild(label);

                this.x = config.initX;
                this.y = config.initY;
            },

            changeMessage : function(msg) {
                this.lastChild.text = msg;
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
                    switch(this.frame) {
                        case 0:
                            config.message.changeMessage("BOWS!");
                            break;
                        case 1:
                            config.message.changeMessage("Still, BOWS!");
                            break;
                        case 2:
                            config.message.changeMessage("Wut?");
                            break;
                    }

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
                            config.message.changeMessage("Hmmmmm...");
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
                    this.tl.moveBy(368, 0, Math.floor(Math.random()*(35-15))+15)
                           .moveBy(-368, 0, Math.floor(Math.random()*(35-15))+15)
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

                this.preY = this.y;

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
                    this.preY = this.y;
                    this.y = evt.y - 54/2;
                    config.straw.y = evt.y - 80 - 54/2;
                    if(this.within(config.box, 490 - 180)
                        && this.y > 180 + (490 - 400) && this.preY < 180 + (490 - 400)
                        && config.box.x > (145 - 112/2) && config.box.x < (145 + 112/2))
                    {
                        config.msg.changeMessage('Jews box <br> SUCCESS!');
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

        // Stage 2

        var Instruction = Class.create(Group, {
            initialize : function() {
                Group.apply(this);

                var ibd = new Sprite(90, 120);
                ibd.image = game.assets[BORDER_IMAGE];
                ibd.frame = 1;
                ibd.scaleX = 4;
                ibd.scaleY = 4;
                ibd.x = 140;
                ibd.y = 240;

                var tag1 = new Label("Reach 1000 points to survive!");
                tag1.color = 'black';
                tag1.font = '20px Impact, sans-serif';
                tag1.textAlign = 'center';
                tag1.width = 400;
                tag1.y = 90;

                var tags = new Group();
                for(var i=0; i<5; i++) {
                    var t = new Label();
                    t.color = 'black';
                    t.font = '20px';
                    t.x = 240;
                    t.y = 150 + i * 60;
                    tags.addChild(t);
                }
                tags.childNodes[0].text = '-10p/-50p/-1 life';
                tags.childNodes[1].text = '+10p/+50p';
                tags.childNodes[2].text = '+100p/+200p';
                tags.childNodes[3].text = '+1 life/+1 life + 300p<br>Harmless!';
                tags.childNodes[4].text = 'Memory!';

                var tag2 = new Label("Ready? Tap to Start!");
                tag2.color = 'black';
                tag2.font = '20px Impact, sans-serif';
                tag2.textAlign = 'center';
                tag2.width = 400;
                tag2.y = 480;

                var legends = new Group();
                for(var i=0; i<10; i++) {
                    var img = new Sprite(120, 120);
                    img.image = game.assets[ICON_IMAGE];
                    img.scaleX = 0.5;
                    img.scaleY = 0.5;
                    img.frame = i;
                    if(i<3) {
                        img.x = i * 60;
                    } else if (i<5) {
                        img.x = (i-3) * 60;
                        img.y = 65;
                    } else if (i<7) {
                        img.x = (i-5) * 61;
                        img.y = 130; 
                    } else if (i<9) {
                        img.x = (i-7) * 61;
                        img.y = 195;
                    } else {
                        img.x = 30;
                        img.y = 260;
                    }
                    legends.y = 100;
                    legends.addChild(img);
                }

                this.addChild(ibd);
                this.addChild(legends);
                this.addChild(tag1);
                this.addChild(tags);
                this.addChild(tag2);

                this.x = 60;

                this.addEventListener(Event.TOUCH_END, function(evt){
                    rescueScene.removeChild(fixedJuice);
                    rescueScene.removeChild(this);
                    rescueScene.addChild(new Falling());
                });

            }
        });

        var Life = Class.create(Group, {
                initialize : function() {
                    Group.apply(this);

                    for(var i=0; i<3; i++) {
                        var heart = new Sprite(45, 40);
                        heart.image = game.assets[BORDER_IMAGE];
                        heart.frame = 9;
                        heart.scaleX = 0.5;
                        heart.scaleY = 0.5;
                        heart.x = 5 + i * 25;
                        this.addChild(heart);
                    }

                    this.nLife = 3;
                    this.x = 30;
                    this.y = 10;

                },

                decreaseLife : function() {
                    --this.nLife;
                    if(this.nLife > 2) {
                        this.removeChild(this.lastChild);
                    } else if(this.nLife > 0) {
                        this.childNodes[this.nLife].frame = 8;
                    } else {
                        this.childNodes[0].frame = 8;

                        console.log("you're died");
                        this.parentNode.diedDialog();
                    }
                },

                increaseLife : function() {
                    ++this.nLife;
                    if(this.nLife > 10) {
                        this.nLife = 10;
                    } else if (this.nLife > 3) {
                        var heart = new Sprite(45, 40);
                        heart.image = game.assets[BORDER_IMAGE];
                        heart.frame = 9;
                        heart.scaleX = 0.5;
                        heart.scaleY = 0.5;
                        heart.x = 5 + (this.nLife-1) * 25;
                        this.addChild(heart);
                    } else {
                        this.childNodes[this.nLife-1].frame = 9;
                    }
                }

        });

        var scoreTag = Class.create(Label, {
            initialize : function(config) {
                Label.apply(this);

                this.text = config.text;
                this.color = config.color;

                this.addEventListener(Event.ENTER_FRAME, function(evt){
                    this.tl.delay(15)
                           .then(function(){
                                this.parentNode.removeChild(this);
                           });
                });
            }
        });

        var FallingObj = Class.create(Sprite, {
            initialize : function(config){
                Sprite.apply(this, [120, 119]);

                this.image = game.assets[ICON_IMAGE];
                this.frame = config.frame;

                this.x = Math.random() * 360;

                this.scoreChange = config.scoreChange ? config.scoreChange : 0;
                this.lifeChange = config.lifeChange ? config.lifeChange : 0;

                var tag = new scoreTag({
                    text : config.text,
                    color : config.color
                });

                tag.textAlign = 'center';

                this.addEventListener(Event.ENTER_FRAME, function(evt){
                    // falling down
                    this.y += config.speed * evt.elapsed * 0.001;
                    if(config.rotationSpeed) {
                        this.rotation += config.rotationSpeed * evt.elapsed * 0.001;           
                    }
                    if(this.y > game.height) {
                        this.parentNode.removeChild(this);
                        return;        
                    }
                    // collision
                    if(this.intersect(this.parentNode.player) && this.parentNode.lifeBar.nLife > 0) {
                        tag.x = this.x;
                        tag.y = this.y + 60;

                        if(config.harmlessOn) {
                            this.parentNode.player.harmlessMode = 1;
                        }

                        if(this.parentNode.player.harmlessMode) {
                            if(this.scoreChange && this.scoreChange > 0) {
                                this.parentNode.score += this.scoreChange;
                                rescueScene.addChild(tag);
                            }
                            if(this.lifeChange && this.lifeChange > 0) {
                                this.parentNode.lifeBar.increaseLife();
                                rescueScene.addChild(tag);
                            }
                        } else {
                            rescueScene.addChild(tag);
                            this.scoreChange ? this.parentNode.score += this.scoreChange : {};
                            this.lifeChange ? (this.lifeChange > 0 ? this.parentNode.lifeBar.increaseLife()
                                                                   : this.parentNode.lifeBar.decreaseLife())
                                            : {};
                        }
                        this.parentNode.removeChild(this); 
                    }
                });
            }
        });

        var Player = Class.create(Sprite, {
            initialize : function(){
                Sprite.apply(this, [120, 120]);

                this.image = game.assets[ICON_IMAGE];
                this.frame = 10;

                this.x = 240 - 60;
                this.y = 640 - 120;

                this.harmlessMode = 0;

                this.addEventListener(Event.TOUCH_MOVE, function(evt){
                    this.x = evt.x - 60;
                });

                this.addEventListener(Event.ENTER_FRAME, function(evt){
                    if(this.harmlessMode) {
                        this.tl.then(function(){
                                        console.log("harmless start");
                                        this.frame = 11;
                                    })
                               .delay(240)
                               .then(function(){
                                        console.log("harmless end");
                                        this.frame = 10;
                                        this.harmlessMode = 0;
                                    })
                               .waitUntil(function(){
                                        return (this.harmlessMode === 1);
                                    });
                    }
                });
            }
        });

        var Falling = Class.create(Group, {
            initialize : function(){
                Group.apply(this);

                var bd = new Sprite(90, 3);
                bd.image = game.assets[BORDER_IMAGE];
                bd.frame = 1;
                bd.scaleX = 5.3;
                bd.scaleY = -4;
                bd.x = 195;
                bd.y = 50;

                var label = new Label('Point:<br>Life:');
                label.font = '500px';
                label.x = 10;
                label.y = 5;
                
                this.player = new Player();

                this.lifeBar = new Life();
                this.score = 0;

                var scoreLabel = new Label('0');
                scoreLabel.font = '16px';
                scoreLabel.x = 55;
                scoreLabel.y = 5;

                this.addChild(bd);
                this.addChild(label);
                this.addChild(scoreLabel);

                this.addChild(this.lifeBar);
                this.addChild(this.player);

                this.addEventListener(Event.ENTER_FRAME, function(evt){
                    scoreLabel.text = this.score;

                    if(this.score >= 20) {
                        this.lastChanllenge();
                    }
                });

                this.tl.then(this.dropItem)
                       .delay(30)
                       .loop();

            },

            diedDialog : function() {
                var title  = new Label('YOU ARE DIED!');

                title.x = 140;
                title.y = 300;

                var subtitle = new Label('Tap to retry');
                subtitle.x = 140;
                subtitle.y = 330;

                rescueScene.addChild(title);
                rescueScene.addChild(subtitle);

                this.tl.pause();

                rescueScene.addEventListener(Event.TOUCH_START, function(evt){
                    rescueScene.addEventListener(Event.TOUCH_END, function(evt){
                        rescueScene.removeChild(subtitle);
                        rescueScene.removeChild(title);
                        rescueScene.removeChild(rescueScene.lastChild);
                        rescueScene.addChild(new Falling());
                        rescueScene.clearEventListener();
                    });
                });
            },

            dropItem : function(){
                var selector = Math.random();
                var item;
                switch(true) {
                    // chair 20%
                    case (selector >=0 && selector < 0.2) :
                        item = new FallingObj({
                                                frame : 0,
                                                scoreChange : -5,
                                                speed : 300,
                                                rotationSpeed : 190,
                                                text : '-5 <br> OMG Strike me!',
                                                color : 'red'
                                            });
                        break;
                    // table 20%
                    case (selector >= 0.2 && selector < 0.4) :
                        item = new FallingObj({
                                                frame : 1,
                                                scoreChange : -10,
                                                speed : 200,
                                                rotationSpeed : 140,
                                                text : '-10 <br> Hebrew abuse!',
                                                color : 'red'
                                            });
                        break;
                    // light 15%
                    case (selector >= 0.4 && selector < 0.55) :
                        item = new FallingObj({
                                                frame : 2,
                                                lifeChange : -1,
                                                speed : 190,
                                                text : '-1 life <br> Light me on fire!',
                                                color : 'red'
                                            });
                        break;
                    // Cake 15%
                    case (selector >= 0.55 && selector < 0.7) :
                        item = new FallingObj({
                                                frame : 3,
                                                scoreChange : +1,
                                                speed : 300,
                                                rotationSpeed : 190,
                                                text : '+1 <br> A cake is filming!',
                                                color : 'green'
                                            });
                        break;
                    // Juice Box 15%
                    case (selector >= 0.7 && selector < 0.85) :
                        item = new FallingObj({
                                                frame : 4,
                                                scoreChange : +5,
                                                speed : 300,
                                                rotationSpeed : 190,
                                                text : '+5 <br> Jews! Be advised',
                                                color : 'green'
                                            });
                        break;
                    // Mike 5%
                    case (selector >= 0.85 && selector < 0.9) :
                        item = new FallingObj({
                                                frame : 5,
                                                scoreChange : +10,
                                                speed : 300,
                                                text : '+10 <br> Mike Audet, the power bottom!',
                                                color : 'green'
                                            });
                        break;
                    // Mark 5%
                    case (selector >= 0.9 && selector < 0.95) :
                        item = new FallingObj({
                                                frame : 6,
                                                scoreChange : +20,
                                                speed : 300,
                                                text : '+20 <br> I apologize!',
                                                color : 'green'
                                            });
                        break;
                    // Naomi 3%
                    case (selector >= 0.95 && selector < 0.98) :
                        item = new FallingObj({
                                                frame : 7,
                                                lifeChange : +1,
                                                speed : 300,
                                                text : '+1 life <br> Will you accept this rose?',
                                                color : 'blue'
                                            });
                        break;
                    // Naomi 2%
                    case (selector >= 0.98 && selector < 1) :
                        item = new FallingObj({
                                                frame : 8,
                                                lifeChange : +1,
                                                harmlessOn : 1,
                                                speed : 300,
                                                text : '+1 life <br> Chans, voluptuous',
                                                color : 'blue'
                                            });
                        break;
                };
                this.addChild(item);
            },

            lastChanllenge : function(){
                this.clearEventListener(Event.ENTER_FRAME);

                var mem = new FallingObj({
                    frame : 9,
                    speed : 40,
                    text  : 'Teehee, was that pretty ok?'
                });

                this.tl.clear();
                this.tl.delay(30)
                       .then(function(){this.addChild(mem);});
            }
        });
        // ================== End Define Object Classes ==================

        

        // ==================  Start of Choice Scene =========================

        var msg = new Message({
            initX : 365,
            initY : 200,
            textColor : 'black',
            textFont  : '16px',
            initText  : 'Hmmmmm...',
            border    : {
                            width  : 90,
                            height : 72,
                            frame  : 0,
                            scale  : [1.5, 1.2]
                        }
        });
        choiceScene.addChild(msg);

        var icon = new Sprite(120, 120);
        icon.image = game.assets[ICON_IMAGE];
        icon.frame = 10;
        icon.x = 305;
        icon.y = 270;
        icon.scaleX = 0.8;
        icon.scaleY = 0.8;
        choiceScene.addChild(icon);

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
            img        : game.assets[JUICE_IMAGE],
            frame      : Utility.flashing(15, 1, 0, 1, false, false)
                                .concat(Utility.flashing(15, 1, 2, 3, false, true))
        });

        var hand = new Hand({
            straw      : straw,
            box        : box,
            juice      : juice,
            msg        : msg,
            frameStack : frameStack
        });

        var bows = [];
        for(var i=0; i<3; i++) {
            bows[i] = new Bow({
                frame       : i,
                initX       : 10+i*135,
                initY       : 20,
                target      : dottedBow,
                message     : msg,
                hand        : hand,
                frameStack  : frameStack

            });
            
        }

        hand.removeNodes = [bows[0], bows[1], bows[2], dottedBow];

        game.pushScene(choiceScene);

        // ==================  End of Choice Scene =========================

        // === Rescue
        var fixedJuice = new Background({
            img   : game.assets[JUICE_IMAGE],
            frame   : 3
        });

        var instruction = new Instruction();

        rescueScene.addChild(fixedJuice);
        rescueScene.addChild(instruction);





    }

    game.start();
}