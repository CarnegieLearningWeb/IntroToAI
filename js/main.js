var xWon = 0;
var oWon = 0;
var tie = 0;
var spaces;

//This is Javascript code to play tic-tac-toe, with a framework to make the computer
//play intelligently

//OVERVIEW of the code:
//HTML is used to draw the webpage, including a tic-tac-toe board and a statistics table
//The tic-tac-toe board is a grid of buttons, once for each space on the board.
//
//
//The tic-tac-toe board looks like this:
//
//    0 | 1 | 2  
//   ---|---|--- 
//    3 | 4 | 5  
//   ---|---|--- 
//    6 | 7 | 8  
//
//Each space on the board gets a number from 0 to 8
//
//
//If we want to see the whole board, we use an array like this:
//    ------------------------------------
//   | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
//    ------------------------------------
//
//Each of the places in the array is either 'X', 'O' or ''
//For example, if the board looks like this:
//
//    X |   | X  
//   ---|---|--- 
//      | O |    
//   ---|---|--- 
//      |   |    
//
//Then the array looks like this:
//
//    ------------------------------------
//   | X |   | X |   | O |   |   |   |   |
//    ------------------------------------
//
//
//
// Two functions to understand:
//     - move(space) - called when the user clicks on a space in the tic-tac-toe board
//     - takeComputerTurn - decides what move the computer will take
//
//When the player clicks on a button, the Javascript function "move" is called
//
//The function "move" works like this:
//
// - IF the button the user clicked on is a blank space:
// -    change the button to X [since the human, X, picked that space]
// -    check to see if X won the game [function findWin]
// -    color the board, highlighting a win in red (or a tie in purple) [function colorBoard]
// -    IF X didn't win:
//         The computer (O) takes a turn [function takeComputerTurn]
//         check to see if O has won the game
//         color the board, highlighting a win in red (or a tie in purple)  [function colorBoard]
// -    IF the game is over
//         update the statistics [function updateStats]
//
//
//takeComputerTurn is called to make a move by the computer. This is called from the
//"move" function
//  It looks at the menu for player O [the computer]
//  If the menu is choice 0 [Random], then getRandomMove is called
//  If the menu is choice 1 [My Algorithm], then makeMyMove is called
//
//
//The computer has a few strategies to use:
//
//
//    All strategies (except getRandomMove) look for a pattern in the board. If they
//    find the pattern, they return a move (the number of the space). Otherwise, they 
//    return -1, indicating that the strategy doesn't apply.
//
//    getRandomMove - this is the simplest strategy. It just picks a random open space
//    getFirstMove - this is used for the first computer move
//    getWinningMove - this looks for 2 in a row. It can look for either two Os in a row
//                     (which is an opportunity for O to win) or 2 Xs in a row (which is
//                     an opportunity for O to block X from winning)
//    getOppositeCornerBlock - this looks for a pattern of X-O-X on a diagonal
//    getBlockForCornerAndSide - looks for X with a corner and a side, with O in the middle
//    getBlockForSides - looks for Xs on two sides around a corner
//    
//
//Make a move. The parameter "space" is the space that was clicked on
function move(space) {
    if (space.value == '') {                //check to see that the cell is empty first
    	space.value = 'X';                  //set the cell to X (in the visible board)
    	//create an array of the current board
        var board = new Array(spaces[0].value,spaces[1].value,spaces[2].value,
                              spaces[3].value,spaces[4].value,spaces[5].value,
                              spaces[6].value,spaces[7].value,spaces[8].value);
        var winningPattern = findWin(board);       //check to see if the game is over
        colorBoard(board);                         //draw the board
        if (!winningPattern) {                     //if the game is NOT over
            var computerMove;
            computerMove = takeComputerTurn(board);   //let the computer go
            spaces[computerMove].value = 'O';          //set O on screen
            board[computerMove] = 'O';                //and in the board array
            winningPattern = findWin(board);          //check if the computer won
        	colorBoard(board);                        //and draw the board again
        }
        if (winningPattern)
        	updateStats(winningPattern);
    }
}

//takeComputerTurn makes a turn for the computer
//It looks at the skill level of the computer player
function takeComputerTurn(board) {
   var moveTaken = -1;
   var computerStrategy;
   
   computerStrategy = getComputerStrategy();
   if (computerStrategy == "Random") 
      moveTaken = getRandomMove(board);
   else
      moveTaken = makeMyMove(board);
    return moveTaken;
}


//getRandomMove picks a random open space on the board for the computer to move
//First, we count the number of empty spaces on the board
//Then, we pick a random number between 0 and the number of empty spaces
//Then, we set that numbered empty space to the letter O

