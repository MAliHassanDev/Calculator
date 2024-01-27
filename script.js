let checkExpression = (expression) =>{
    const regex2 = /([+\-*/]){2,}/g;
    let temptokens = expression.match(regex2) || [];
    if(temptokens.length===0){
        if(expression.indexOf('*')==0 || expression.indexOf('/')==0){
            return 'error';
        }else if(expression.indexOf('+')==0){
            expression=expression.substring(1);
            return expression;
        }else {
            return expression;
        }
    } else{
        return 'error';
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
        increaseInputFontSize();
    } else if(currentButtonContent==='÷'){
        currentExpression+='/';
    } else if(currentButtonContent==='−'){
        currentExpression+='-';
    } else if(currentButtonContent==='×'){
        currentExpression+='*';
    } else if(currentButtonContent==='DEL'){
        currentExpression=currentExpression.slice(0,-1);
        increaseInputFontSize();
       
    } else {
        currentExpression+=currentButtonContent;
    }

    calculatorDisplay.value = currentExpression;
}

function calculateCurrentExpression(){
    try{
        solution=calculate(currentExpression);
        increaseInputFontSize();
        
        if(solution===0){
            solution='';
            currentExpression = solution.toString();
            calculatorDisplay.value = currentExpression;
        } else if(solution===Infinity){
            currentExpression = '';
            calculatorDisplay.value = solution;
        } else{
            currentExpression = solution.toString();
            calculatorDisplay.value = currentExpression;
        }
        
    } catch(error){
        console.error('error');
        currentExpression='';
        solution='error';
        calculatorDisplay.value = solution;
    }
    
}

function calculate(expression) {
    let validExpression = checkExpression(expression);
    
    if(validExpression==='error'){
        throw new Error('error');
    }
    
    const regex = /(\d+(\.\d+)?)|(\.\d+)|([+*/-])/g;
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

    for(let i=0;i<operators.length;i++){
        if(operators[i]==='+'){
            result+=numbers[i+1]
        } else if(operators[i]==='-'){
            result-=numbers[i+1]
        }
    }

    return result;
}



let currentExpression='';
let solution = '';
let calculatorDisplay = document.getElementById('inputbar');
const originalInputFontSize = parseInt(window.getComputedStyle(calculatorDisplay).fontSize);
const minimumInputFontSize = 20;
let inputFontSize = parseInt(window.getComputedStyle(calculatorDisplay).fontSize);
const buttons = document.querySelectorAll('button');








// when user clicks on a button
buttons.forEach(button=>{
    button.addEventListener('click', ()=>{
        clickSound();
        if(button.textContent==='='){
            calculateCurrentExpression();
        }else{
            updateCurrentExpression(button.textContent);
            
        }
        decreaseInputFontSizeonOverflow(); 
    })
})