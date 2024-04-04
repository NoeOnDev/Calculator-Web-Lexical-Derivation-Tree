import React, { useState } from 'react';
import * as math from 'mathjs';
import { parse } from 'mathjs';
import Tree from 'react-d3-tree';
import styles from '../styles/calculadoraStyle.module.css';

function CalculadoraFrom() {
    const [display, setDisplay] = useState("");
    const [analisis, setAnalisis] = useState([]);
    const [arbol, setArbol] = useState([]);
    const [isValid, setIsValid] = useState(true);

    const handleClick = (val) => {
        try {
            const lastNumber = display.split(/[\+\-\*\/\(]/).slice(-1)[0];
            const lastChar = display.slice(-1);

            if (val === '.' && display.length === 0) {
                setDisplay('0.');
                return;
            }
            if (val === '.' && lastNumber.includes('.') && !['+', '-', '*', '/'].includes(lastChar)) {
                return;
            }
            if (val === '-' && lastChar !== '-' && !['+', '-', '*', '/'].includes(lastChar)) {
                setDisplay(display + val);
                return;
            }
            if (val === '.' && ['+', '-', '*', '/'].includes(lastChar)) {
                setDisplay(display + '0' + val);
                return;
            }
            if (val === '.' && lastChar === '(') {
                setDisplay(display + '0' + val);
                return;
            }
            if (['+', '-', '*', '/'].includes(val) && ['+', '-', '*', '/'].includes(lastChar)) {
                setDisplay(display.slice(0, -1) + val);
                return;
            }
            setDisplay(display + val);
            setIsValid(true);
        } catch (error) {
            setDisplay("Sintax Error");
            setIsValid(false);
            console.error(error);
        }
    };

    const calculate = async () => {
        try {
            if ((display.match(/\(/g) || []).length !== (display.match(/\)/g) || []).length) {
                throw new Error();
            }

            if (/\/0/.test(display)) {
                throw new Error();
            }

            const result = math.evaluate(display);
            const formattedResult = math.format(result, { notation: 'fixed' });
            setDisplay(formattedResult);

            if (isValid) {
                await analizarExpresion(display);
                generarArbol(display);
            }
        } catch {
            setDisplay("Sintax Error");
            setIsValid(false);
        }
    };

    const clearDisplay = () => {
        setDisplay("");
        setAnalisis([]);
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

    const transformarArbol = (nodo) => {
        return {
            name: nodo.op || nodo.fn || nodo.name || nodo.value,
            children: nodo.args ? nodo.args.map(transformarArbol) : [],
        };
    };

    const generarArbol = (expresion) => {
        const nodo = parse(expresion);
        const arbolMathjs = nodo.toJSON();
        const arbolD3 = transformarArbol(arbolMathjs);
        setArbol(arbolD3);
    }

    const customPathFunc = (linkData, orientation) => {
        const { source, target } = linkData;
        const isHorizontal = orientation === 'horizontal';

        const startX = isHorizontal ? source.y : source.x;
        const startY = isHorizontal ? source.x : source.y;
        const endX = isHorizontal ? target.y : target.x;
        const endY = isHorizontal ? target.x : target.y;

        return `M${startX},${startY} L${endX},${endY}`;
    };


    return (
        <div className={styles.container}>
            <div className={styles.calculadora}>
                <div className={styles.input} id="input">{display}</div>
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
                <div className={styles.textAnalizadorLexico}>
                    <h1>Analizador Léxico</h1>
                    <ul className={styles.containerTextLexico}>
                        {analisis.map((token, index) => (
                            <li key={index}>
                                Linea {token.linea} - Data type: {token.tipo}, Value: "{token.valor}", Position: {token.posicion}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className={styles.arbolSintactico}>
                    <div className={styles.textArbolSintactico}>
                        <h1>Árbol Sintáctico</h1>
                        <div className={styles.containerTextArbol}>
                            {arbol && Object.keys(arbol).length > 0 &&
                                <Tree className={styles.arbol}
                                    data={arbol}
                                    orientation='vertical'
                                    pathFunc={(linkData) => customPathFunc(linkData, 'vertical')}
                                />}
                        </div>
                    </div>
                </div>
        </div>
    );
}

export default CalculadoraFrom;