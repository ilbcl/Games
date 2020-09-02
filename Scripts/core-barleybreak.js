const Arrow = Object.freeze({ "Left": 1, "Up": 2, "Right": 3, "Down": 4 })

let interval;
class BarleyBreak {
	#numbers = [];
    #time = 0;
	#steps = 0;

    rows;
    cols;   

    constructor(params) {
        this.rows = params.rows;
        this.cols = params.cols;

        let self = this;
        $(document).keydown(self.#onKeyDown);
        $(document).on("click", "td", function() {
            if (interval)
                self.#chooseClick(+($(this).attr('id')))
        });
    }

    get #emptyCellIndex() { return this.#numbers.indexOf(0); }
    get #getArea() { return this.rows * this.cols; }

    #generateTable() { 
        let gt = $('table'),
            fragment = document.createDocumentFragment(),
            tr = document.createElement('tr'),
            td = document.createElement('td'),
            cnt = 0;

        for (let i = 0; i < this.rows; i++) {
            let row = tr.cloneNode();
            for (let j = 0; j < this.cols; j++) {
                let cell = td.cloneNode();
                cell.setAttribute("id", cnt++);
                row.appendChild(cell);
            }
            gt.append(row);
        }
        gt.append(fragment);
    }

    #chooseArrow(keyCode) {
    	let eci = this.#emptyCellIndex;
        if (keyCode == Arrow.Left && this.onSameLine(eci, eci + 1))
            this.#swap(eci, eci + 1);
        if (keyCode == Arrow.Right && this.onSameLine(eci, eci - 1))
            this.#swap(eci, eci - 1);
        if (keyCode == Arrow.Up && eci + this.cols < this.#getArea)
            this.#swap(eci + this.cols, eci);
        if (keyCode == Arrow.Down && eci - this.cols >= 0)
            this.#swap(eci - this.cols, eci);
    }

    #chooseClick(id) {
        if (this.#numbers[id + this.cols] == 0) this.#swap(id, id + this.cols);
        if (this.#numbers[id - this.cols] == 0) this.#swap(id, id - this.cols);
        if (this.#numbers[id + 1] == 0 && this.onSameLine(id, id + 1)) this.#swap(id, id + 1);
        if (this.#numbers[id - 1] == 0 && this.onSameLine(id, id - 1)) this.#swap(id, id - 1);
    }

    #onKeyDown = (e) => {
        let keyCode = e.keyCode - 36;
        if (keyCode >= 1 && keyCode <= 4 && interval)
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
		if(this.#numbers[this.#numbers.length - 1] != 0)
			return false;

	    for (let i = 1; i < this.#numbers.length - 1; i++)
	        if (this.#numbers[i - 1] > this.#numbers[i])
	            return false;
	    return true;
	}

    shuffle(a) {
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

	onSameLine = (n, m) => Math.floor(n / this.cols) == Math.floor(m / this.cols);

    startTimer() {
    	let self = this;
    	self.#steps = 0;
		self.#time = 0
    	$("#steps").text(self.#steps);
        interval = setInterval(function() {
            $("#timer").text(++(self.#time));
        }, 1000)
    }

    stopTimer() {
        clearInterval(interval);
        interval = null;
    }

    engine = () => {
        this.startTimer();
        this.#numbers = this.shuffle(Array.from(Array(this.#getArea).keys()));
        for (let i = 0; i < this.#numbers.length; i++)
            this.#draw(i, this.#numbers[i]);
    }

    go() {
    	this.#generateTable(); 
        this.engine();
    }
}

$(document).ready(function() {
    load();
});

function load() {
    let barleyBreak = new BarleyBreak({ rows: 4, cols: 4 });
    barleyBreak.go();
}