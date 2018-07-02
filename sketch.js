var population = [];
var newPopulation = [];
var num_blobs = 10;
var num_food = 0;

var blob_start_size = 25;
var food_start_size = 5;

var x_canvas_size = 1000;
var y_canvas_size = 500;

var id_counter = 0;

var deadBlobs = [];

function setup() {
    createCanvas(x_canvas_size, y_canvas_size);
    background(0);
    population = new Array(num_blobs + num_food);
    for (var i = 0; i < population.length; i++) {
        var start = startPos();
        if (i < num_blobs) {
            var nn = new NeuralNetwork([(population.length * 3), 5, 2]);
            population[i] = new Blob(id_counter, start[0], start[1], blob_start_size, false, nn);
        }
        else {
            population[i] = new Blob(id_counter, start[0], start[1], food_start_size, true);
        }
        id_counter++;
    }
}

function startPos(){
    //return [floor(random(x_canvas_size)), floor(random(y_canvas_size))];
    return [x_canvas_size/2, y_canvas_size/2];
}

function draw() {
    background(0);   
        if(deadBlobs.length == num_blobs){
            createNewPopulation();
        }

        for (var i = 0; i < population.length; i++) {
            var blob = population[i];
            //console.log(deadBlobs);
            if(deadBlobs.includes(blob.id)){               
                continue;
            }            
            if (isBlobAlive(blob)) {
                blob.fitness += (Math.abs(blob.x_velocity) + Math.abs(blob.y_velocity));
            }
            else {
                //console.log("blob nr " + blob.id + " has died a tragic death..");
                deadBlobs.push(blob.id);
            }
            population[i].update(population);
            population[i].draw();
        }
}

function isBlobAlive(blob) {
    if (blob.x < 0 || blob.x > x_canvas_size) { return false; }
    if (blob.y < 0 || blob.y > y_canvas_size) { return false; }
    return true;
}

function createNewPopulation(){
    newPopulation = [];
    for(var i = 0; i < num_blobs; i++){
        var brain1 = selection(population);
        var brain2 = selection(population);

        var childBlob = makeChild(brain1, brain2);
        newPopulation.push(childBlob);
        id_counter++;
    }
    population = newPopulation;
    //console.log(newPopulation);
    deadBlobs = [];
}