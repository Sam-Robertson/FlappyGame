var pigSprite;
var obstacle;
var backgroundSprite;
var foregroundSprite;
var bottomBaconSprite;
var topBaconSprite;

function Sprite(img, x, y, width, height) {
    this.img = img;
    this.x = x * 2;
    this.y = y;
    this.width = width;
    this.height = height;
}


Sprite.prototype.draw = function (renderingContext, x, y){
    renderingContext.drawImage(this.img, this.x, this.y, this.width, this.height, x, y, this.width, this.height)

};

function initSprites(img) {
    pigSprite = [
        new Sprite(img, 0, 15, 90, 77), // (x,y) of top left corner, and width, then height
        new Sprite(img, 90, 15, 88, 79),
        new Sprite(img, 180, 16, 89, 87)
    ];

    backgroundSprite = new Sprite(img, 0, 401, 453, 254 );
    foregroundSprite = new Sprite(img, 0, 301, 450, 90);
    bottomBaconSprite = new Sprite(img, 473, 30, 48, 135);
    topBaconSprite = new Sprite(img, 473, 30, 48, 135);
}
// function Mybackground() {
//     $("#Mything").backgroundImage(pigSprite[2]);
// }

// new Sprite(img, 270, 15, 100, 90),
// new Sprite(img, 358, 14, 100, 100)

























