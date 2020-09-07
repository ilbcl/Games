import { Game, enums } from './core.js';

class BarleyBreak extends Game {
    #numbers = [];
    #time = 0;
    #steps = 0;
    #interval;

    rows;
    cols;

    constructor(params) {
        super();

        this.rows = params.rows;
        this.cols = params.cols;

        this.generateTable(this.rows, this.cols, enums.SizeChart.D1);
        this.#addEventListeners(this);
    }

    get #emptyCellIndex() { return this.#numbers.indexOf(0); }
    get #getArea() { return this.rows * this.cols; }

    #addEventListeners(self) {
        document.addEventListener('keydown', self.#onKeyDown);
        document.querySelectorAll('td').forEach(e => e.addEventListener("click", function() {
            if (this.#interval)
                self.#chooseClick(+($(this).attr('id')));
        }));
    }

    #chooseArrow(keyCode) {
        let eci = this.#emptyCellIndex;
        if (keyCode === enums.Arrow.Left && this.onSameLine(eci, eci + 1))
            this.#swap(eci, eci + 1);
        else if (keyCode === enums.Arrow.Right && this.onSameLine(eci, eci - 1))
            this.#swap(eci, eci - 1);
        else if (keyCode === enums.Arrow.Up && eci + this.cols < this.#getArea)
            this.#swap(eci + this.cols, eci);
        else if (keyCode === enums.Arrow.Down && eci - this.cols >= 0)
            this.#swap(eci - this.cols, eci);
    }

    #chooseClick(id) {
        if (this.#numbers[id + this.cols] === 0)
            this.#swap(id, id + this.cols);
        else if (this.#numbers[id - this.cols] === 0)
            this.#swap(id, id - this.cols);
        else if (this.#numbers[id + 1] === 0 && this.onSameLine(id, id + 1))
            this.#swap(id, id + 1);
        else if (this.#numbers[id - 1] === 0 && this.onSameLine(id, id - 1))
            this.#swap(id, id - 1);
    }

    #onKeyDown = (e) => {
        let keyCode = e.keyCode - 36;
        if (keyCode >= 1 && keyCode <= 4 && this.#interval)
            this.#chooseArrow(keyCode);
    };

    #draw(i, val) {
        $('#' + i).html(val > 0 ? val : '');
    }

    #swap(a, b) {
        this.#draw(a, this.#numbers[b]);
        this.#draw(b, this.#numbers[a]);
        let buf = this.#numbers[a];
        this.#numbers[a] = this.#numbers[b];
        this.#numbers[b] = buf;
        $("#steps").text(++this.#steps);
        if (this.#check()) {
            alert("Congratulations");
            this.stopTimer();
        }
    }

    #check() {
        if (this.#numbers[this.#numbers.length - 1] !== 0)
            return false;

        for (let i = 1; i < this.#numbers.length - 1; i++)
            if (this.#numbers[i - 1] > this.#numbers[i])
                return false;
        return true;
    }

    onSameLine = (n, m) => Math.floor(n / this.cols) === Math.floor(m / this.cols);

    startTimer() {
        this.#steps = 0;
        this.#time = 0
        $("#steps").text(this.#steps);
        this.#interval = setInterval(() => {
            $("#timer").text(++(this.#time));
        }, 1000)
    }

    stopTimer() {
        clearInterval(this.#interval);
        this.#interval = null;
    }

    go() {
        this.startTimer();
        this.#numbers = this.shuffleArray(Array.from(Array(this.#getArea).keys()));
        for (let i = 0; i < this.#numbers.length; i++)
            this.#draw(i, this.#numbers[i]);
    }
}

$(document).ready(function() {
    load();
});

function load() {
    let barleyBreak = new BarleyBreak({ rows: 4, cols: 4 });
    barleyBreak.go();
}