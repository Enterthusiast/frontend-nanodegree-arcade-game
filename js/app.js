// Enemies our player must avoid
var Enemy = function() {
    this.x = - Hstep;
    this.y = this.rowGenerator() * Vstep - Spriteoffset; // One step down is 1*Vstep and we add a Spriteoffset for perspective effect
    this.speed = this.speedGenerator();
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x = this.x + this.speed * dt;

    if (this.x > canvas.width)
    {
        this.respawn();
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Reset the enemy position after he went offscreen
Enemy.prototype.respawn = function() {
    this.x = - Hstep;
    this.y = this.rowGenerator() * Vstep - Spriteoffset;
    this.speed = this.speedGenerator();
}

// Generate a speed
Enemy.prototype.speedGenerator = function() {
    return Math.floor(Math.random() * (600 - 100)) + 100; //Randomly choose a speed for a ladybug
}

// Randomly choose one of the three rows
Enemy.prototype.rowGenerator = function() {
    return Math.floor(Math.random() * (4 - 1)) + 1; //Randomly choose a ladybug row
}

// Player class
var Player = function() {
    this.x = 2 * Hstep; // one step on the right is 1*Hstep
    this.y = 5 * Vstep - Spriteoffset; // one step down is 1*Vstep and we add a Spriteoffset for perspective effect
    this.score = 0;
    this.bestscore = 0;
    this.sprite = 'images/char-boy.png';
};

// The player update function is in charge of calculating collision
Player.prototype.update = function() {
    // The loop cycle through the enemy list
    for (var i = 0; i < allEnemies.length; i = i+1)
    {
        // It looks for enemy on the same row (same Y position)
        if (allEnemies[i].y === this.y)
        {
            // If the center of the player sprite is "inside" an enemy sprite => game over => respawn
            if ((this.x + 50.5) > allEnemies[i].x && (this.x + 50.5)  < (allEnemies[i].x + 101))
            {
                this.respawn("dead");
            }
        }

    }
};

// The player respawn function is used for two things, so it takes an argument
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

// The player render function also render the score (because the score is attached to the player)
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

// The setScore function calculate the score and update the highscore.
Player.prototype.setScore = function(Oldpositiony, Newpositiony) {
    // The player score when moving up
    // The function check if the player vertical movement was made from a danger lane (gray enemy lanes) to an other/or the water row
    // This is the only way to score
    if (Oldpositiony > 0 && Oldpositiony < 3 * Vstep && Newpositiony > 0 - Vstep && Newpositiony < 3 * Vstep)
    {
        this.score = this.score + 1;

        // Update the highscore if required
        if (this.score > this.bestscore)
        {
            this.bestscore = this.score;
        }
    }
};

// The handleinput function allow the player to move & call the score function if a vertical movement is detected.
Player.prototype.handleInput = function(key) {
    // The score function require this information
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

// The game looks better with offseted sprites
var Spriteoffset = 25;
// These are the Height and Width of the tiles of the "gameboard"
var Hstep = 101; // Horizontal
var Vstep = 83; // Vertical

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [];
for (var i = 0; i < 3; i = i+1)
{
    allEnemies[i] = new Enemy();
}

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
