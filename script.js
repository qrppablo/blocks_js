    // General declarations 
    let hit = 0;
    let miss = 0;
    let lives = 3;
    let seconds = 0;
    let isPlaying = false;
    let timer;
    let record;
    let firstTime = true;

    // Used in the matrix nested loop as reference of each block
    let block = 0;

    // Empty array to fill with boolean values of the 5 hit blocks (true) 
    // and the 4 miss blocks (false)
    let hits = [];

    // Elements
    const alert = document.getElementById('alert');
    const text = document.getElementById('text');
    const badgeTime = document.getElementById('badge__time');
    const recordBadge = document.getElementById('badge__record');
    const badgeLives = document.getElementById('badge__lives');
    const button = document.getElementById('button');

    // Messages
    const startMessage = '<strong>Find the 5 red blocks to win! &#x1F3C6 </strong>';
    const winMessage = '<strong>You win! &#x1F389 Press "Start" to play again</strong>';
    const loseMessage = '<strong>You lose! &#x1F62D Press "Start" to play again</strong>';
    const recordMessage = '<strong>New record! &#x1F64C Press "Start" to play again</strong>';

    // Button handler
    button.addEventListener('click', () => {
        startGame();
    });

    // Game starts
    startGame = () => {

        button.disabled = true;
        // Changes the matrix color to grey
        matrixColor('p-4 bg-secondary col');

        // Sets up the initial values
        hit = 0;
        miss = 0;
        lives = 3;
        isPlaying = true;
        badgeTime.className = 'badge badge-success';
        badgeLives.textContent = 'Lives: ' + lives;
        badgeTime.textContent = 'Time: 0 Second(s)';
        createBlocks();
    }

    // Create blocks dynamically
    createBlocks = () => {

        // Displays message to start game
        showMessage('alert alert-dark', startMessage);

        // Timer reset
        clearInterval(timer);
        seconds = 0;
        timer = setInterval(counter, 1000);

        // Generates 5 random numbers from 0 to 8 to be used as reference of the hit blocks
        const r1 = random();
        const r2 = random(r1);
        const r3 = random(r1, r2);
        const r4 = random(r1, r2, r3);
        const r5 = random(r1, r2, r3, r4);

        // Loops from 0 to 8 and fills the hits array comparing 
        // each i number with the ones generated randomly and if they are equal,
        // puts a true value (hit) in the i index of the array, otherwise puts a false (miss)
        for (let i = 0; i < 9; i++) {
            if (i == r1 || i == r2 || i == r3 || i == r4 || i == r5) {
                hits[i] = true; 
            } else { 
                hits[i] = false;
            };
        }
    }

    // Creates an element
    createElement = (type, id, class_, parent) => {
        let element = document.createElement(type);
        element.setAttribute('id', id);
        element.setAttribute('class', class_);
        // Inserts the new element in it's parent
        document.getElementById(parent).appendChild(element);
    }

    // Generates a 3x3 block matrix
    for (let height = 0; height < 3; height++) { // Y axis

        // Creates a new row container (div) 
        createElement('div', `rowBlock-${height}`, 'd-flex justify-content-center bg-light mb-3', 'matrix');

        for (let width = 0; width < 3; width++) { // X axis

            // Creates a new block element (div)
            createElement('div', block.toString(), 'p-4 bg-warning col', `rowBlock-${height}`);

            // Changes the block color
            colorBlock = (classList, color) => {

                // Checks if the block is already grey or dark-grey and removes it's class to change it's color
                classList.contains('bg-dark') ? classList.remove('bg-dark') : classList.remove('bg-secondary');

                switch(color) {
                    case 'red':
                        classList.add('bg-danger');
                        break;
                    case 'darkGrey':
                        classList.add('bg-dark');
                        break;
                    case 'grey':
                        classList.add('bg-secondary');
                        break;
                    case 'white':
                        classList.add('bg-light');
                }
            }

            // Changes the matrix color
            matrixColor = (color) => {
                for (let i = 0; i < 9; i++) {
                    document.getElementById(i.toString()).className = color;
                }
            }

            // Checks if the block is already a hit or miss based on it's classList
            hitOrMiss = (classList) => {
                if (!classList.contains('bg-danger') 
                    && !classList.contains('bg-warning') 
                    && !classList.contains('bg-light')) 
                {
                    return true;
                }
            }

            mouseAction = (e, block, color, click = false) => {
                // Event delegation
                if (e.target.id == block) {
                    // Is the user playing?
                    if (isPlaying) { 
                        const classList = e.target.classList;
                        // And the block isn't a hit or miss
                        if (hitOrMiss(classList)) { 
                            e.target.style.cursor='pointer'; // Changes cursor to pointer
                            // If the cursor is just passing over a block...
                            if (!click) { 
                                colorBlock(classList, color); // Changes it's color
                            // The user has clicked the block!
                            } else { 
                                e.target.style.cursor='default'; // Changes cursor to default
                                // Is a hit?
                                if (hits[block] == true && e.target.id === block.toString()) { 
                                    colorBlock(classList, 'red'); // Changes the block color to red
                                    hit++; // +1 hit
                                // Miss...
                                } else { 
                                    colorBlock(classList, 'white'); // Changes the block color to white
                                    miss++; // +1 miss
                                    lives--; // -1 life
                                    badgeLives.textContent = 'Lives: ' + lives; // Lives badge message refresh
                                }
                                // Invokes the results function
                                showResults();
                            }
                        }
                    }
                }
            }

            // IIFE to setup the mouse event listeners using the current block var value
            ((block) => {

                // Changes the color of the block on mouse over
                document.addEventListener('mouseover', e => { mouseAction(e, block.toString(), 'darkGrey')} );
            
                // Changes the color of the block on mouse out
                document.addEventListener('mouseout', e => { mouseAction(e, block.toString(), 'grey')} );
            
                // Checks for hit or miss block
                document.addEventListener('click', e => { mouseAction(e, block.toString(), null, true)} );

            })(block);
            
            block++; // +1 block
        }   
    }

    // Random number generator, returns a non repeated number
    random = (r1 = null, r2 = null, r3 = null, r4 = null) => {
        let x;

        do { x = Math.floor(Math.random() * 8); }
        while (x == r1 || x == r2 || x == r3 || x == r4);

        return x;
    }

    // Timer to measure how long the round is in seconds
    counter = () => {
        seconds++;
        badgeTime.textContent = 'Time: ' + seconds + ' Second(s)';
        if (seconds > record) {
            badgeTime.className = 'badge badge-danger';
        }
    }

    // Displays win message
    showMessage = (classList, message) => {
        alert.className = classList;
        text.innerHTML = message;
    }

    // Displays new record message asynchronouslly
    newRecord = () => {
        record = seconds;
        recordBadge.innerHTML = 'Record: ' + record + ' Second(s)';
        showMessage('alert alert-warning', recordMessage);
    }

    // Shows round results
    showResults = () => {

        // If the user loses, display the lose message
        if (miss == 3) {
            showMessage('alert alert-danger', loseMessage);     
        }

        // If the user wins 
        if (hit == 5) {
            showMessage('alert alert-success', winMessage); // Display the win message
            // If it's the first round, always creates a new record
            if (firstTime) { 
                newRecord(); // Shows the record message asyncronously
                firstTime = false;
            // If it's not, checks if there's a new record
            } else if (firstTime == false && seconds < record) { 
                newRecord();  
            }
        }

        // Game over
        if (miss == 3 || hit == 5) {
            clearInterval(timer);
            isPlaying = false;
            // Changes the matrix color to yellow
            matrixColor('p-4 bg-warning col'); 
            button.disabled = false;
        }
    }