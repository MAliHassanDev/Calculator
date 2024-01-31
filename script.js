let checkExpression = (expression) =>{
    const expressionLength = expression.length;
    const regex2 = /([+\*/]){2,}|(-){2,}|(\.\.)|([+-]{2,})|(\-\*)|(\-\/)|(\.\d+\.(\d+)?)/g;
    let expressionArray = [];
    let temptokens = expression.match(regex2) || [];
    if(temptokens.length===0){
        if(expression.length===1 && isNaN(expression.charAt(0))){
            expression = '0';
            return expression;
        }
        expressionArray = [...expression];
        for(let i=expressionArray.length-1;i>=0;i--){
            if(i==0 || i==(expressionArray.length-1)){
                if(expression[i]==='/' || expression[i]=='*'){
                    if(i==0){
                        throw new Error('Syntax Error');
                    }
                } 
                if(isNaN(expressionArray[i]) && expression[i]!='-' && expression[i]!='.'){
                    expressionArray.splice(i,1);
                    i--;
                }
            }
        }

        expression = expressionArray.join('');
        return expression;
    } else{
        throw new Error('Syntax Eror');
    }
}

function clickSound(){
    const tickSound = new Audio();
    tickSound.src = "audio/tick-sound5.mp3";
    tickSound.play();
}

function decreaseInputFontSizeonOverflow(){
    while(calculatorDisplay.scrollWidth > calculatorDisplay.clientWidth && inputFontSize > minimumInputFontSize){
        inputFontSize--;
        calculatorDisplay.style.fontSize = inputFontSize + 'px';
    }
}
function increaseInputFontSize(){
    while(inputFontSize < originalInputFontSize){
        inputFontSize++;
        calculatorDisplay.style.fontSize = inputFontSize + 'px';
    }
}
function updateCurrentExpression(currentButtonContent){
    if(currentButtonContent==='AC'){
        currentExpression='';
        currentButtonContent = currentExpression;
        calculatorDisplay.value = currentButtonContent;
        increaseInputFontSize();
    } else if(currentButtonContent==='÷'){
        currentExpression+='/';
    } else if(currentButtonContent==='−'){
        currentExpression+='-';
    } else if(currentButtonContent==='×'){
        currentExpression+='*';
    } else if(currentButtonContent==='DEL'){
        currentExpression=currentExpression.slice(0,-1);
        currentButtonContent='';
        calculatorDisplay.value = calculatorDisplay.value.slice(0,-1);
        increaseInputFontSize();
    } else if(currentButtonContent==='+/-'){
        if(currentExpression.length!=0){
            currentExpression = '-' + currentExpression;
            currentButtonContent = '';
            calculatorDisplay.value= '-' + calculatorDisplay.value;
        } else{
            currentExpression='';
        }
        
    }else {
        currentExpression+=currentButtonContent;
    }

    calculatorDisplay.value+=currentButtonContent;
}

function limitToThreeDecimal(number){
    if(number>=1){
        number = Math.round(number*1000)/1000;
    } else{
        console.log(number);
        number = Math.round(number*10000000)/10000000;
    }
    return number;
}

function calculateCurrentExpression(){
    try{
        solution=calculate(currentExpression);
        increaseInputFontSize();
        console.log(solution);
        if(isNaN(solution)){
            solution='';
            currentExpression = solution;
            calculatorDisplay.value = currentExpression;
        } else if(solution===0){
            solution='';
            currentExpression = solution;
            calculatorDisplay.value = currentExpression;
        } else if(solution===Infinity){
            currentExpression = '';
            calculatorDisplay.value = solution.toString();
        } else{
            let solutionInFloat = parseFloat(solution);
            if(solutionInFloat%1 !== 0){
                solutionInFloat = limitToThreeDecimal(solutionInFloat);
            }
            solution = solutionInFloat;
            currentExpression = solution.toString();
            calculatorDisplay.value = currentExpression;
        }
        
    } catch(error){
        console.error('error',error.message);
        currentExpression='';
        solution='Syntax Error';
        calculatorDisplay.value = solution;
    }
    
}

function calculate(expression)  {
    let validExpression = '';
    try{
         validExpression = checkExpression(expression);
    } catch(error){
        throw error;
    }
    
    
    
    const regex = /(\d+(\.\d+)?)|((-\d+(\.\d+)?)|(-\.(\d+)?))|(\.\d+)|([+*/])/g;
    let tokens = validExpression.match(regex) || [];
    const numbers = [];
    const operators = [];
    for (let i = 0; i < tokens.length; i++){
        let token = tokens[i];
        if (!isNaN(token)) {
            numbers.push(parseFloat((token)));
        } else {
            operators.push(token);
        }
    }

    if(operators.length==numbers.length){
        throw new Error('Operators Length')
    }

    for(let i=0;i < operators.length; i++){
        if(operators[i]==='*' || operators[i]=='/'){
            let num1 = numbers[i]
            let num2 = numbers[i+1]
            if(operators[i]==='*'){
                numbers[i] = num1*num2;
            }else if(operators[i]==='/'){
                numbers[i] = num1/num2;
            }
    
            numbers.splice(i+1,1);
            operators.splice(i,1)
            i--;
        }
    }
    let result = numbers[0];

    for(let i=1;i<numbers.length;i++){
       result+=numbers[i];
    }
    return result; 
    
}

let currentExpression='';
let solution = '';
let calculatorDisplay = document.getElementById('inputbar');
const originalInputFontSize = parseInt(window.getComputedStyle(calculatorDisplay).fontSize);
const minimumInputFontSize = 25;
let inputFontSize = parseInt(window.getComputedStyle(calculatorDisplay).fontSize);
const buttons = document.querySelectorAll('button');
const lightmode = document.querySelector(".light-mode");
let mainBody = document.querySelector('.main-section');
// when uder clicks on light mode button

lightmode.addEventListener('click', function(){
    mainBody.classList.toggle('lightMode');
})
// when user clicks on a button
buttons.forEach(button=>{
    button.addEventListener('click', ()=>{
        clickSound();
        if(button.textContent==='='){
            calculateCurrentExpression();
        }else{
            let buttonContent = button.textContent;
            updateCurrentExpression(buttonContent);
            
        }
        decreaseInputFontSizeonOverflow(); 
    })
})