import React, { useState } from 'react';
import * as math from 'mathjs';
import styles from '../styles/calculadoraStyle.module.css';


function CalculadoraFrom() {
    const [display, setDisplay] = useState("");
    const [analisis, setAnalisis] = useState([]);

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

    const calculate = async () => {
        try {
            if ((display.match(/\(/g) || []).length !== (display.match(/\)/g) || []).length) {
                throw new Error();
            }

            if (/\/0/.test(display)) {
                throw new Error();
            }

            await analizarExpresion(display);

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

    const analizarExpresion = async (expresion) => {
        const response = await fetch('http://localhost:3001/analizador/lexico', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ expresion })
        });

        const data = await response.json();
        setAnalisis(data.resultado);
    }

    return (
        <div className={styles.container}>
            <div className={styles.calculadora}>
                <div className={styles.input}>{display}</div>
                <div className={styles.numbers}>
                    <div className={styles.buttonPair}>
                        <div className={styles.btn}>
                            <button onClick={clearDisplay} className={styles.buttonOperator}>
                                <span className={styles.buttonTextOperator}>CE</span>
                            </button>
                        </div>
                    </div>
                    <div className={styles.buttonPair}>
                        <div className={styles.btn}>
                            <button onClick={() => handleClick("(")} className={styles.buttonOperator}>
                                <span className={styles.buttonTextOperator}>(</span>
                            </button>
                        </div>
                    </div>
                    <div className={styles.buttonPair}>
                        <div className={styles.btn}>
                            <button onClick={() => handleClick(")")} className={styles.buttonOperator}>
                                <span className={styles.buttonTextOperator}>)</span>
                            </button>
                        </div>
                    </div>
                    <div className={styles.buttonPair}>
                        <div className={styles.btn}>
                            <button onClick={() => handleClick("/")} className={styles.buttonOperator}>
                                <span className={styles.buttonTextOperator}>/</span>
                            </button>
                        </div>
                    </div>
                </div>
                <div className={styles.numbers}>
                    <div className={styles.buttonPair}>
                        <div className={styles.btn}>
                            <button onClick={() => handleClick(7)} className={styles.button}>
                                <span className={styles.buttonText}>7</span>
                            </button>
                        </div>
                    </div>
                    <div className={styles.buttonPair}>
                        <div className={styles.btn}>
                            <button onClick={() => handleClick(8)} className={styles.button}>
                                <span className={styles.buttonText}>8</span>
                            </button>
                        </div>
                    </div>
                    <div className={styles.buttonPair}>
                        <div className={styles.btn}>
                            <button onClick={() => handleClick(9)} className={styles.button}>
                                <span className={styles.buttonText}>9</span>
                            </button>
                        </div>
                    </div>
                    <div className={styles.buttonPair}>
                        <div className={styles.btn}>
                            <button onClick={() => handleClick("*")} className={styles.buttonOperator}>
                                <span className={styles.buttonTextOperator}>*</span>
                            </button>
                        </div>
                    </div>
                </div>
                <div className={styles.numbers}>
                    <div className={styles.buttonPair}>
                        <div className={styles.btn}>
                            <button onClick={() => handleClick(4)} className={styles.button}>
                                <span className={styles.buttonText}>4</span>
                            </button>
                        </div>
                    </div>
                    <div className={styles.buttonPair}>
                        <div className={styles.btn}>
                            <button onClick={() => handleClick(5)} className={styles.button}>
                                <span className={styles.buttonText}>5</span>
                            </button>
                        </div>
                    </div>
                    <div className={styles.buttonPair}>
                        <div className={styles.btn}>
                            <button onClick={() => handleClick(6)} className={styles.button}>
                                <span className={styles.buttonText}>6</span>
                            </button>
                        </div>
                    </div>
                    <div className={styles.buttonPair}>
                        <div className={styles.btn}>
                            <button onClick={() => handleClick("-")} className={styles.buttonOperator}>
                                <span className={styles.buttonTextOperator}>-</span>
                            </button>
                        </div>
                    </div>
                </div>
                <div className={styles.numbers}>
                    <div className={styles.buttonPair}>
                        <div className={styles.btn}>
                            <button onClick={() => handleClick(1)} className={styles.button}>
                                <span className={styles.buttonText}>1</span>
                            </button>
                        </div>
                    </div>
                    <div className={styles.buttonPair}>
                        <div className={styles.btn}>
                            <button onClick={() => handleClick(2)} className={styles.button}>
                                <span className={styles.buttonText}>2</span>
                            </button>
                        </div>
                    </div>
                    <div className={styles.buttonPair}>
                        <div className={styles.btn}>
                            <button onClick={() => handleClick(3)} className={styles.button}>
                                <span className={styles.buttonText}>3</span>
                            </button>
                        </div>
                    </div>
                    <div className={styles.buttonPair}>
                        <div className={styles.btn}>
                            <button onClick={() => handleClick("+")} className={styles.buttonOperator}>
                                <span className={styles.buttonTextOperator}>+</span>
                            </button>
                        </div>
                    </div>
                </div>
                <div className={styles.numbers}>
                    <div className={styles.buttonPair}>
                        <div className={styles.btn}>
                            <button onClick={deleteLastChar} className={styles.buttonDelete}>
                                <span className={styles.buttonTextDelete}>Del</span>
                            </button>
                        </div>
                    </div>
                    <div className={styles.buttonPair}>
                        <div className={styles.btn}>
                            <button onClick={() => handleClick(0)} className={styles.button}>
                                <span className={styles.buttonText}>0</span>
                            </button>
                        </div>
                    </div>
                    <div className={styles.buttonPair}>
                        <div className={styles.btn}>
                            <button onClick={() => handleClick(".")} className={styles.button}>
                                <span className={styles.buttonText}>.</span>
                            </button>
                        </div>
                    </div>
                    <div className={styles.buttonPair}>
                        <div className={styles.btn}>
                            <button onClick={calculate} className={styles.button}>
                                <span className={styles.buttonText}>=</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.analizadorLexico}>
                <div>
                    <h1>Analizador Léxico</h1>
                    <ul>
                        {analisis.map((token, index) => (
                            <li key={index}>
                                Linea {token.linea} - Data type: {token.tipo}, Value: "{token.valor}", Position: {token.posicion}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default CalculadoraFrom;