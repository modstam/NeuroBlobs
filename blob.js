class Blob {
    constructor(x, y, size, isFood, brain) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.x_velocity = 0;
        this.y_velocity = 0;
        this.velocity_decay = 1.0;
        this.isFood = isFood;
        if (!brain == undefined) {
            this.brain = brain;
        }
    }

    addVelocity(x, y) {
        this.x_velocity += x;
        this.y_velocity += y;
    }

    update(population) {

        if (!this.isFood) {
            var input = new Array[(population.length * 3) + 3];
            input[0] = this.x;
            input[1] = this.y;
            input[2] = this.size;
            for (var i = 3; i < population.length; i += i + 3) {
                input[i] = population[i].x;
                input[i + 1] = population[i].y;
                input[i + 2] = population[i].size;
            }
            var output = brain.feedForward(input);
            this.addVelocity(output[0], output[1]);
            this.x += this.x_velocity;
            this.y += this.y_velocity;
        }

    }

    shouldEat(blob) {

    }

    eat(blob) {

    }

    detectCollision(population) {

    }

    draw() {
        fill(255);
        ellipse(this.x, this.y, this.size * 2, this.size * 2);
    }
}