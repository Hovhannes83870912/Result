var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

app.use(express.static("."));
app.get('/', function (req, res) {
res.redirect('index.html');
});
server.listen(3000);

var grasses = [];
var grassEaterArr = [];
var Something = [];
var PredatorArr = [];
var BombArr = [];

const LivingCreature = require('./LivingCreature');
const Grass = require('./grass');
const GrassEater = require('./grassEater');
const something = require('./Something');
const Predator = require('./Predator');
const Bomb = require('./bomb');

var matrix = [];

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

function matrixGenerator(matrixSize, grassCount, grassEaterCount, somethingCount, predatorCount) {
    for (let i = 0; i < matrixSize; i++) {
        matrix[i] = []
        for (let o = 0; o < matrixSize; o++) {
            matrix[i][o] = 0;
        }
    }
    for (let i = 0; i < grassCount; i++) {
        let x = Math.floor(getRandomArbitrary(0,matrixSize));
        let y = Math.floor(getRandomArbitrary(0,matrixSize));
        matrix[y][x] = 1;
    }
    for (let i = 0; i < grassEaterCount; i++) {
        let x = Math.floor(getRandomArbitrary(0,matrixSize));
        let y = Math.floor(getRandomArbitrary(0,matrixSize));
        matrix[y][x] = 2;
    }
    for (let i = 0; i < somethingCount; i++) {
        let x = Math.floor(getRandomArbitrary(0,matrixSize));
        let y = Math.floor(getRandomArbitrary(0,matrixSize));
        matrix[y][x] = 3;
    }
    for (let i = 0; i < predatorCount; i++) {
        let x = Math.floor(getRandomArbitrary(0,matrixSize));
        let y = Math.floor(getRandomArbitrary(0,matrixSize));
        matrix[y][x] = 5;
    }
}
var MatrixSize = 10

matrixGenerator(MatrixSize, 5, 5, 5, 5)

for (var y = 0; y < matrix.length; y++) {
    for (var x = 0; x < matrix[y].length; x++) {
        if (matrix[y][x] == 1) {
            let grassObject = new Grass(x, y);
            grasses.push(grassObject)
        }
        else if (matrix[y][x] == 2) {
            let grassEaterObject = new GrassEater(x, y);
            grassEaterArr.push(grassEaterObject)
        }
        else if (matrix[y][x] == 3) {
            let newSomething = new something(x, y);
            Something.push(newSomething)
        }
        else if (matrix[y][x] == 5) {
            let newPredator = new Predator(x, y);
            PredatorArr.push(newPredator)
        }
    }
}
var TNT = new Bomb(matrix.length + 1, matrix.length + 1)
BombArr.push(TNT)
console.log(BombArr);
io.on('connection', socket => {
    socket.emit('MatrixSize', MatrixSize)
})

function game() {
    for (var y = 0; y < matrix.length; y++) {
        for (var x = 0; x < matrix[y].length; x++) {
            if (matrix[y][x] == 1) {
                let grassObject = new Grass(x, y);
                grasses.push(grassObject)
            }
            else if (matrix[y][x] == 2) {
                let grassEaterObject = new GrassEater(x, y);
                grassEaterArr.push(grassEaterObject)
            }
            else if (matrix[y][x] == 3) {
                let newSomething = new something(x, y);
                Something.push(newSomething)
            }
            else if (matrix[y][x] == 5) {
                let newPredator = new Predator(x, y);
                PredatorArr.push(newPredator)
            }
        }
    }
    console.log(matrix)
    for (let i in grasses) {
        grasses[i].mul();
    }
    // for (let i in BombArr) {
    //     BombArr[i].fall();
    // }
    // for (let i in grassEaterArr) {
    //     grassEaterArr[i].eat();
    // }
    // for (let i in Something) {
    //     Something[i].move();
    // }
    // for (let i in PredatorArr) {
    //     PredatorArr[i].eat();
    // }
    io.on('connection', socket => {
        socket.emit('message', matrix)
    })
}
    
    setInterval(game,10)