function getRandomMove(board) {
   var moveToTake = -1;
   
    var numOpenSpaces = countOpenSpaces(board);           //count the number of open spaces
    var nthOpen= Math.floor(Math.random()*numOpenSpaces); //get a random number up to the number of open spaces
    var openSpaceCounter = 0;                                     

    board.forEach(
       function(space,spaceNum) {       //for each of the 9 spaces on the board
         if ((space == '') &&                      //if the space is empty
             (nthOpen == openSpaceCounter)) {         //and this is the nth open space
              moveToTake = spaceNum;                     //set this as the move to make
              openSpaceCounter = openSpaceCounter+1;     //and increment the open space count
         }
         else if (space == '') {                   //if this is an open space (but not the nth)
              openSpaceCounter = openSpaceCounter+1;  //increment the open space counter
         }
       })
    return moveToTake;
}
       
//makeMyMove is the function that you will modify to make the computer smarter
//It starts by just making a random move
function makeMyMove(board) {
   var move = -1;
   
   move = getRandomMove(board);      //do a random move
   return move;
} 

//findPattern takes a board and nine strings. If the board matches the pattern, then
//it returns true. Otherwise, it returns false.
//The pattern can contain 'X', 'O', '' or '*'
//The '*' means that anything can be in that space.
//For example, '*','*','*','*','X','*','*','*','*' looks like
//  _____________
//  | * | * | * |
//  |---|---|---|
//  | * | X | * |
//  |---|---|---|
//  | * | * | * |
//  -------------
//and matches any board that has an X in the center

function findPattern(board,topleft,topcenter,topright,middleleft,middlecenter,middleright,
                     bottomleft,bottomcenter,bottomright) {
    var patternRA = new Array(topleft,topcenter,topright,middleleft,middlecenter,
                               middleright,bottomleft,bottomcenter,bottomright);
    var match = true;          //assume the pattern matches until we find a mismatch
    patternRA.forEach(
       function(space,spacePosition) {
          if (space != '*' &&
              space != board[spacePosition])
             match = false;
       })
    return match;
}
    
//count the number of open spaces
function countOpenSpaces(board) {
	var numOpenSpaces = 0;
	board.forEach(
	   function(space) {
         if (space == '')
              numOpenSpaces = numOpenSpaces+1;
       })
    return numOpenSpaces;
}

//getFirstMove is used to make the computer's first move
//If the first player picks the center, then we'll want to pick a corner
//If the first player picked a corner, then we take the center
function getFirstMove (board) {
   var moveToMake = -1;
   if (findPattern(board,'','','','','X','','','','')) { //IF just an X in the middle
      moveToMake = 0;                                    //then take the top left
   }
   else if (findPattern(board,'X','','','','','','','','') ||  //If X took topleft
            findPattern(board,'','','X','','','','','','') ||  //or X took topright
            findPattern(board,'','','','','','','X','','') ||  //or X took bottomleft
            findPattern(board,'','','','','','','','','X') ||  //or X took bottomright
            findPattern(board,'','X','','','','','','','') ||  //If X took topcenter
            findPattern(board,'','','','X','','','','','') ||  //or X took middleleft
            findPattern(board,'','','','','','X','','','') ||  //or X took middleright
            findPattern(board,'','','','','','','','X',''))    //or X took bottomcenter
         moveToMake = 4;                 //then take the center
   return moveToMake;
}

//getCornerMove returns an open corner (or else -1 if all the corners are taken)
function getCornerMove(board) {
   var openCorner = -1;
   
   if (board[0] == '')
      openCorner = 0;
   else if (board[2] == '')
      openCorner = 2;
   else if (board[6] == '')
      openCorner = 6;
   else if (board[8] == '')
      openCorner = 8;
   return openCorner;
}

//getCornerMove returns an open side (or else -1 if all the corners are taken)
function getSideMove(board) {
   var openSide = -1;
   
   if (board[1] == '')
      openSide = 1;
   else if (board[3] == '')
      openSide = 3;
   else if (board[5] == '')
      openSide = 5;
   else if (board[7] == '')
      openSide = 7;
   return openSide;
}

//if X has opposite corners with O in the middle, then O should play an edge
//For example, if the board is:
//  _____________
//  | X | 1 |   |
//  |---|---|---|
//  | 3 | O | 5 |
//  |---|---|---|
//  |   | 7 | X |
//  -------------
// Then O should take one of the side moves (either 1, 3, 5 or 7).
// This will force X to take the opposite side on the next move (rather than a corner)
function getOppositeCornerBlock(board) {
   var moveToTake = -1;
	if (findPattern(board,'X','*','*','*','O','*','*','*','X'))
	   moveToTake = getSideMove(board);
	else if (findPattern(board,'*','*','X','*','O','*','X','*','*'))
	   moveToTake = getSideMove(board);
	return moveToTake;
}

