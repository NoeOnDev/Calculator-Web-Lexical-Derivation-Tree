import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

app.post('analizador/lexico', (req, res) => {
    try {
        
    } catch (error) {
        
    }
});


app.listen(PORT);