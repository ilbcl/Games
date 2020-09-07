import { Game, enums } from './core.js';

const RenderType = Object.freeze({ "Empty": 0, "Food": 1, "Body": 2, })

class Snake extends Game {
    #body = [];
    #food = [];
    #steps = 0;
    #arrow = enums.Arrow.Right;
    #interval;

    rows;
    cols;
    foodCnt;
    delayMs;

    constructor(params) {
        super();

        this.rows = params.rows;
        this.cols = params.cols;
        this.foodCnt = params.foodCnt;
        this.delayMs = params.delayMs;

        this.generateTable(this.rows, this.cols, enums.SizeChart.D2);
        this.#addEventListeners(this);
    }

    get #bodyCopy() { return JSON.parse(JSON.stringify(this.#body)); }

    #addEventListeners(self) {
        document.addEventListener('keydown', self.#onKeyDown);
    }

    #onKeyDown = (e) => {
        let keyCode = e.keyCode - 36;
        if (keyCode >= 1 && keyCode <= 4)
            this.#arrow = keyCode;
    };

    #draw(x, y, type) {
        let color;
        switch (type) {
            case RenderType.Food:
                color = "orange";
                break;
            case RenderType.Body:
                color = "black";
                break;
            default:
                color = "white";
                break;
        }
        $('#' + x + '_' + y).css("background-color", color);
    }

    #getGoodFood() {
        let newFood = { X: this.getRandomPos(this.rows), Y: this.getRandomPos(this.cols) };
        for (let i = 0; i < this.#body.length; i++)
            if (this.#body[i].X == newFood.X && this.#body[i].Y == newFood.Y)
                return getGoodFood();
        return newFood;
    }

    #getEatenFoodIndex() {
        for (let j = 0; j < this.#food.length; j++)
            if (this.#body[0].X == this.#food[j].X && this.#body[0].Y == this.#food[j].Y)
                return j;
        return -1;
    }

    #isCrush() {
    	if(this.#body.length <= 2)
    		return false;

        for (let t = 1; t < this.#body.length; t++)
            if (this.#body[0].X == this.#body[t].X && this.#body[0].Y == this.#body[t].Y)
                return true;
        return false;
    }

    #changeHeadPos(index) {
        if (this.#arrow == enums.Arrow.Left)
            this.#body[index].Y == 0 ? this.#body[index].Y = this.cols - 1 : this.#body[index].Y--;
        else if (this.#arrow == enums.Arrow.Right)
            this.#body[index].Y == this.cols - 1 ? this.#body[index].Y = 0 : this.#body[index].Y++;
        else if (this.#arrow == enums.Arrow.Up)
            this.#body[index].X == 0 ? this.#body[index].X = this.rows - 1 : this.#body[index].X--;
        else if (this.#arrow == enums.Arrow.Down)
            this.#body[index].X == this.rows - 1 ? this.#body[index].X = 0 : this.#body[index].X++;
    }

    #changeBackPos(index) {
        if (this.#arrow == enums.Arrow.Left)
            this.#body[index].Y++;
        else if (this.#arrow == enums.Arrow.Right)
            this.#body[index].Y--;
        else if (this.#arrow == enums.Arrow.Up)
            this.#body[index].X++;
        else if (this.#arrow == enums.Arrow.Down)
            this.#body[index].X--;
    }

    engine = () => {
        this.#body.unshift(this.#bodyCopy[0]);
        if (this.#steps > 0)
            this.#changeHeadPos(0);

        if (this.#isCrush())
            this.stop();
        else {
            let eatenFoodIndex = this.#getEatenFoodIndex();
            if (eatenFoodIndex >= 0) {
                this.#food.splice(eatenFoodIndex, 1);
                this.#body.push(this.#bodyCopy[this.#body.length - 1]);
                this.#changeBackPos(this.#body.length - 1);
            }

            if (this.#food.length < this.foodCnt) {
                let foodDiff = this.foodCnt - this.#food.length;
                for (let j = 0; j < foodDiff; j++)
                    this.#food.push(this.#getGoodFood());

                for (let j = this.#food.length - 1; j >= this.#food.length - foodDiff; j--)
                    this.#draw(this.#food[j].X, this.#food[j].Y, RenderType.Food);
            }

            this.#draw(this.#body[this.#body.length - 1].X, this.#body[this.#body.length - 1].Y, RenderType.Empty);
            this.#body.pop();

            for (let j = 0; j < this.#body.length; j++)
                this.#draw(this.#body[j].X, this.#body[j].Y, RenderType.Body);

            this.#steps++;
        }
    }

    go() {
        let startPlace = { X: 0, Y: 0 };
        this.#body.push(startPlace);
        this.interval = setInterval(this.engine, this.delayMs);
    }

    stop() {
        clearInterval(this.interval);
        alert(`Game over! Your score: ${this.#body.length - 1}, steps: ${this.#steps}`);
    }
}

$(function() {
    let snake = new Snake({ rows: 20, cols: 20, foodCnt: 5, delayMs: 500 });
    snake.go();
});