//if X has a corner and a side that is not in the corner's row or column, then O
//should take the corner in between them
//For example, if the board is:
//  _____________
//  | X |   | 2 |
//  |---|---|---|
//  |   | O | X |
//  |---|---|---|
//  |   |   |   |
//  -------------
// Then O should move in position 2

function getBlockForCornerAndSide(board) {
   var moveToTake = -1;
   
   if (findPattern(board,'X','*','','*','O','X','*','*','*'))
       moveToTake = 2;
   else if (findPattern(board,'','X','*','*','*','*','X','',''))
       moveToTake = 0;
   else if (findPattern(board,'*','*','*','X','*','*','','*','X'))
       moveToTake = 6;
   else if (findPattern(board,'*','*','X','*','*','*','*','X',''))
       moveToTake = 8;
   else if (findPattern(board,'','*','X','X','*','*','*','*','*'))
       moveToTake = -1;  //PUT THE CORRECT MOVE HERE
   else if (findPattern(board,'*','X','','*','*','*','*','*','X'))
       moveToTake = -1;  //PUT THE CORRECT MOVE HERE
   else if (findPattern(board,'*','*','*','*','*','X','X','*',''))
       moveToTake = -1;  //PUT THE CORRECT MOVE HERE
   else if (findPattern(board,'X','*','*','*','*','*','','X','*'))
       moveToTake = -1;  //PUT THE CORRECT MOVE HERE
   return moveToTake;
}

//if X has 2 sides around a corner, take the corner
//  _____________
//  |   |   |   |
//  |---|---|---|
//  | X | O |   |
//  |---|---|---|
//  | 6 | X |   |
//  -------------
// Then O should move in position 6

function getBlockForSides(board) {
   var moveToTake = -1;
   
   if (findPattern(board,'','X','*','X','*','*','*','*','*'))
       moveToTake = 0;
   else if (findPattern(board,'*','X','','*','*','X','*','*','*'))
       moveToTake = 2;
   else if (findPattern(board,'*','*','*','X','*','*','','X','*'))
       moveToTake = 6;
   else if (findPattern(board,'?','?','?','?','?','?','?','?','?')) //FIX THIS PATTERN
       moveToTake = 8;
   return moveToTake;
}

//getWinningMove returns a move that will win the game for the specified player (X or O)
//if no such move exists, then return -1
//There are 8 ways to win: 3 rows, 3 columns and 2 diagonals
function getWinningMove(board,player) {
   var move = -1;
   move = checkForThirdInARow(0,1,2,board,player); //check for win in top row
   if (move == -1)
      move = checkForThirdInARow(3,4,5,board,player); //check for win in second row
   if (move == -1)
      move = checkForThirdInARow(6,7,8,board,player); //check for win in third row
   if (move == -1)
      move = checkForThirdInARow(0,3,6,board,player); //check for win in first column
   if (move == -1)
      move = checkForThirdInARow(1,4,7,board,player); //check for win in second column
   if (move == -1)
      move = checkForThirdInARow(2,5,8,board,player); //check for win in third column
   if (move == -1)
      move = checkForThirdInARow(0,4,8,board,player); //check for win in first diagonal
   if (move == -1)
      move = checkForThirdInARow(2,4,6,board,player); //check for win in first diagonal
   return move;
}

//checkForThirdInARow takes three board positions, which should be a row, column or diagonal.
//If two of the three positions are by the specified player and the third position
//is blank, then a winning move would be to go in the blank space.
//If this is the case, checkForThirdInARow returns the number of the space that would
//result in a win. Otherwise, it returns -1
function checkForThirdInARow(first,second,third,board,player) {
   var winningMove = -1;
   if (board[first] == player &&
       board[second] == player &&
       board[third] == '')
       winningMove = third;
   else if (board[first] == player &&
            board[second] == '' &&
            board[third] == player)
       winningMove = second;
   else if (board[first] == '' &&
            board[second] == player &&
            board[third] == player)
       winningMove = first;
   return winningMove;
}

//findWin checks to see if there is a winner. If so, it returns an array of 9
//cells, with the winning triple filled in.
//If the game is a tie, it returns an array of 9 asterisks
//If the game is not over, it returns false
function findWin(board) {
	var winPattern;
	winPattern = winInRow(board);
	if (!winPattern)
		winPattern = winInColumn(board);
	if (!winPattern)
		winPattern = winDiagonal(board);
	if (!winPattern && countOpenSpaces(board) == 0) //if there are no open spaces, the game is a tie
	    winPattern = new Array('*','*','*','*','*','*','*','*','*');
	return winPattern;
}


//Check for wins
//Remember, the cells look like this:
//  _____________
//  | 0 | 1 | 2 |
//  |---|---|---|
//  | 3 | 4 | 5 |
//  |---|---|---|
//  | 6 | 7 | 8 |
//  -------------


