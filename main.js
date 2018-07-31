
var ACTIVECARDS = [];
var ALLHANDS = [];

function addClickerToHands(){
    for(var i=0;i<5;i++){
        var element = document.getElementsByClassName('hand'+i)[0];
        element.addEventListener('click',handClicked,false);
    }
}
addClickerToHands();

function handClicked(element){
    var handElement = element.currentTarget;
    
    var handNum = handElement.getAttribute('class');
    handNum = parseInt(handNum[4]);
    
    setActiveHand(handNum);
}

function setActiveHand(handNum){
    //deactivate the previous hand
    for(var i=0;i<ACTIVECARDS.length;i++){
        var currentEl = document.getElementById(ACTIVECARDS[i]);
        currentEl.classList.remove("active");
    }
    ACTIVECARDS = [];

    //activate and add to ACTIVECARDS
    for(var i=0;i<5;i++){
        var currentEl = document.getElementById(ALLHANDS[handNum][i]);
        currentEl.classList.add("active");
        ACTIVECARDS.push(ALLHANDS[handNum][i]);
    }
    console.log(translateHand(ALLHANDS[handNum][5]));
}

//Takes a specific card(faceString), and a type(Community Cards,hand1-5) and inserts it in the HTML
function insertCard(faceString,typeString){
    var faceStringSrc = 'faces/'+faceString+'.svg'
    var newCard = new Image(100,139); // original: 227,315
    newCard.src = faceStringSrc;
    newCard.id = faceString;

    var appropriateDiv = document.getElementsByClassName(typeString)[0];
    appropriateDiv.appendChild(newCard);
};

//Generates an array representing a sorted deck of cards
function generateDeck(){
    var cardArray = []
    for(var i=2;i<15;i++){
        for(var j=0;j<4;j++){
            cardArray.push(i+'_'+j);
        }
    }
    return cardArray;
}

//Takes a sorted deck ,shuffles it and returns it
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

//Takes an array of community cards and a two dimentional array of dealt hands and checks and returns the winner(s)
//UNFINISHED
function winningHands(community,hands){
    var counter = 0;
    hands.forEach(function(element) {
        var fullhand = element.concat(community);
        console.log('hand'+counter)
        var bestHand = handChecker(fullhand);
        ALLHANDS.push(bestHand);
        counter++;
    });
    console.log(ALLHANDS);
}

//Main funtction
function dealCards(){

    var shuffledDeck = shuffle(generateDeck());
    //Deling community cards
    var community = [];
    for(var i=0;i<5;i++){
        var popedCard = shuffledDeck.pop();
        community.push(popedCard);
        insertCard(popedCard,'community');
    }
    //Dealing hands
    var handCards = [[]];
    for(var i=0;i<5;i++){
        handCards[i] = [];
        for(j=0;j<2;j++){
            var popedCard = shuffledDeck.pop();
            handCards[i].push(popedCard);
            insertCard(popedCard,'hand'+i);
        }
    }
    //send the community and handCards variables further to check the winning hand/hands
    winningHands(community,handCards);
}

dealCards();
