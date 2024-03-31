import React, { useState } from 'react';
import style from "../styles/calculatorStyle.module.css";

function CalculatorForm() {
    const [input, setInput] = useState("");
    const [previousNumber, setPreviousNumber] = useState("");
    const [currentNumber, setCurrentNumber] = useState("");
    const [operator, setOperator] = useState("");
    const [error, setError] = useState("");

    const addToInput = val => {
        if (!error) {
            setInput(prevInput => prevInput + val);
        }
    };

    const addDecimal = val => {
        if (!error && input.indexOf(".") === -1) {
            setInput(prevInput => prevInput + val);
        }
    };

    const clearInput = () => {
        setInput("");
        setError("");
    };

    const add = () => {
        if (!error) {
            setPreviousNumber(input);
            setOperator("+");
            setInput("");
        }
    };

    const subtract = () => {
        if (!error) {
            setPreviousNumber(input);
            setOperator("-");
            setInput("");
        }
    };

    const multiply = () => {
        if (!error) {
            setPreviousNumber(input);
            setOperator("*");
            setInput("");
        }
    };

    const divide = () => {
        if (!error && input !== "0") {
            setPreviousNumber(input);
            setOperator("/");
            setInput("");
        } else {
            setError("Error: División por cero");
        }
    };

    const evaluate = () => {
        setCurrentNumber(input);
        try {
            let result;
            switch (operator) {
                case '+':
                    result = parseFloat(previousNumber) + parseFloat(currentNumber);
                    break;
                case '-':
                    result = parseFloat(previousNumber) - parseFloat(currentNumber);
                    break;
                case '*':
                    result = parseFloat(previousNumber) * parseFloat(currentNumber);
                    break;
                case '/':
                    result = parseFloat(previousNumber) / parseFloat(currentNumber);
                    break;
                default:
                    break;
            }
            setInput(result.toString());
        } catch (err) {
            setError("Error: Operación no válida");
        }
    };

    return (
        <div className={style.calculator}>
            <div className={style.input} id="input">{error || input}</div>
            <div className={style.buttons}>
                <div className={style.operators}>
                    <div onClick={add}>+</div>
                    <div onClick={subtract}>-</div>
                    <div onClick={multiply}>&times;</div>
                    <div onClick={divide}>&divide;</div>
                </div>
                <div className={style.leftPanel}>
                    <div className={style.numbers}>
                        <div onClick={() => addToInput("7")}>7</div>
                        <div onClick={() => addToInput("8")}>8</div>
                        <div onClick={() => addToInput("9")}>9</div>
                    </div>
                    <div className={style.numbers}>
                        <div onClick={() => addToInput("4")}>4</div>
                        <div onClick={() => addToInput("5")}>5</div>
                        <div onClick={() => addToInput("6")}>6</div>
                    </div>
                    <div className={style.numbers}>
                        <div onClick={() => addToInput("1")}>1</div>
                        <div onClick={() => addToInput("2")}>2</div>
                        <div onClick={() => addToInput("3")}>3</div>
                    </div>
                    <div className={style.numbers}>
                        <div onClick={() => addToInput("0")}>0</div>
                        <div onClick={() => addDecimal(".")}>.</div>
                        <div id="clear" onClick={clearInput}>C</div>
                    </div>
                </div>
                <div className={style.equal} onClick={evaluate}>=</div>
            </div>
        </div>
    );
}

export default CalculatorForm;
