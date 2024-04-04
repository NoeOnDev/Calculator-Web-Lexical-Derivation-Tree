import express from "express";
import cors from "cors";
import morgan from "morgan";
import bodyParser from "body-parser";
import moo from "moo";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.json());

let lexer = moo.compile({
  WS: /[ \t]+/,
  float: /0\.[0-9]+|[1-9][0-9]*\.[0-9]+|\.[0-9]+/,
  integer: /[0-9]+/,
  plus: "+",
  minus: "-",
  times: "*",
  div: "/",
  lparen: "(",
  rparen: ")",
  NL: { match: /\n/, lineBreaks: true },
});

app.post("/analizador/lexico", (req, res) => {
  try {
    const { expresion } = req.body;

    lexer.reset(expresion);
    let token;
    let resultado = [];
    let linea = 1;
    let prevToken = null;
    while ((token = lexer.next())) {
      if (token.type !== "NL" && token.type !== "WS") {
        if (
          prevToken &&
          (prevToken.type === "integer" || prevToken.type === "rparen") &&
          (token.type === "integer" || token.type === "lparen")
        ) {
          resultado.push({
            linea,
            tipo: "times",
            valor: "*",
            posicion: token.col - 1,
          });
          token.col++;
        }
        resultado.push({
          linea,
          tipo: token.type,
          valor: token.value,
          posicion: token.col - 1,
        });
      }
      if (token.type === "NL") {
        linea++;
      }
      prevToken = token;
    }

    res.send({ resultado });
  } catch (error) {
    res.status(500).send({ error: error.toString() });
    console.error(error);
  }
});

app.get("/", (req, res) => {
  res.send(`API running on port ${PORT}`);
});

app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});
