/****
    * @desc Simple Frogger Game
    * @author Gameplay by Damien Bernard, anything else by Udacity
    * @required engine.js, resources.js
*****/


/****
    * @desc this class implement the enemy data, behaviour & render
    * when created the enemy is assigned a position on a random row and a random speed, then a sprite
    * like x, y, speed, sprite, render(), update(dt), respawn(), speedGenerator() & rowGenerator()
    * @param none
    * @return none
*****/
var Enemy = function() {
    this.x = - Hstep;
    this.y = this.rowGenerator() * Vstep - Spriteoffset; // One step down is 1*Vstep and we add a Spriteoffset for perspective effect
    this.speed = this.speedGenerator();
    this.sprite = 'images/enemy-bug.png';
};

/****
    * @desc updates the enemy's position, it's a required method for the game engine
    * if the enemy position is out of the canvas, the enemy is respawned
    * @param float dt - a time delta between ticks
    * @return none
*****/
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x = this.x + this.speed * dt;

    // if the enemy position is out of the canvas, the enemy is respawned
    if (this.x > canvas.width)
    {
        this.respawn();
    }
};

/****
    * @desc draws the enemy on the screen, it's a required method for the game engine
    * @param none
    * @return none
*****/
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/****
    * @desc resets the enemy position after he went offscreen
    * then set the enemy to a new row with a new speed
    * @param none
    * @return none
*****/
Enemy.prototype.respawn = function() {
    this.x = - Hstep;
    this.y = this.rowGenerator() * Vstep - Spriteoffset;
    this.speed = this.speedGenerator();
}

/****
    * @desc generate a random speed
    * @param none
    * @return float speed - a speed for the enemy
*****/
Enemy.prototype.speedGenerator = function() {
    return Math.floor(Math.random() * (600 - 100)) + 100; //Randomly choose a speed for a ladybug
}

/****
    * @desc chooses one of the three row randomly
    * @param none
    * @return int row - a row for the enemy
*****/
Enemy.prototype.rowGenerator = function() {
    return Math.floor(Math.random() * (4 - 1)) + 1; //Randomly choose a ladybug row
}


/****
    * @desc this class implement the player data, controls, score calculations & render
    * when created the player is assigned a fixed position a score and highscore, then a sprite.
    * like x, y, speed, sprite, render(), update(dt), respawn(), speedGenerator() & rowGenerator()
    * @param none
    * @return none
*****/
var Player = function() {
    this.x = 2 * Hstep; // one step on the right is 1*Hstep
    this.y = 5 * Vstep - Spriteoffset; // one step down is 1*Vstep and we add a Spriteoffset for perspective effect
    this.score = 0;
    this.bestscore = 0;
    this.sprite = 'images/char-boy.png';
};

/****
    * @desc check the if there is a collision between any of the enemy and the player
    * if a collision is detected the player is respawned with the parameter "dead"
    * @param none
    * @return none
*****/
Player.prototype.update = function() {
    // The loop cycle through the enemy list
    for (var i = 0; i < allEnemies.length; i = i+1)
    {
        // It looks for enemy on the same row (same Y position)
        if (allEnemies[i].y === this.y)
        {
            // If the center of the player sprite is "inside" an enemy sprite
            // => game over => respawn with "dead parameter"
            if ((this.x + 50.5) > allEnemies[i].x && (this.x + 50.5)  < (allEnemies[i].x + 101))
            {
                this.respawn("dead");
            }
        }

    }
};

/****
    * @desc respawns the player to its initial position
    * if the player respawn because he is dead the score is reset too.
    * @param string reason - tell the reason of the respawn "death" or "success"
    * @return none
*****/
Player.prototype.respawn = function(reason) {
    // Respawn always reset the player position
    this.x = 2 * Hstep;
    this.y = 5 * Vstep - Spriteoffset;

    // Then if the player is respawned because he died, the score is set to 0
    if (reason === "dead")
    {
        this.score = 0;
    }
}

/****
    * @desc render the player sprite and the player score on screen
    * @param none
    * @return none
*****/
Player.prototype.render = function() {
    // render player
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);

    // render score
    ctx.font = "bold 18px Arial";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 3;
    ctx.strokeText("Score " + this.score, 10, 80);
    ctx.strokeText("Best " + this.bestscore, 10, 100);
    ctx.fillStyle = "white";
    ctx.fillText("Score " + this.score, 10, 80);
    ctx.fillText("Best " + this.bestscore, 10, 100);
};

/****
    * @desc calculate the score and update the highscore
    * using the previous and new position of the player.
    * if the player moved from a paved lanes to another paved or to a water tile
    * the player score
    * @param int Oldpositiony - the Y position of the player before his last movement
    * @param int Newpositiony - the Y position of the player after his last movement
    * @return none
*****/
Player.prototype.setScore = function(Oldpositiony, Newpositiony) {
    // The function check if the player vertical movement was made
    // from a paved lane to an other paved lane, or to a water tile
    // This is the only way to score
    if (Oldpositiony > 0 && Oldpositiony < 3 * Vstep && Newpositiony > 0 - Vstep && Newpositiony < 3 * Vstep)
    {
        this.score = this.score + 1;

        // Update the highscore if lower than the present score
        if (this.score > this.bestscore)
        {
            this.bestscore = this.score;
        }
    }
};

/****
    * @desc allows the player to move & calls the score function if a vertical movement is made
    * @param string key - stores the name of used key
    * @return none
*****/
Player.prototype.handleInput = function(key) {
    // The score function requires the Player previous position
    // So we store the player Y position before movement, as it may be needed
    var Oldpositiony = this.y;

    // Input detection
    switch(key) {
        case 'left':
            var Newposition = this.x - Hstep;
            if (Newposition >= 0) // Prevent the player to move out of the frame
            {
                this.x = Newposition;
            }
            break;
        case 'up':
            var Newposition = this.y - Vstep;
            if (Newposition >= 0) // Prevent the player to move on the water tiles and above
            {
                this.y = Newposition;
            } else {
                // Respawn the player after he succesfully reach the water, so he can continue to play and score
                this.respawn("success");
            }
            // calculate score using the old & new positions
            // score is only calculated for vertical movements
            this.setScore(Oldpositiony, Newposition);
            break;
        case 'right':
            var Newposition = this.x + Hstep;
            if (Newposition <= canvas.width - Hstep) // Prevent the player to move out of the frame
            {
                this.x = Newposition;
            }
            break;
        case 'down':
            var Newposition = this.y + Vstep;
            if (Newposition <= canvas.height - 2 * Vstep) // Prevent the player to move out of the bottom grass tiles
            {
                this.y = Newposition;
            }
            // calculate score using the old & new positions
            // score is only calculated for vertical movements
            this.setScore(Oldpositiony, Newposition);
            break;
    }
};

/****
    * Global Scope
****/

// The game looks better with offseted sprites
// so a global, easy to modify variable si created
var Spriteoffset = 25;

// These are the variable storing the Height and Width of the "gameboard" tiles
var Hstep = 101; // Horizontal width
var Vstep = 83; // Vertical height

// Instantiates 3 enemies
var allEnemies = [];
for (var i = 0; i < 3; i = i+1)
{
    allEnemies[i] = new Enemy();
}

// Instantiates the player character
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

/****
    * Enf Of File
****/