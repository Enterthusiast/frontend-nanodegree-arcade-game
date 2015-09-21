// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    this.x = 2 * this.Hstep; //one step right is 101
    this.y = 5 * this.Vstep - 30; //one step down is 41.5 and we shift the sprite of 30 pixels for perspective effect
    this.sprite = 'images/char-boy.png';
};
Player.prototype.Hstep = 101;
Player.prototype.Vstep = 81;
Player.prototype.update = function() {};
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
Player.prototype.handleInput = function(key) {
    switch(key) {
        case 'left':
            var Newposition = this.x - this.Hstep;
            if (Newposition >= 0)
            {
                this.x = Newposition;
            }
            break;
        case 'up':
            var Newposition = this.y - this.Vstep;
            if (Newposition >= 0 - this.Vstep)
            {
                this.y = Newposition;
            }
            break;
        case 'right':
            var Newposition = this.x + this.Hstep;
            if (Newposition <= canvas.width - this.Hstep) //preventing the player to move out of the frame
            {
                this.x = Newposition;
            }
            break;
        case 'down':
            var Newposition = this.y + this.Vstep;
            if (Newposition <= canvas.height - 2 * this.Vstep) //preventing the player to move out of the tile
            {
                this.y = Newposition;
            }
            break;
    }
};


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [];
var player = new Player();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
