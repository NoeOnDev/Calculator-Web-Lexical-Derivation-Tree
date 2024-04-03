import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import moo from 'moo';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

let lexer = moo.compile({
    WS:      /[ \t]+/,
    number:  /0|[1-9][0-9]*/,
    plus:    '+',
    minus:   '-',
    times:   '*',
    div:     '/',
    lparen:  '(',
    rparen:  ')',
    NL:      { match: /\n/, lineBreaks: true },
});

app.post('/analizador/lexico', (req, res) => {
    try {
        const { expresion } = req.body;

        lexer.reset(expresion);
        let token;
        let resultado = [];
        while (token = lexer.next()) {
            resultado.push(token);
        }

        res.send({ resultado });
    } catch (error) {
        res.status(500).send({ error: error.toString() });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});