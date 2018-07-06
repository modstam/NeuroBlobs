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
        // var vel = (impulse - 0.5)*2;
        // var absVel = Math.abs(currentVel + vel);
        // if(absVel > this.max_velocity){
        //     if (currentVel + vel > 0) {
        //         return this.max_velocity;
        //     }
        //     else {
        //         return -this.max_velocity;
        //     }
        // }
        // return currentVel + vel;

        var absVel = Math.abs(currentVel + impulse);
        if(absVel > this.max_velocity){
            if (currentVel + impulse > 0) {
                return this.max_velocity;
            }
            else {
                return -this.max_velocity;
            }
        }
        return currentVel + impulse;
        
    }

    update(blobs) {
        //console.log(blobs);
        if (!this.isFood) {
            var input = [];
            input.push(this.x);
            input.push(this.y);
            // input.push(this.x_velocity);
            // input.push(this.y_velocity);
            var output = this.brain.feedForward(input);
            // console.log(output);
            // console.log(output.data[0][0]);
            // console.log(output.data[1][0]);
            var x_impulse = output.data[0][0] - output.data[1][0];
            var y_impulse = output.data[2][0] - output.data[3][0];
            this.addVelocity(x_impulse, y_impulse);
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