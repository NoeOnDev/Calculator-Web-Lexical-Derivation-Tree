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
        let numbers = inputString.split(/\+|\-|\*|\//g);
        let operators = inputString.replace(/[0-9]|\./g, "").split("");

        let divideIndex = operators.indexOf("/");
        while (divideIndex !== -1) {
            numbers.splice(divideIndex, 2, numbers[divideIndex] / numbers[divideIndex + 1]);
            operators.splice(divideIndex, 1);
            divideIndex = operators.indexOf("/");
        }

        let multiplyIndex = operators.indexOf("*");
        while (multiplyIndex !== -1) {
            numbers.splice(multiplyIndex, 2, numbers[multiplyIndex] * numbers[multiplyIndex + 1]);
            operators.splice(multiplyIndex, 1);
            multiplyIndex = operators.indexOf("*");
        }

        let subtractIndex = operators.indexOf("-");
        while (subtractIndex !== -1) {
            numbers.splice(subtractIndex, 2, numbers[subtractIndex] - numbers[subtractIndex + 1]);
            operators.splice(subtractIndex, 1);
            subtractIndex = operators.indexOf("-");
        }

        let addIndex = operators.indexOf("+");
        while (addIndex !== -1) {
            numbers.splice(addIndex, 2, parseFloat(numbers[addIndex]) + parseFloat(numbers[addIndex + 1]));
            operators.splice(addIndex, 1);
            addIndex = operators.indexOf("+");
        }

        setInput(numbers[0].toString());
        setResultDisplayed(true);
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
                    </div>
                    <div className={style.numbers}>
                        <div onClick={handleNumberClick}>4</div>
                        <div onClick={handleNumberClick}>5</div>
                        <div onClick={handleNumberClick}>6</div>
                    </div>
                    <div className={style.numbers}>
                        <div onClick={handleNumberClick}>1</div>
                        <div onClick={handleNumberClick}>2</div>
                        <div onClick={handleNumberClick}>3</div>
                    </div>
                    <div className={style.numbers}>
                        <div onClick={handleNumberClick}>0</div>
                        <div onClick={handleNumberClick}>.</div>
                        <div id="clear" onClick={handleClearClick}>C</div>
                    </div>
                </div>
                <div className={style.equal} id="result" onClick={handleEqualClick}>=</div>
            </div>
        </div>
    );
}

export default CalculatorForm;
