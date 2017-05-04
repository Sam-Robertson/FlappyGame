var frames = 0;
var pig;
var bacons;
var canvas;
var renderingContext;
var width;
var height;
var states = { Splash: 0, Game: 1, Score: 2};
var currentState;
var foregroundPosition = 0;
var endButton = 0;

function BaconCollection() {
    this._bacons = [];

    this.reset = function () {
        this._bacons = [];
    };

    this.add = function () {
        this._bacons.push(new Bacon());
    };

    this.update = function () {
        if (frames % 100 === 0) { // Add a new bacon to the game every 100 frames.
            this.add();
        }

        for (var i = 0, len = this._bacons.length; i < len; i++) { // Iterate through the array of bacons and update each.
            var bacon = this._bacons[i]; // The current bacon.

            if (i === 0) { // If this is the leftmost bacon, it is the only bacon that the pig can collide with . . .
                bacon.detectCollision(); // . . . so, determine if the pig has collided with this leftmost bacon.
            }

            bacon.x -= 2;
            if (bacon.x < -bacon.width) {
                this._bacons.splice(i, 1);
                i--;
                len--;

            }
        }
    };
            this.draw = function () {
        for (var i = 0, len = this._bacons.length; i < len; i++) {
            var bacon = this._bacons[i];
            bacon.draw();
        }

    };


    function Bacon() {
        this.x = 500;
        this.y = height - (bottomBaconSprite.height + foregroundSprite.height + 120 + 200 * Math.random());
        this.width = bottomBaconSprite.width;
        this.height = bottomBaconSprite.height;


        this.detectCollision = function () {
            // intersection
            var cx = Math.min(Math.max(pig.x, this.x), this.x + this.width);
            var cy1 = Math.min(Math.max(pig.y, this.y), this.y + this.height);
            var cy2 = Math.min(Math.max(pig.y, this.y + this.height + 80), this.y + 2 * this.height + 80);
            // Closest difference
            var dx = pig.x - cx;
            var dy1 = pig.y - cy1;
            var dy2 = pig.y - cy2;
            // Vector length
            var d1 = dx * dx + dy1 * dy1;
            var d2 = dx * dx + dy2 * dy2;
            var r = pig.radius * pig.radius;
            // Determine intersection
            if (r > d1 || r > d2) {
                currentState = states.Score;
            }
        };

        this.draw = function () {
            bottomBaconSprite.draw(renderingContext, this.x, this.y);
            topBaconSprite.draw(renderingContext, this.x, this.y + 80 + this.height);
            topBaconSprite.draw(renderingContext, 0, 0);
        };

    }
}





function Pig() {
    this.frame = 0;
    this.animation = [0, 1, 2, 1];
    this.x = 50;
    this.y = 50;
    this.velocity = 0;
    this.rotation = 0;
    this.radius = 12;

    this.gravity = 0.25;
    this._jump = 4.6;

    this.jump = function () {
        this.velocity = -this._jump;
    };

    this.update = function () {
        var n = currentState === states.Splash ? 10 : 5;

        this.frame += frames % n === 0 ? 1 : 0;
        this.frame %= this.animation.length;

        if (currentState === states.Splash) {
            this.updateIdlePig();
        }
        if (currentState === states.Game) {
            this.updatePlayingPig();
        }

    };


    this.updateIdlePig = function () {
        this.y = height - 280 + 5 * Math.cos(frames / 10);
        this.rotation = 0;
    };

    this.updatePlayingPig = function () {
        this.velocity += this.gravity;
        this.y += this.velocity;

        if (this.y >= height - foregroundSprite.height - 60) { //play around with these numbers too.
            this.y = height - foregroundSprite.height - 60;
            if (currentState === states.Game) {
                currentState = states.Score;
            }


            this.velocity = this._jump;


            if (this.velocity >= this._jump) {
                this.frame = 1;
                this.rotation = Math.min(Math.PI / 2, this.rotation + 0.3);
            }
            else {
                this.rotation = -0.3;
            }
        }
    };

    this.draw = function (renderingContext) {
        renderingContext.save();

        renderingContext.translate(this.x, this.y);
        renderingContext.rotate(this.rotation);

        var n = this.animation[this.frame];
        // renderingContext.clearRect(0, 0, canvas.width, canvas.height);

        pigSprite[n].draw(renderingContext, 2, 2);

        renderingContext.restore();
    };
}

function main() {
    windowSetup();
    canvasSetup();
    loadGraphics();
    currentState = states.Splash;

    document.body.appendChild(canvas);
    pig = new Pig();
    bacons = new BaconCollection();
}

function windowSetup() {
    width = window.innerWidth;
    height = window.innerHeight;

    var inputEvent = "touchstart";
    if (width > 500) {
        width = 380;
        height = 430;
        inputEvent = "mousedown";
    }

    //document.addEventListener(inputEvent,onpress);
}

function canvasSetup() {
    canvas = document.createElement("canvas");

    canvas.style.border = "15px solid #382b1d";

    canvas.width = width;
    canvas.height = height;

    renderingContext = canvas.getContext("2d");
}

function loadGraphics() {
    // initiate the sprite sheet
    var img = new Image();
    img.src = "images/mySpriteImage.png";
    img.onload = function () {
        initSprites(this);
        renderingContext.fillStyle = "#88E4FD";
        pigSprite[0].draw(renderingContext, 50, 50);
        bacons.draw();
        gameLoop();

    };


}

function gameLoop() {
    update();
    render();
    if (currentState != states.Score) {
        foregroundPosition = (foregroundPosition - 3) % 75; //can change numbers
    }

    window.requestAnimationFrame(gameLoop);

}

function update() {
    frames++;
    pig.update();
    // console.log(frames);
}

function render() {
    // Draw background color
    renderingContext.fillRect(0, 0, width, height);

    // // Draw background sprites
    backgroundSprite.draw(renderingContext, 0, height - 450);
    backgroundSprite.draw(renderingContext, backgroundSprite.width, height - backgroundSprite.height);


    pig.draw(renderingContext);
    bacons.draw();

    if (currentState === states.Score) {
        okButtonSprite.draw(renderingContext, okButton.x, okButton.y);
    }

    // Draw foreground sprites
    foregroundSprite.draw(renderingContext, foregroundPosition, height - foregroundSprite.height);
    foregroundSprite.draw(renderingContext, foregroundPosition + foregroundSprite.width, height - foregroundSprite.height);
}



