


function translateHand(scoreInt){
	var handArray = ['highCard' ,'pair' ,'two pairs' ,'three of a kind' ,'Straight','Flush' ,'Full House' ,'Four of a kind','straight flush','royal flush']
	return handArray[scoreInt];
}

//function that takes an array of 7 cards and returns an array of the 5 best cards + score int 
//ex:['3_0','3_3','6_2','6_0','6_3',6] 6=full house
function handChecker(cardArray){
	//DONE! (more or less)
	var potentialScoreArray = [0];

	var flushFound = findFlush(cardArray);
	var straightFound = findStraight(cardArray);
	
	if(flushFound){
		potentialScoreArray.push(5);
	
	}
	if(straightFound){
		potentialScoreArray.push(4);
	}

	//STRAIGHT FLUSH and ROYAL FLUSH IS NOT IMPLEMENTED YET!!!!!!!!!!
	if(straightFound && flushFound){
		if(straightFound.toString() == flushFound.toString()){
			potentialScoreArray.push(8);
			potentialScoreArray.push(9);
		}
	}

	var pairsFound = findPairs(cardArray);
	if(pairsFound.length<7){
		if(pairsFound.length<6){			
			if(pairsFound.length<5){				
				if(pairsFound.length<4){
					//Four of a kind
					potentialScoreArray.push(7);
				}
				else{
					//Full house or three of a kind, or three pairs(?) [[1,1,1],[2,2],[3,3]],[[1,1],[2,2],[3,3],[4]]
					if(checkFullHouse(pairsFound)){
						potentialScoreArray.push(6);
					}
					else{
						potentialScoreArray.push(3);
					}		
				}
			}
			else{
				if(checkThreeOfAKind(pairsFound)){
					potentialScoreArray.push(3);
				}
				else{
					potentialScoreArray.push(2);	
				}
			}
		}
		else{
			//One pair
			potentialScoreArray.push(1);
		}
	}

	potentialScoreArray.sort(sortNumber);
	var potBestHand = potentialScoreArray[potentialScoreArray.length-1];
	//console.log(potBestHand);

	var origArray = [];
	cardArray.forEach(function(element){
		origArray.push(getValue(element));
	});

	//TESTING
	var pairsHand = getPairsIndex(pairsFound,origArray);

	var bestHandArray = [];
	if(potBestHand == 0 || potBestHand == 1 || potBestHand == 2 || potBestHand == 3 || potBestHand == 6 || potBestHand == 7){
		//return pairhand
		for(var i=0;i<5;i++){
			bestHandArray.push(cardArray[pairsHand[i]]);
		}
		//console.log(bestHandArray);
	}
	else{
		if(flushFound){
			for(var i=0;i<5;i++){
				bestHandArray.push(cardArray[flushFound[i]]);
			}
			//console.log(bestHandArray);
		}
		else{

			for(var i=0;i<5;i++){
				bestHandArray.push(cardArray[straightFound[i]]);
			}
			//console.log(bestHandArray);
		}
		//return flash/straight hand
	}

	bestHandArray.push(potBestHand);
	console.log(bestHandArray+'');
	console.log("------------------------------------------------");
	return bestHandArray;


};
//Function should turn potential 7-card (['2_0','3_3'.....) hand into a 5-card hand
//Function that returns an object containing score=highest score and highcard=highest card, hand=array of the five cards
//0=highCard 1=pair 2=two pairs 3=three of a kind 4=Straight 5=Flush 6=Full House 7=Four of a kind 8=straight flush 9=royal flush
//the input is an array representing the potentials
//TODO
function scoreHand(hand,potential){
	if(hand.length>5){
		//Do something?
	}
	else{

	}
}

//TODO
function compareHands(hand1,hand2){
	if(hand1.score>hand2.score){
		//hand1 wins, find the 5 best cards
	}
	else if(hand1.score==hand2.score){
		//complicated stuff
	}
	else{
		//hand2 wins
	}
}

//Function that checks if a potential han contains a full house
function checkFullHouse(array){
	for(var i=0;i<array.length;i++){
		if(array[i].length === 3){
			return true
		}
	}
	return false
}

function checkThreeOfAKind(array){
	for(var i=0;i<array.length;i++){
		if(array[i].length === 3){
			return true
		}
	}
	return false	
}

//function that finds the pairs(and trips and fours) and full house
//returns a sorted array of arrays, ex:[[2,2],[3,3],[4],[5],[13]] or [[2,2,2],[3,3],[4],[13]],
function findPairs(cardArray){

	//originalArray maintaines the same indexes and copies as cardArray, but with only the value of the cards
	var originalArray = [];

	//Making the array

	cardArray.forEach(function(element){
		var value = getValue(element);
		originalArray.push(value);
	});

	
	//Occurance Object of the pairs
	var occurance = getOccuranceObject(originalArray);
	//Pairarray is an array of arrays that keeps track of all the equal cards
	var pairArray = [];
	var counter = 0
	for(var key in occurance){
		pairArray.push([]);
		for(var i=0;i<occurance[key];i++){
			pairArray[counter].push(parseInt(key));
		}
		counter++;
	}
	//Should return an array of indexes
	//var indexes = getPairsIndex(pairArray,originalArray);

	return pairArray;

}

