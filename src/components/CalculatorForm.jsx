import React, {useState} from "react";
import style from "../styles/calculatorStyle.module.css";

function CalculatorForm() {
    const [input, setInput] = useState("");
    const [resultDisplayed, setResultDisplayed] = useState(false);

    const handleNumberClick = (e) => {
        setInput(input + e.target.textContent);
    };

    const handleOperatorClick = (e) => {
        setInput(input + e.target.textContent);
    };

    const handleEqualClick = () => {
        try {
            const result = evaluateExpression(input);
            setInput(result.toString());
            setResultDisplayed(true);
        } catch (error) {
            setInput('Error: ' + error.message);
        }
    };

    const handleDeleteClick = () => {
        setInput(input.slice(0, -1));
    };

    const handleClearClick = () => {
        setInput("");
    };

    const evaluateExpression = (expression) => {
        expression = expression.replace(/\s+/g, '');
        const tokens = tokenize(expression);
        const result = evaluate(tokens);
        return result;
    };
    
    const tokenize = (expression) => {
        const regex = /([-+*/()])/;
        let tokens = expression.split(regex).filter(token => token.trim() !== '');
        tokens = handleNegativeNumbers(tokens);
        tokens = insertMultiplicationBeforeParentheses(tokens);
        return tokens;
    };
    
    const handleNegativeNumbers = (tokens) => {
        for (let i = 0; i < tokens.length; i++) {
            if (tokens[i] === '-' && (i === 0 || tokens[i - 1] === '(')) {
                tokens[i] = '-' + tokens[i + 1];
                tokens.splice(i + 1, 1);
            }
        }
        return tokens;
    };
    
    const insertMultiplicationBeforeParentheses = (tokens) => {
        for (let i = 0; i < tokens.length - 1; i++) {
            if (!isNaN(tokens[i]) && tokens[i + 1] === '(') {
                tokens.splice(i + 1, 0, '*');
            }
        }
        return tokens;
    };

    const evaluate = (tokens) => {
        const outputQueue = [];
        const operatorStack = [];
        const precedence = {
            '+': 1,
            '-': 1,
            '*': 2,
            '/': 2
        };

        tokens.forEach(token => {
            if (!isNaN(token)) {
                outputQueue.push(parseFloat(token));
            } else if (token === '(') {
                operatorStack.push(token);
            } else if (token === ')') {
                while (operatorStack.length > 0 && operatorStack[operatorStack.length - 1] !== '(') {
                    outputQueue.push(operatorStack.pop());
                }
                if (operatorStack.length === 0) {
                    throw new Error('Unmatched parentheses');
                }
                operatorStack.pop(); // Pop '('
            } else {
                while (operatorStack.length > 0 && precedence[operatorStack[operatorStack.length - 1]] >= precedence[token]) {
                    outputQueue.push(operatorStack.pop());
                }
                operatorStack.push(token);
            }
        });

        while (operatorStack.length > 0) {
            const op = operatorStack.pop();
            if (op === '(') {
                throw new Error('Unmatched parentheses');
            }
            outputQueue.push(op);
        }

        const stack = [];
        outputQueue.forEach(token => {
            if (!isNaN(token)) {
                stack.push(token);
            } else {
                const b = stack.pop();
                const a = stack.pop();
                if (token === '+') {
                    stack.push(a + b);
                } else if (token === '-') {
                    stack.push(a - b);
                } else if (token === '*') {
                    stack.push(a * b);
                } else if (token === '/') {
                    if (b === 0) {
                        throw new Error('Division by zero');
                    }
                    stack.push(a / b);
                }
            }
        });

        if (stack.length !== 1) {
            throw new Error('Invalid expression');
        }

        return stack[0];
    };

    return (
        <div className={style.calculator}>
            <div className={style.input} id="input">{input}</div>
            <div className={style.buttons}>
                <div className={style.operators}>
                    <div onClick={handleOperatorClick}>+</div>
                    <div onClick={handleOperatorClick}>-</div>
                    <div onClick={handleOperatorClick}>*</div>
                    <div onClick={handleOperatorClick}>/</div>
                </div>
                <div className={style.leftPanel}>
                    <div className={style.numbers}>
                        <div onClick={handleNumberClick}>7</div>
                        <div onClick={handleNumberClick}>8</div>
                        <div onClick={handleNumberClick}>9</div>
                        <div className={style.delete} onClick={handleDeleteClick}>DEL</div>
                    </div>
                    <div className={style.numbers}>
                        <div onClick={handleNumberClick}>4</div>
                        <div onClick={handleNumberClick}>5</div>
                        <div onClick={handleNumberClick}>6</div>
                        <div className={style.equal} id="result" onClick={handleEqualClick}>=</div>
                    </div>
                    <div className={style.numbers}>
                        <div onClick={handleNumberClick}>1</div>
                        <div onClick={handleNumberClick}>2</div>
                        <div onClick={handleNumberClick}>3</div>
                        <div className={style.clear} id="clear" onClick={handleClearClick}>C</div>
                    </div>
                    <div className={style.numbers}>
                        <div onClick={handleNumberClick}>0</div>
                        <div onClick={handleNumberClick}>.</div>
                        <div onClick={() => setInput(input + '(')}>(</div>
                        <div onClick={() => setInput(input + ')')}>)</div>
                    </div>
                </div>
                
            </div>
        </div>
    );
}

export default CalculatorForm;
