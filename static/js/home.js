function age(){
    var birthday = prompt("What is your birth date?");
    var ageindays = (2018 - birthday)*364;
    var h1 = document.createElement('h1')
    var textAnswer = document.createTextNode("You are " + ageindays + " days old")
    h1.setAttribute('id','age')
    h1.appendChild(textAnswer);
    document.getElementById("flex-box-result").appendChild(h1);
}

function reset(){
    document.getElementById("age").remove()
}

function dogGenerator(){
    var image = document.createElement('img')
    var div = document.getElementById("dogpic")
    image.src = "https://thecatapi.com/api/images/get?format=src&type=gif&size=small"
    div.appendChild(image)
}
function rpsGame(yourChoice){

    console.log(yourChoice.id)
    var humanChoice , botChoice;

    humanChoice = yourChoice.id;
    botChoice = numberToChoose(rpsRandomInt());
    console.log("Computer choice" , botChoice)

    result = decideWinner(humanChoice,botChoice);
    message = finalMessage(result)

    rpsfrontend(yourChoice.id, botChoice, message)

    console.log(message)
    console.log(result)
}
function rpsRandomInt(){
    return Math.floor(Math.random()*3);
}

function numberToChoose(number){
    return ['rock','paper','scissor'][number];
}

function decideWinner(yourChoice,computerChoice){
    var rpsDatabase = {
        'rock': {'scissor':1, 'rock':0.5, 'paper':0},
        'paper':{'rock':1, 'paper':0.5, 'scissor':0},
        'scissor':{'rock':0, 'paper':1, 'scissor':0.5}
    }
    var yourScore = rpsDatabase[yourChoice][computerChoice]
    var computerScore = rpsDatabase[computerChoice][yourChoice]

    return [yourScore, computerScore];
}

function finalMessage([yourScore,computerScore]){
    if(yourScore === 0){
        return {'message':'You lost' , 'color': 'red'};
    }
    else if(yourScore === 0.5){
        return{'message':'You tied' , 'color':'yellow'};
    }
    else{
        return {'message':'You won', 'color':'green'};
    }
}

function rpsfrontend(humanImageChoice, botImageChoice, finalMessage){
    var imageDataBase = {
        'rock': document.getElementById('rock').src,
        'paper': document.getElementById('paper').src,
        'scissor': document.getElementById('scissor').src
    }

    document.getElementById('rock').remove();
    document.getElementById('paper').remove();
    document.getElementById('scissor').remove();

    var humandiv = document.createElement('div');
    var botdiv = document.createElement('div');
    var messagediv = document.createElement('div');

    humandiv.innerHTML = "<img src='" + imageDataBase[humanImageChoice] + "'height = 150 width = 150 style = 'box-shadow: 0 10px 50px rgba(37, 50, 233, 1);'>"
    botdiv.innerHTML = "<img src='" + imageDataBase[botImageChoice] + "'height = 150 width = 150 style = 'box-shadow: 0 10px 50px red;'>"
    messagediv.innerHTML = "<h1 style='color: " + finalMessage['color']+";font-size: 60px; padding: 30px;'>" + finalMessage['message'] + "</h1>"

    document.getElementById('flex-box-rps-div').appendChild(humandiv);
    document.getElementById('flex-box-rps-div').appendChild(messagediv);
    document.getElementById('flex-box-rps-div').appendChild(botdiv);
}

var allButoms = document.getElementsByTagName('button')
console.log(allButoms)

let copyAllbutton = []
for(let i = 0 ;i< allButoms.length; i++){
    copyAllbutton.push(allButoms[i].classList[1]);
}

// console.log(copyAllbutton)
function buttonColorChange(buttonThing){
    if(buttonThing.value === 'red') {
        buttonRed();
    }
    else if(buttonThing.value === 'green') {
        buttonGreen();
    }
    else if(buttonThing.value === 'reset') {
        buttonColorReset();
    }
    else if(buttonThing.value === 'random') {
        randomColor();
    }
    
}

function buttonRed(){
    for(let i = 0; i< allButoms.length; i++) {
        allButoms[i].classList.remove(allButoms[i].classList[1])
        allButoms[i].classList.add('btn-danger');
    }
}

function buttonGreen(){
    for(let i = 0; i< allButoms.length; i++) {
        allButoms[i].classList.remove(allButoms[i].classList[1]);
        allButoms[i].classList.add('btn-success');
    }
}
function buttonColorReset(){
    for(let i = 0; i< allButoms.length; i++) {
        allButoms[i].classList.remove(allButoms[i].classList[1]);
        allButoms[i].classList.add(copyAllbutton[i]);
    }
}

function randomColor(){
    let choice = ['btn-primary' , 'btn-success' , 'btn-danger' , 'btn-warning']

    for(let i = 0; i< allButoms.length ; i++) {
        let randNumber = Math.floor(Math.random()*4);
        allButoms[i].classList.remove(allButoms[i].classList[1]);
        allButoms[i].classList.add(choice[randNumber]);
        console.log(randNumber)
    }
}

let blackjackGame = {
    'you' : {'scoreSpan':'#your-blackjack-result', 'div':'#your-box', 'score':0},
    'dealer':{'scoreSpan': '#dealer-blackjack-result', 'div':'#dealer-box', 'score':0},
    'cards' : ['2','3','4','5','6','7','8','9','10','K','Q','J','A'],
    'cardsMap' : {'2':2,'3':3,'4':4,'5':5,'6':6,'7':7,'8':8,'9':9,'10':10,'K':10,'Q':10,'J':10,'A':[1,11]},
    'wins': 0,
    'losses': 0,
    'draws': 0,
    'isStand':false,
    'turnsOver':false

}


