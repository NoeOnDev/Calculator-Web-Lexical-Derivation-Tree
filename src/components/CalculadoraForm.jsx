import React, { useState } from 'react';
import * as math from 'mathjs';

function CalculadoraFrom() {
    const [display, setDisplay] = useState("");

    const handleClick = (val) => {
        const lastNumber = display.split(/[\+\-\*\/]/).slice(-1)[0];

        if (val === '.' && lastNumber.includes('.')) {
            return;
        }

        const lastChar = display.slice(-1);
        if (['+', '-', '*', '/'].includes(val) && ['+', '-', '*', '/'].includes(lastChar)) {
            return;
        }

        if (val === '-' && lastChar !== '-' && !['+', '*', '/'].includes(lastChar)) {
            setDisplay(display + val);
            return;
        }

        setDisplay(display + val);
    };

    const calculate = () => {
        try {
            if ((display.match(/\(/g) || []).length !== (display.match(/\)/g) || []).length) {
                throw new Error();
            }

            if (/\/0/.test(display)) {
                throw new Error();
            }

            const result = math.evaluate(display);
            setDisplay(math.format(result, { precision: 14 }));
        } catch {
            setDisplay("Error");
        }
    };

    const clearDisplay = () => {
        setDisplay("");
    };

    const deleteLastChar = () => {
        setDisplay(display.slice(0, -1));
    };

    return (
        <div className="Calculadora">
            <div className="display">{display}</div>
            <button onClick={() => handleClick(1)}>1</button>
            <button onClick={() => handleClick(2)}>2</button>
            <button onClick={() => handleClick(3)}>3</button>
            <button onClick={() => handleClick(4)}>4</button>
            <button onClick={() => handleClick(5)}>5</button>
            <button onClick={() => handleClick(6)}>6</button>
            <button onClick={() => handleClick(7)}>7</button>
            <button onClick={() => handleClick(8)}>8</button>
            <button onClick={() => handleClick(9)}>9</button>
            <button onClick={() => handleClick(0)}>0</button>
            <button onClick={() => handleClick(".")}>,</button>
            <button onClick={() => handleClick("+")}>+</button>
            <button onClick={() => handleClick("-")}>-</button>
            <button onClick={() => handleClick("*")}>*</button>
            <button onClick={() => handleClick("/")}>/</button>
            <button onClick={() => handleClick("(")}>(</button>
            <button onClick={() => handleClick(")")}>)</button>
            <button onClick={calculate}>=</button>
            <button onClick={clearDisplay}>C</button>
            <button onClick={deleteLastChar}>Borrar</button>
        </div>
    );
}

export default CalculadoraFrom;