class Blob {
    constructor(id, x, y, size, isFood, neuralnetwork) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.size = size;
        this.x_velocity = 0;
        this.y_velocity = 0;
        this.max_velocity = 10;
        this.isFood = isFood;
        this.fitness = 0;
        if (!isFood) {
            this.brain = neuralnetwork;
        }
    }

    addVelocity(x, y) {
        this.x_velocity = this.calculateVelocity(this.x_velocity, x);
        this.y_velocity = this.calculateVelocity(this.y_velocity, y);
    }

    calculateVelocity(currentVel, impulse) {
        var vel = 0;
        if (impulse >= 0.5) {
            vel = impulse - 0.5;
        }
        else {
            vel = 0 - (0.5 - impulse);
        }

        if (this.max_velocity - Math.abs(currentVel + vel) >= 0.05) {
            return currentVel + vel;
        }
        else if (currentVel + vel >= 0) {
            return this.max_velocity;
        }
        else {
            return -this.max_velocity;
        }
    }

    update(blobs) {
        //console.log(blobs);
        if (!this.isFood) {
            var input = [];
            input.push(this.x);
            input.push(this.y);
            // input.push(this.size);
            // for (var i = 0; i < blobs.length; i++) {
            //     if (blobs[i].id == this.id) { continue }
            //     input.push(blobs[i].x);
            //     input.push(blobs[i].y);
            //     input.push(blobs[i].size);
            // }
            // console.log(input);
            var output = this.brain.feedForward(input);
            // console.log(output);
            // console.log(output.data[0][0]);
            // console.log(output.data[1][0]);
            this.addVelocity(output.data[0][0], output.data[1][0]);
            this.x += this.x_velocity;
            this.y += this.y_velocity;
            // console.log(this);
        }

    }

    draw() {
        fill(255);
        ellipse(this.x, this.y, this.size * 2, this.size * 2);
    }
}