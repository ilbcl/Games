﻿const RenderType = Object.freeze({ "Empty": 0, "Goal": 1 })
const TimeUnit = Object.freeze({ "Second": 1, "Minute": 2 })

let interval;
class HitTheDot {
	#time = 0;
	#points = 0;
	#goal;
	#roundTimeSec;

	rows
	cols;
	roundTime;
	roundTimeUnit;

	constructor({ rows, cols, roundTime = 30, roundTimeUnit = TimeUnit.Second }) {
	    this.rows = rows;
	    this.cols = cols;
	    this.roundTime = roundTime;
	    this.roundTimeUnit = roundTimeUnit;

	    $(document).on("click", "td", e => { this.#choose(+(e.target.id)) });
	}

	get #getArea() { return this.rows * this.cols; }

	get roundTimeSec() {
	    if (this.#roundTimeSec === undefined) {
	        switch (this.roundTimeUnit) {
	            case TimeUnit.Second:
	                this.#roundTimeSec = this.roundTime;
	                break;
	            case TimeUnit.Minute:
	                this.#roundTimeSec = Math.floor(this.roundTime * 60);
	                break;
	        }
	    }
	    return this.#roundTimeSec;
	}

	#generateTable(rows, cols) {
        let gt = $('table:last'),
            fragment = document.createDocumentFragment(),
            tr = document.createElement('tr'),
            td = document.createElement('td'),
            cnt = 0;

        gt.empty();
        for (let i = 0; i < rows; i++) {
            let row = tr.cloneNode();
            for (let j = 0; j < cols; j++) {
                let cell = td.cloneNode();
                cell.setAttribute("id", cnt++);
                row.appendChild(cell);
            }
            gt.append(row);
        }
        gt.append(fragment);
    }

    #draw(id, type) {
        let color;
        switch (type) {
            case RenderType.Goal:
                color = "orange";
                break;
            default:
                color = "white";
                break;
        }
        $('#' + id).css("background-color", color);
    }

    #choose(id) {
    	if(!interval)
    		return;

        if (id === this.#goal) {
        	this.#draw(id, RenderType.Empty);
        	this.#setNewGoal();
            this.#points++;
        }
        else
        	this.#points--;
        this.setResult();
    }

    #setNewGoal() {
        this.#goal = this.getRandomPos();
        this.#draw(this.#goal, RenderType.Goal);
    }

    #startTimer() {
        interval = setInterval(() => {
            this.setTimer(++this.#time);
            if (this.#time === this.roundTimeSec) {
                stopTimer();
                alert('Game over! Your score: ' + this.#points);
            }
        }, 1000);
    }

    getRandomPos = () => Math.floor(Math.random() * this.#getArea) + 0;

    setTimer = () => $("#timer").text(this.#time);

    setResult = () => $("#result").text(this.#points);

    engine = () => {
    	this.#setNewGoal();
        this.#startTimer();
    }

    go() {
        this.#generateTable(this.rows, this.cols);
    	this.setResult();
    	this.setTimer();
        this.engine();
    }
}

function stopTimer() {
    clearInterval(interval);
    interval = null;
}

function showMenu() {
	stopTimer();
    $('#row').val('');
    $('#col').val('');
    $('#menu').show();
    $('#action').hide();
}

function hideMenu() {
	stopTimer();
    $('#menu').hide();
    $('#action').show();
}

function load() {
    hideMenu();
    let hitTheDot = new HitTheDot({
        rows: $('#row').val(),
        cols: $('#col').val(),
        roundTime: 0.25,
        roundTimeUnit: TimeUnit.Minute
    });
    hitTheDot.go();
}