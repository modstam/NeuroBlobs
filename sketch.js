var population = [];
var blob_size = 10;
var food_size = 100;

var blob_start_size = 25;
var food_start_size = 5;

var x_canvas_size = 1000;
var y_canvas_size = 500;

function setup() {
    createCanvas(x_canvas_size, y_canvas_size);
    background(0);
    ellipse(300, 300, 50, 50);
    population = new Array(blob_size + food_size);
    for (var i = 0; i < population.length; i++) {
        if (i < blob_size) {
            var nn = new NeuralNetwork([(population.length * 3) + 3, 5, 2]);
            population[i] = new Blob(floor(random(x_canvas_size)), floor(random(y_canvas_size)), blob_start_size, false, nn);
        }
        else {
            population[i] = new Blob(floor(random(x_canvas_size)), floor(random(y_canvas_size)), food_start_size, true);
        }
    }
}

function draw() {
    background(0);

    for (var i = 0; i < population.length; i++) {
        population[i].draw();
        //console.log(population[i]);
    }
}