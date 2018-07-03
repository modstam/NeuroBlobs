var fitness_sum = 0;
var mutation_rate = 0.10;

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
    //console.log("Selected " + blobs[index].id + " for parenting (fitness: " + blobs[index].fitness + ")");
    return blobs[index].brain.clone();
}


function modifyFitness(blobs) {
    fitness_sum = 0;
    //console.log(blobs);
    for (var i = 0; i < blobs.length; i++) {
        blobs[i].fitness = pow(blobs[i].fitness, 1.2);
        fitness_sum += blobs[i].fitness;
    }

    for (var i = 0; i < blobs.length; i++) {
        blobs[i].fitness /= fitness_sum;
    }
    return blobs;
}

function makeChild(brain1, brain2) {
    var childBrain = brain1.crossOver(brain2);
    childBrain.mutate(mutation_rate);
    //console.log(childBrain);
    var start = startPos();
    return new Blob(id_counter, start[0], start[1], blob_start_size, false, childBrain);
}

function newBlob(brain) {
    var start = startPos();
    brain.mutate(mutation_rate);
    return new Blob(id_counter, start[0], start[1], blob_start_size, false, brain);
}