import React, { useState } from 'react';
import style from "../styles/calculatorStyle.module.css";

function CalculatorForm() {
    const [input, setInput] = useState("");
    const [resultDisplayed, setResultDisplayed] = useState(false);

    const handleNumberClick = (e) => {
        let currentString = input;
        let lastChar = currentString[currentString.length - 1];

        if (!resultDisplayed) {
            setInput(currentString + e.target.textContent);
        } else if (resultDisplayed && (lastChar === "+" || lastChar === "-" || lastChar === "*" || lastChar === "/")) {
            setResultDisplayed(false);
            setInput(currentString + e.target.textContent);
        } else {
            setResultDisplayed(false);
            setInput(e.target.textContent);
        }
    };

    const handleOperatorClick = (e) => {
        let currentString = input;
        let lastChar = currentString[currentString.length - 1];

        if (lastChar === "+" || lastChar === "-" || lastChar === "*" || lastChar === "/") {
            let newString = currentString.substring(0, currentString.length - 1) + e.target.textContent;
            setInput(newString);
        } else if (currentString.length === 0) {
            console.log("Enter a number first");
        } else {
            setInput(currentString + e.target.textContent);
        }
    };

    const handleParenthesisClick = (parenthesis) => {
        setInput(input + parenthesis);
    };

    const handleEqualClick = () => {
        let result;
        try {
            result = evaluateExpression(input);
        } catch (error) {
            result = "Error";
            console.error("Error evaluating expression:", error);
        }
        setInput(result.toString());
        setResultDisplayed(true);
    };

    const handleClearClick = () => {
        setInput("");
    };

    function tokenize(inputString) {
        return inputString.split(/(\+|\-|\*|\/|\(|\))/).map(token => token.trim());
    }

    function parse(tokens) {
        let currentNode = { type: 'expression', value: '' };
        let rootNode = currentNode;
        let stack = [];

        for (let i = 0; i < tokens.length; i++) {
            let token = tokens[i];

            if (token === '+' || token === '-' || token === '*' || token === '/') {
                currentNode.operator = token;
                currentNode.right = { type: 'expression', value: '' };
                currentNode = currentNode.right;
            } else if (token === '(') {
                stack.push(currentNode);
                currentNode = { type: 'expression', value: '' };
            } else if (token === ')') {
                let topNode = stack.pop();
                topNode.right = currentNode;
                currentNode = topNode;
            } else {
                currentNode.value = token;

                if (currentNode.parent && currentNode.parent.right) {
                    currentNode = currentNode.parent.right;
                } else if (i < tokens.length - 1) {
                    currentNode.parent = { left: rootNode, operator: currentNode.operator };
                    currentNode = currentNode.parent;
                    rootNode = currentNode;
                }
            }
        }

        return rootNode;
    }

    function evaluate(node) {
        if (!node) return 0;

        if (!node.left && !node.right) {
            return parseFloat(node.value);
        }

        let leftValue = evaluate(node.left);
        let rightValue = evaluate(node.right);

        switch (node.operator) {
            case '+':
                return leftValue + rightValue;
            case '-':
                return leftValue - rightValue;
            case '*':
                return leftValue * rightValue;
            case '/':
                if (rightValue === 0) {
                    throw new Error("Division by zero");
                }
                return leftValue / rightValue;
            default:
                return 0;
        }
    }

    function evaluateExpression(inputString) {
        let tokens = tokenize(inputString);
        let rootNode = parse(tokens);
        let result = evaluate(rootNode);
        return result;
    }

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
                        <div onClick={() => handleParenthesisClick('(')}>(</div>
                        <div onClick={() => handleParenthesisClick(')')}>)</div>
                    </div>
                </div>
                
            </div>
        </div>
    );
}

export default CalculatorForm;