//winInRow checks for a row win
//If there is a winning row, it returns an array with either X or O
//in the winning cells and blanks in the other cells
//For example, if O wins in the second row, it'll return ('','','',O,O,O,'','','')
//If there is no winner, it will return false
function winInRow(board) {
   if ((board[0] != '') && 
       (board[0] == board[1]) &&
       (board[0] == board[2])) //first row
       	return new Array(board[0],board[0],board[0],'','','','','','');
   else if ((board[3] != '') && 
            (board[3] == board[4]) &&
            (board[3] == board[5])) //second row
        return new Array('','','',board[3],board[3],board[3],'','','');
   else if ((board[6] != '') && 
            (board[6] == board[7]) &&
            (board[6] == board[8])) //third row
        return new Array('','','','','','',board[6],board[6],board[6]);
   else
    	return false;
}

//winInColumn checks for a column win
//If there is a winning column, it returns an array with either X or O
//in the winning cells and blanks in the other cells
function winInColumn(board) {
	if ((board[0] != '') && 
	    (board[0] == board[3]) &&
	    (board[0] == board[6])) //first column
        return new Array(board[0],'','',board[0],'','',board[0],'','');
	else if ((board[1] != '') && 
	         (board[1] == board[4]) &&
	         (board[1] == board[7])) //second column
	    return new Array('',board[1],'','',board[1],'','',board[1],'');
	else if ((board[2] != '') && 
	         (board[2] == board[5]) &&
	         (board[2] == board[8])) //third column
		return new Array('','',board[2],'','',board[2],'','',board[2]);
   else
        return false;
}

//winDiagonal checks for a diagonal win
//If there is a winning diagonal, it returns an array with either X or O
//in the winning cells and blanks in the other cells
function winDiagonal(board) {
	if ((board[0] != '') && 
	    (board[0] == board[4]) &&
	    (board[0] == board[8])) //top left to bottom right
		 return new Array(board[0],'','','',board[0],'','','',board[0]);
	else if ((board[2] != '') && 
	         (board[2] == board[4]) &&
	         (board[2] == board[6])) //top right to bottom left
		 return new Array('','',board[2],'',board[2],'',board[2],'','');
	else
	     return false;
}
      
function drawStats(){
    var b = document.playspace;
	var totalGames = xWon + oWon + tie;
    b.xWon.value = xWon;
    b.oWon.value = oWon;
    b.tie.value = tie;
	b.xWonPer.value = ((xWon==0)?0:(Math.round(xWon * 1000 / totalGames) / 10)) + '%';
    b.oWonPer.value = ((oWon==0)?0:(Math.round(oWon * 1000 / totalGames) / 10)) + '%';
    b.tiePer.value = ((tie==0)?0:(Math.round(tie * 1000 / totalGames) / 10)) + '%';
}

function clearStats(){
	xWon = 0;
    oWon = 0;
    tie = 0;
    drawStats();
}

function winningPlayer(winningPattern) {
   var winner = '';
   
   winningPattern.forEach(
      function(space) {
		if (space != '')
		     winner = space;
	})
	return winner;
}

//updateStats updates the statistics for winners
function updateStats(winningPattern) {
//Increment stats
    if (winningPattern) {
         winner = winningPlayer(winningPattern);
         if (winner == 'X')
              xWon = xWon+1;
         else if (winner == 'O')
              oWon = oWon+1;
         else if (winner == '*')
              tie = tie+1;
         drawStats();
    }     
}

//colorBoard sets the background color of the cells to indicate a win (or tie)
function colorBoard(board) {
    var winningPattern = findWin(board);
    if (winningPattern) {                           //If the board is a win or tie
       winningPattern.forEach(
          function(space,spacePosition) {
	          if (space == '')                      //space blank - not part of the 3 in a row
	             setSpaceColor(spacePosition,'green');  //   so color them green
	          else if (space == '*')                // * indicates a tie
	          	   setSpaceColor(spacePosition,'purple'); //  ties are colored purple
	          else                                  //This is part of the three in a row
	               setSpaceColor(spacePosition,'red'); //   so color it red
	      })
    }
}

//to start a newGame, clear the board and set the spaces to be green
function newGame() {
   spaces.forEach(
      function(space) {
         space.value = '';
         space.style.backgroundColor = 'green';
  })
}

//makeSpaces makes the array of spaces that represent the board
//
function makeSpaces() {
    var b = document.playspace;
    spaces = new Array(b.c0,b.c1,b.c2,b.c3,b.c4,b.c5,b.c6,b.c7,b.c8)
}

//getComputerStrategy looks at the menu to see which strategy was picked
function getComputerStrategy() {
    if (document.playspace.p2.selectedIndex == 0) 
         return "Random";
    else
         return "My Algorithm"
}

//setSpaceColor sets the numbered space to the specified color
function setSpaceColor(space,color) {
   spaces[space].style.backgroundColor = color; //set the background color of the space
}

