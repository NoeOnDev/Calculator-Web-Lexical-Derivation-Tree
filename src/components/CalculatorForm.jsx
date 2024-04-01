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

    const handleEqualClick = () => {
        let inputString = input;
        let numbers = [];
        let operators = [];
        let currentNumber = "";

        for (let i = 0; i < inputString.length; i++) {
            if ("+-*/()".includes(inputString[i])) {
                if (currentNumber !== "") {
                    numbers.push(parseFloat(currentNumber));
                    currentNumber = "";
                }
                if (inputString[i] !== ")") {
                    operators.push(inputString[i]);
                } else {
                    let num2 = numbers.pop();
                    let num1 = numbers.pop();
                    let op = operators.pop();
                    let result;
                    if (op === "+") {
                        result = num1 + num2;
                    } else if (op === "-") {
                        result = num1 - num2;
                    } else if (op === "*") {
                        result = num1 * num2;
                    } else if (op === "/") {
                        result = num1 / num2;
                    }
                    numbers.push(result);
                }
            } else {
                currentNumber += inputString[i];
            }
        }

        if (currentNumber !== "") {
            numbers.push(parseFloat(currentNumber));
        }

        // Calculate remaining expression
        let result = numbers[0];
        for (let i = 0; i < operators.length; i++) {
            if (operators[i] === "+") {
                result += numbers[i + 1];
            } else if (operators[i] === "-") {
                result -= numbers[i + 1];
            } else if (operators[i] === "*") {
                result *= numbers[i + 1];
            } else if (operators[i] === "/") {
                result /= numbers[i + 1];
            }
        }

        setInput(result.toString());
        setResultDisplayed(true);
    };

    const handleDeleteClick = () => {
        setInput(input.slice(0, -1));
    };

    const handleClearClick = () => {
        setInput("");
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
