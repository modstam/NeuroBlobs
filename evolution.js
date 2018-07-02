var fitness_sum = 0;
var mutation_rate = 0.1;

function selection(population) {
    blobs = modifyFitness(population);

    //credit to Daniel Shiffman @codingtrain
    // Start at 0
    let index = 0;

    // Pick a random number between 0 and 1
    let r = random(1);

    // Keep subtracting probabilities until you get less than zero
    // Higher probabilities will be more likely to be fixed since they will
    // subtract a larger number towards zero
    while (r > 0) {
        r -= (blobs[index].fitness);
        // And move on to the next
        index += 1;
    }

    // Go back one
    index -= 1;

    // Make sure it's a copy!
    // (this includes mutation)
    console.log("Selected " + blobs[index].id + " for parenting (fitness: " + blobs[index].fitness + ")");
    return blobs[index].brain.clone();
}

function crossOver(brain1, brain2) {
    var i = 1;
    var counter = 0;
    while (i < brain1.weights.length) {
        brain1.weights[i].eleMap(cross);
        brain1.biases[i].eleMap(cross);
        i++;
    }

    function cross(v, row, col) {
        if (counter % 2 == 0) {
            return brain2.weights[i].data[row][col];
        }
        counter++;
        return v;
    }

    return brain1;
}

function modifyFitness(blobs) {
    fitness_sum = 0;
    //console.log(blobs);
    for (var i = 0; i < blobs.length; i++) {
        //blobs[i].fitness = pow(blobs[i].fitness, 2);
        fitness_sum += blobs[i].fitness;
    }

    for (var i = 0; i < blobs.length; i++) {
        blobs[i].fitness /= fitness_sum;
    }
    return blobs;
}

function makeChild(brain1, brain2) {
    var childBrain = crossOver(brain1, brain2);
    childBrain.mutate(mutation_rate);
    //console.log(childBrain);
    var start = startPos();
    return new Blob(id_counter, start[0], start[1], blob_start_size, false, childBrain);
}