const YOU = blackjackGame['you']
const DEALER = blackjackGame['dealer']

document.querySelector('#blackjack-hit-button').addEventListener('click', blackjackhit);
document.querySelector('#blackjack-stand-button').addEventListener('click', dealerLogic);
document.querySelector('#blackjack-deal-button').addEventListener('click', blackjackDeal);


let hitSound = new Audio('static/sounds/swish.m4a')
let winSound = new Audio('static/sounds/cash.mp3')
let lossSound = new Audio('static/sounds/aww.mp3')

function blackjackhit(){
    if(blackjackGame['isStand'] === false){
        let card = randomCard();
        console.log(card)
        showCard(YOU, card);
        updateScore(card , YOU);
        console.log(YOU['score']);
        showContent(YOU);
    }
}

function sleep(ms){
    return new Promise(resolve => setTimeout(resolve , ms));
}

async function dealerLogic(){
    blackjackGame['isStand'] = true;

    while(DEALER['score'] < 16 && blackjackGame['isStand'] === true){
        let card = randomCard();
        console.log(card)
        showCard(DEALER, card);
        updateScore(card , DEALER);
        console.log(DEALER['score']);
        showContent(DEALER);
        await sleep(1000);
    }
    
    blackjackGame['turnsOver'] = true;
    let winner = computeResult();
    showResult(winner);
    console.log(blackjackGame['turnsOver'])
    
}

function randomCard(){
    let randomIndex = Math.floor(Math.random() * 13);
    // console.log(blackjackGame['cards'][randomIndex])
    return blackjackGame['cards'][randomIndex];
}


function showCard(activeUser,card){
    if(activeUser['score'] <= 21){
        let cardImage = document.createElement('img');
        cardImage.src = `static/images/${card}.png`;
        document.querySelector(activeUser['div']).appendChild(cardImage);
        hitSound.play();
    }
}

function blackjackDeal(){
    if(blackjackGame['turnsOver'] === true){
        blackjackGame['isStand'] = false;
        let yourImages = document.querySelector('#your-box').querySelectorAll('img');
        let dealerImages = document.querySelector('#dealer-box').querySelectorAll('img');

        console.log(yourImages);
        for(let i = 0; i< yourImages.length ; i++){
            yourImages[i ].remove();
        }
        for(let i = 0; i< dealerImages.length ; i++){
            dealerImages[i ].remove();
        }
        YOU['score'] = 0;
        DEALER['score'] = 0;

        // let restart = "Let's play again"

        document.querySelector(YOU['scoreSpan']).textContent = 0;
        document.querySelector(YOU['scoreSpan']).style.color = 'white';

        document.querySelector(DEALER['scoreSpan']).textContent = 0;
        document.querySelector(DEALER['scoreSpan']).style.color = 'white';

        document.querySelector('#blackjack-result').textContent = "Let's play again !";
        document.querySelector('#blackjack-result').style.color = 'black';

        blackjackGame['turnsOver'] = false ;
    }
}

function updateScore(card , activeUser){
    if(card === 'A'){
        if(activeUser['score'] + blackjackGame['cardsMap'][card][1] <= 21){
            activeUser['score'] += blackjackGame['cardsMap'][card][1]
        }else{
            activeUser['score'] += blackjackGame['cardsMap'][card][0]
        }
    }else{
        activeUser['score'] += blackjackGame['cardsMap'][card];
    }
}

function showContent(activeUser){
    if(activeUser['score'] > 21){
        document.querySelector(activeUser['scoreSpan']).textContent = 'BUST';
        document.querySelector(activeUser['scoreSpan']).style.color = 'red';
    }else{
        document.querySelector(activeUser['scoreSpan']).textContent = activeUser['score'];
    }
}

function computeResult(){
    let winner;

    if(YOU['score'] <= 21){
        if(YOU['score'] > DEALER['score'] || DEALER['score'] > 21){
            blackjackGame['wins']++;
            console.log("You win")
            winner = YOU;
        }else if(YOU['score']< DEALER['score']){
            blackjackGame['losses']++;
            console.log("You lose")
            winner = DEALER;
        }else if(YOU['score'] === DEALER['score']){
            blackjackGame['draws']++;
            console.log("Is's a draw")
        }
    }else if(YOU['score'] > 21 && DEALER['score'] <= 21){
        blackjackGame['losses']++;
        console.log("You lost")
        winner = DEALER
    }else if(YOU['score']>21 && DEALER['score']>21){
        blackjackGame['draws']++;
        console.log("It's a draw")
    }

    console.log(blackjackGame); 
    return winner;
}

function showResult(winner){
    let message, messageColor;
    if(blackjackGame['turnsOver'] === true){
        if(winner === YOU){
            document.querySelector('#wins').textContent = blackjackGame['wins'];
            message = "You won!";
            messageColor = "green";
            winSound.play();  
        }else if(winner === DEALER){
            document.querySelector('#losses').textContent = blackjackGame['losses'];
            message = "You Lost!";
            messageColor = "Red";
            lossSound.play();  
        }else{
            document.querySelector('#draws').textContent = blackjackGame['draws'];
            message = "You Drew!";
            messageColor = "black";
            
        }
    }
    document.querySelector("#blackjack-result").textContent = message;
    document.querySelector("#blackjack-result").style.color = messageColor;
}


 





