import React, { useState, useCallback } from "react";
import style from "../styles/calculatorStyle.module.css";

function CalculatorForm() {
    const [input, setInput] = useState("");
    const [resultDisplayed, setResultDisplayed] = useState(false);
    const [error, setError] = useState(null);
    const [tokens, setTokens] = useState([]);

    const handleNumberClick = useCallback((e) => {
        setInput(input => input + e.target.textContent);
    }, []);

    const handleOperatorClick = useCallback((e) => {
        const lastChar = input[input.length - 1];
        setInput(input => (lastChar === '+' || lastChar === '-' || lastChar === '*' || lastChar === '/') ? input.slice(0, -1) + e.target.textContent : input + e.target.textContent);
    }, [input]);

    const handleEqualClick = useCallback(() => {
        try {
            const result = evaluateExpression(input);
            if (isNaN(result)) {
                throw new Error('Resultado inválido: ' + result);
            }
            setInput(result.toString());
            setResultDisplayed(true);
            setError(null);
            const tokens = tokenize(input);
            setTokens(tokens);
        } catch (error) {
            setInput('Error: ' + error.message);
            setError(error.message);
        }
    }, [input]);


    const handleDeleteClick = useCallback(() => {
        setInput(input.slice(0, -1));
    }, [input]);

    const handleClearClick = useCallback(() => {
        setInput("");
        setError(null);
    }, []);

    const evaluateExpression = useCallback((expression) => {
        expression = expression.replace(/\s+/g, '');
        const tokens = tokenize(expression);
        const result = evaluate(tokens);
        return result;
    }, []);

const tokenize = useCallback((expression) => {
    const regex = /([-+*/()])/;
    let tokens = expression.split(regex).filter(token => token.trim() !== '');

    for (let i = 0; i < tokens.length - 1; i++) {
        if (tokens[i] === '-' && (i === 0 || tokens[i - 1] === '(' || ['+', '-', '*', '/'].includes(tokens[i - 1]))) {
            tokens[i] += tokens[i + 1];
            tokens.splice(i + 1, 1);
        }
        if (!isNaN(tokens[i]) && tokens[i + 1] === '(') {
            tokens.splice(i + 1, 0, '*');
        }
        if (tokens[i] === ')' && !isNaN(tokens[i + 1])) {
            tokens.splice(i + 1, 0, '*');
        }
        if (tokens[i] === ')' && tokens[i + 1] === '(') {
            tokens.splice(i + 1, 0, '*');
        }
    }
    
        const detailedTokens = [];
    
        tokens.forEach((token, index) => {
            if (!isNaN(token)) {
                detailedTokens.push({ type: 'Number', value: token, position: index });
            } else if (token === '(') {
                detailedTokens.push({ type: 'ParenthesisOpen', value: token, position: index });
            } else if (token === ')') {
                detailedTokens.push({ type: 'ParenthesisClose', value: token, position: index });
            } else if (['+', '-', '*', '/'].includes(token)) {
                detailedTokens.push({ type: 'Operator', value: token, position: index });
            } else {
                throw new Error('Invalid token: ' + token);
            }
        });
    
        return detailedTokens;
    }, []);


    const handleNegativeNumbers = useCallback((tokens) => {
        for (let i = 0; i < tokens.length; i++) {
            if (tokens[i] === '-' && (i === 0 || tokens[i - 1] === '(')) {
                tokens[i] = '-' + tokens[i + 1];
                tokens.splice(i + 1, 1);
            }
        }
        return tokens;
    }, []);

    const insertMultiplicationBeforeParentheses = useCallback((tokens) => {
        for (let i = 0; i < tokens.length - 1; i++) {
            if (!isNaN(tokens[i]) && tokens[i + 1] === '(') {
                tokens.splice(i + 1, 0, '*');
            }
        }
        return tokens;
    }, []);

    const evaluate = useCallback((detailedTokens) => {
        const outputQueue = [];
        const operatorStack = [];
        const precedence = {
            '+': 1,
            '-': 1,
            '*': 2,
            '/': 2
        };

        detailedTokens.forEach(token => {
            if (token.type === 'Number') {
                outputQueue.push(parseFloat(token.value));
            } else if (token.type === 'ParenthesisOpen') {
                operatorStack.push(token.value);
            } else if (token.type === 'ParenthesisClose') {
                while (operatorStack.length > 0 && operatorStack[operatorStack.length - 1] !== '(') {
                    outputQueue.push(operatorStack.pop());
                }
                if (operatorStack.length === 0) {
                    throw new Error('Unmatched parentheses');
                }
                operatorStack.pop();
            } else if (token.type === 'Operator') {
                while (operatorStack.length > 0 && precedence[operatorStack[operatorStack.length - 1]] >= precedence[token.value]) {
                    outputQueue.push(operatorStack.pop());
                }
                operatorStack.push(token.value);
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
    }, []);

    return (
        <div className={style.container}>
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
            <div className={style.tokens} id="tokens">
                <h1>Analizador Léxico</h1>
                {tokens.map((token, index) => (
                    <div key={index}>
                        Linea 1 - Data type: {token.type}, Value: "{token.value}", Position: {token.position}
                    </div>
                ))}
            </div>
            <div className={style.arbol}>
                <h1></h1>
            </div>
        </div>
    );
}

export default CalculatorForm;