var population = [];
var newPopulation = [];
var num_blobs = 500;
var num_food = 0;

var blob_start_size = 25;
var food_start_size = 5;

var canvas;
var x_canvas_size = 500;
var y_canvas_size = 500;

var id_counter = 0;
var max_time = 30000;
var current_time = 0;
var current_gen = 0;

var survival_rate = 0.50;
var deadBlobs = [];
var mutation_rate = 0.05;

var best_fitness = 0;

function setup() {
    canvas = createCanvas(x_canvas_size, y_canvas_size);
    canvas.parent("sketch");
    document.getElementById("gen").innerHTML = ("Generation: " + current_gen);
    document.getElementById("pop").innerHTML = ("Population: " + num_blobs);
    document.getElementById("mut_rate").innerHTML = ("Mutation Rate: " + (mutation_rate * 100) + "%");
    document.getElementById("max_time").innerHTML = ("Max Time: " + (max_time / 1000) + " sec");
    document.getElementById("culling_rate").innerHTML = ("Top " + (survival_rate * 100) + "% survives");

    background(0);
    population = new Array(num_blobs + num_food);
    for (var i = 0; i < population.length; i++) {
        var start = startPos();
        if (i < num_blobs) {
            // var nn = new NeuralNetwork([(population.length * 3), 5, 2]);
            var nn = new NeuralNetwork([2, 8, 4]);
            population[i] = new Blob(id_counter, start[0], start[1], blob_start_size, false, nn);
        }
        else {
            population[i] = new Blob(id_counter, start[0], start[1], food_start_size, true);
        }
        id_counter++;
    }
}

function startPos() {
    return [floor(random(x_canvas_size)), floor(random(y_canvas_size))];
    //return [x_canvas_size / 2, y_canvas_size / 2];
}

function draw() {

    let deltaTime = window.performance.now() - canvas._pInst._lastFrameTime;
    current_time += deltaTime;

    background(0);
    if (deadBlobs.length == num_blobs || current_time > max_time) {
        current_time = 0;
        current_gen++;
        document.getElementById("gen").innerHTML = ("Generation: " + current_gen);
        createNewPopulation();
    }

    for (var i = 0; i < population.length; i++) {
        var blob = population[i];
        //console.log(deadBlobs);
        if (deadBlobs.includes(blob.id)) {
            continue;
        }
        if (isBlobAlive(blob)) {
            blob.fitness += (current_time * 0.00001) + ((pow(Math.abs(blob.x_velocity), 2) + pow(Math.abs(blob.y_velocity), 2))*0.001);
            // blob.fitness += (current_time*0.001);
            if(blob.fitness > best_fitness){
                best_fitness = blob.fitness;
            }
        }
        else {
            //console.log("blob nr " + blob.id + " has died a tragic death..");
            deadBlobs.push(blob.id);
        }
        population[i].update(population);
        population[i].draw();
    }
    document.getElementById("alive_blobs").innerHTML = ("Blobs alive: " + (num_blobs - deadBlobs.length));
    document.getElementById("best_fitness").innerHTML = ("Best fitness: " + best_fitness);
}

function isBlobAlive(blob) {
    if (blob.x < 0 || blob.x > x_canvas_size) { return false; }
    if (blob.y < 0 || blob.y > y_canvas_size) { return false; }
    return true;
}

function createNewPopulation() {
    newPopulation = [];
    var available_selection = modifyFitness(population, survival_rate);

    for (var i = 0; i < num_blobs; i++) {
        var brain1 = selection(available_selection);
        var brain2 = selection(available_selection);

        var childBlob = makeChild(brain1, brain2);
        //var childBlob = newBlob(brain1);
        newPopulation.push(childBlob);
        id_counter++;
    }
    population = newPopulation;
    //console.log(newPopulation);
    deadBlobs = [];
}