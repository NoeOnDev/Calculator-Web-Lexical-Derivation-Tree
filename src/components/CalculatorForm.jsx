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

    const evaluateExpression = (expression) => {
        try {
            return eval(expression);
        } catch (error) {
            return 'Error';
        }
    };

    const handleEqualClick = () => {
        const result = evaluateExpression(input);
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
