﻿import { Game, enums } from './core.js';

const symbols = ['X', '0', '#', '@', '$', '%'];

class TicTacToe extends Game {
	#moves = [];
	#steps = 0;
	#isActive = true;
	#players;

    size;

    constructor(params) {
        super();

        this.size = params.size;
        this.players = params.players;

        this.generateTable(this.size, this.size, enums.SizeChart.D1);
        this.#addEventListeners(this);        
    }

    get #getArea() { return this.size * this.size; }
    get #player() { return this.#steps % this.players + 1; }

    get players() { return this.#players; } 
    set players(val) { this.#players = Math.min(val, symbols.length); }

    #addEventListeners(self) {
        document.querySelectorAll('td').forEach(e => e.addEventListener("click", function() {
            self.#step(+($(this).attr('id')));
        }));
    }

    #determineWinner() {
        let streak = new Array(this.players + 1),
            winner = -1;

        let streakWinner = (i) => {
            streak[this.#moves[i]]++;
            for (let t = 1; t < streak.length; t++)
                if (streak[t] === this.size) {
                    winner = t;
                    return;
                }
        }

        let checks = {
            findByCols(that) {
                for (let i = 0; i < that.size; i++) {
                    streak.fill(0);
                    for (let j = 0; j < that.#getArea; j += that.size)
                        streakWinner(i + j);
                }
            },
            findByRows(that) {
                for (let i = 0; i < that.#getArea; i += that.size) {
                    streak.fill(0);
                    for (let j = 0; j < that.size; j++)
                        streakWinner(i + j);
                }
            },
            findByLeftDiagonal(that) {
                streak.fill(0);
                for (let i = 0; i < that.#getArea; i += that.size + 1)
                    streakWinner(i);
            },
            findByRightDiagonal(that) {
                streak.fill(0);
                for (let i = that.size - 1; i < that.#getArea - 1; i += that.size - 1)
                    streakWinner(i);
            }
        }

        Object.keys(checks).forEach(i => { checks[i](this) });

        return winner;
    }

    #step(id) {
        if (this.#moves[id] === 0 && this.#isActive) {
            this.#moves[id] = this.#player;
            $('#' + id).html(symbols[this.#player - 1]);

            let winner = this.#determineWinner();
            if (winner >= 1 || this.#steps === this.#getArea - 1) {
                this.#isActive = false;
                setTimeout(() => {
                    alert(winner >= 1 ? `Player ${this.#player} win!` : 'Draw')
                }, 50);
            }
            else {
            	this.#steps++;
            	this.showPlayer();
            }
        }
    }

    showPlayer = () => $('#player').text(`Player ${this.#player} turn.`);

    start() {
        this.#moves = new Array(this.#getArea).fill(0);
        this.showPlayer();
    }
}

$(document).ready(function() {
    load();
    
    document.getElementById("restart").addEventListener("click", load);
});

function load() {
    let ticTacToe = new TicTacToe({ size: 5, players: 3 });
    ticTacToe.start();
}