//This function get an array of arrays of pairs, totaling 7 elements
//It takes the most frequent (three/four of a kind first)
//Returns an array of indexes
function getPairsIndex(pairsArray,originalArray){
	//Sorting the pairsarray by the longest array in the 2nd dimention last
	pairsArray.sort(sortLengthReverse);

	//Flattening the pairarray
	var flattened = flatten2dArray(pairsArray);

	//Make array of the 5 most valueble values
	var bestValHand = flattened.slice(flattened.length-5);
	
	//Now we find the indexes
	var indexArray = [];
	var index;
	//console.log(bestValHand);
	//console.log(originalArray);
	for(var i=0;i<5;i++){
		index = originalArray.indexOf(bestValHand[i]);
		indexArray.push(index);
		originalArray[index]=0;	
	}

	return indexArray;
}

function flatten2dArray(array){
	var returnArray = [];
	for(var i=0;i<array.length;i++){
		for(var j=0;j<array[i].length;j++){
			returnArray.push(array[i][j]);
		}
	}
	return returnArray;
}

//Finds straight in a hand of 7 cards, returns either false or array of indexes of cards
function findStraight(cardArray){
	//valueArray contains the sorted and unique values
	var valueArray = [];
	//originalArray maintaines the same indexes and copies as cardArray, but with only the value of the cards
	var originalArray = [];

	//Making the two arrays
	cardArray.forEach(function(element){
		var value = getValue(element);
		originalArray.push(value);
		if(!valueArray.includes(value)){
			if(value == 14){
				valueArray.push(value);
				valueArray.push(1);
			}
			else{valueArray.push(value)};
		};
	});

	valueArray.sort(sortNumber);

	var straightBool = false;
	var lowest;
	for(var i=0;i<valueArray.length-2;i++){
		var currentNum = valueArray[i];
		//since straight is coonsecutive numbers
		var subset = [currentNum,currentNum+1,currentNum+2,currentNum+3,currentNum+4];
		//Checks if subset var is a subset of valueArray
		var subsetBool = subset.every(function(val) { return valueArray.indexOf(val) >= 0; });
		if(subsetBool){
			straightBool = true;
			lowest = currentNum;
		}
	}
	if(straightBool){
		var indexes = getStraightIndex(lowest,originalArray);
		//console.log('Straight');
		return indexes;
	}
	else{return false}
}

//When the highest straight is determined, this function makes an array of the indexes of the cards in the array
function getStraightIndex(lowest,originalArray){
	indexArray = [];
	for(var i=lowest;i<=lowest+5;i++){
		var value = i;

		//If ace is the lowest card
		if(i==1){
			value = 14;
		}
		if(originalArray.indexOf(value)>-1){
			indexArray.push(originalArray.indexOf(value));
			if(indexArray.length>5){
				indexArray.splice(0, 1);
			}
		}
	}
	return indexArray;
}

function sortNumber(a,b) {
	return a - b;
}
function sortNumberReverse(a,b) {
	return b - a; 
}
function sortLengthReverse(a,b){
	return a.length-b.length;
}

//Cheks a hand for flush from card array ['11_3','14_0',....]
//Returns an array of the indexes for the flush
function findFlush(cardArray){
	var suitArray = [];
	cardArray.forEach(function(element){
		var suit = getSuit(element);
		suitArray.push(suit);
	});
	var flushBool = false;
	var indexes = [];
	var occurance = getOccuranceObject(suitArray);

	suitArray.forEach(function(suit){
		if(occurance[suit]>=5){
			//console.log("FLUSH");
			indexes = getFlushIndex(suit,suitArray);
			flushBool = true;
		}
	});
	if(flushBool){
		return indexes
	}
	else{return flushBool}
}

//Return the indexes of cards in a hand with flush
//BUG: The hand should return the flush with the highest value cards
//	Just got flush with [3,10,8,14,5], but there was also a king(13) so it should have been [13,10,8,14,5]
function getFlushIndex(suit,suitArray){

	indexArray = [];
	for(var i=0;i<7;i++){
		if(suitArray[i]==suit){
			indexArray.push(i);
		}
	}
	return indexArray;
}

//Returns an object of how many times each value appears
//obj = {1:2,2:3.....}
function getOccuranceObject(array){
	occuranceObj = {};
	array.forEach(function(element){
		occuranceObj[element] = (occuranceObj[element] || 0) +1;
	});
	return occuranceObj;
}

//returns int representing the value(1-14) given a cardString ex: '12_0'
function getValue(cardString){
	return parseInt(cardString.split('_')[0]);
}


//returns int representing the suit(0-3) given a cardString ex: '12_0'
//0=Clubs, 1=Spades, 2=Hearts, 3=Diamonds
function getSuit(cardString){
	return parseInt(cardString.split('_')[1]);
}


function getTheRest(restArray){

}

/*
What to retun?

1. Object with cheklist high-card= '14_0' one-pair=true, two-pair=false.., and an array of the 5 cards

2. Two-dimentional array with "score" (f.ex 1-9),high-card (1-14), and array of the 5 cards

*/
