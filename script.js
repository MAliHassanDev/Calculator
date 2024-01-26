function calculate(expression) {
    const regex = /(\d+(\.\d+)?)|(\.\d+)|([+*/-])/g;
    const tokens = expression.match(regex) || [];
    if(tokens.length===0){
        throw new Error('Error');
    }

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
        console.log(i);
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
        console.log('Addition');
        console.log(`Result: ${result}`);
        if(numbers.length <= 1){
            result = operators + numbers;
        } else if(operators[i]==='+'){
            result+=numbers[i+1]
        } else if(operators[i]==='-'){
            result-=numbers[i+1]
        }
    }

    return result;
}

try {
    let calculations = '5-6';
    let solution = calculate(calculations);
    console.log(solution);
} catch(error){
    console.error(error.message);
}

let calculations='';
let solution = '';
let calculatorDisplay = document.getElementById('inputbar');
// tick sound
const tickSound = new Audio();
tickSound.src = "audio/tick-sound5.mp3";

const buttons = document.querySelectorAll('button');
buttons.forEach(button=>{
    button.addEventListener('click', function(){
        tickSound.play();
        if(button.textContent==='='){
            try{
                solution=calculate(calculations);
                if(solution===0){
                    solution='';
                    calculations = solution.toString();
                } else{
                    calculations = solution.toString();
                }
                
            } catch(error){
                console.error('error');
                calculations='';
            }
            
        } else if(button.textContent==='AC'){
            calculations='';
        } else if(button.textContent==='÷'){
            calculations+='/';
        } else if(button.textContent==='−'){
            calculations+='-';
        } else if(button.textContent==='×'){
            calculations+='*';
        } else if(button.textContent==='DEL'){
            calculations=calculations.slice(0,-1);
        } else if(button.textContent==='00'){
            calculations+='0';
        } else {
            calculations+=button.textContent;
        }

        calculatorDisplay.value = calculations;
        
        console.log(calculations);
    })
})