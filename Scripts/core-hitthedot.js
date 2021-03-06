﻿import { Game, enums } from './core.js';

let interval;
class HitTheDot extends Game {
	#time = 0;
	#points = 0;
	#goal;
	#roundTimeSec;

	rows
	cols;
	roundTime;
	roundTimeUnit;

	constructor({ rows, cols, roundTime = 30, roundTimeUnit = enums.TimeUnit.Second }) {
        super();

	    this.rows = rows;
	    this.cols = cols;
	    this.roundTime = roundTime;
	    this.roundTimeUnit = roundTimeUnit;

	    this.generateTable(this.rows, this.cols, enums.SizeChart.D1);
        this.#addEventListeners(this);
	}

	get #getArea() { return this.rows * this.cols; }

	get roundTimeSec() {
	    if (this.#roundTimeSec === undefined) {
	        switch (this.roundTimeUnit) {
	            case enums.TimeUnit.Second:
	                this.#roundTimeSec = this.roundTime;
	                break;
	            case enums.TimeUnit.Minute:
	                this.#roundTimeSec = Math.floor(this.roundTime * 60);
	                break;
	        }
	    }
	    return this.#roundTimeSec;
	}

    #addEventListeners(self) {
        document.querySelectorAll('td').forEach(e => e.addEventListener("click", function() {
            self.#choose(+($(this).attr('id')));
        }));
    }

    #draw(id, type) {
        let color;
        switch (type) {
            case enums.RenderType.Content:
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
        	this.#draw(id, enums.RenderType.Empty);
        	this.#setNewGoal();
            this.#points++;
        }
        else
        	this.#points--;
        this.setResult();
    }

    #setNewGoal() {
        this.#goal = this.getRandomPos(this.#getArea);
        this.#draw(this.#goal, enums.RenderType.Content);
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

    setTimer = () => $("#timer").text(this.#time);

    setResult = () => $("#result").text(this.#points);

    go() {
    	this.setResult();
    	this.setTimer();
        this.#setNewGoal();
        this.#startTimer();
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

$(document).ready(function() {
    document.getElementById("newGame").addEventListener("click", showMenu);
    document.querySelectorAll('input[id*="start"]').forEach(e => e.addEventListener("click", load));
});

function load() {
    hideMenu();
    let hitTheDot = new HitTheDot({
        rows: $('#row').val(),
        cols: $('#col').val(),
        roundTime: 0.25,
        roundTimeUnit: enums.TimeUnit.Minute
    });
    hitTheDot.go();
}