const RenderType = Object.freeze({ "Empty": 0, "Image": 1 }),
      imgPath = "Images/",
      images = ["orange.png", "apple.png", "blueberries.png", "strawberry.png", "raspberries.png", "mandarin.png"],
      key = "memory-game-record";

class Memory {
    #cells = [];
    #openedCells = [];
    #result = 0;
    #isDisabled = false;
    #rows;
    #cols;
    #imagesNum;

    repeatNum;
    previewTimeSec;
    prizePoints;

    constructor({ imagesNum = images.length, repeatNum = 2, previewTimeSec = 3, prizePoints = 50 }) {
        this.imagesNum = imagesNum;
        this.repeatNum = repeatNum;
        this.previewTimeSec = previewTimeSec;
        this.prizePoints = prizePoints;
        this.area = { imagesNum: this.imagesNum, repeatNum: this.repeatNum };

        this.#generateTable(this.#rows, this.#cols);
        this.#addEventListeners(this);
    }

    get imagesNum() { return this.#imagesNum; } 
    set imagesNum(val) { this.#imagesNum = Math.min(val, images.length); }

    get area() { return this.#rows * this.#cols; }
    set area(val) {
        let mult, abs;
        mult = abs = val.imagesNum * val.repeatNum;
        for (let i = 1; i <= mult; i++)
            for (let j = i; j <= mult; j++)
                if (i * j === mult && Math.abs(i - j) < abs) {
                    abs = Math.abs(i - j);
                    this.#rows = i;
                    this.#cols = j
                }
    }

    #addEventListeners(self) {
        document.querySelectorAll('td').forEach(e => e.addEventListener("click", function() {
            self.#check(+($(this).attr('id')));
        }));
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

    #resetOpenedCells() { 
        this.#openedCells.fill(null);
    }

    #clearOpenedCells() {
        for (let i = 0; i < this.#openedCells.length; i++)
            this.#draw(this.#openedCells[i], RenderType.Empty);
        this.#resetOpenedCells();
    }

    #draw(id, type) {
        let backImg;
        switch (type) {
            case RenderType.Image:
                backImg = this.getImageUrl(this.#cells[id]);
                break;
            default:
                backImg = 'none';
                break;
        }
        $('#' + id).css("background-image", backImg);
    }

    #check(id) {
        let emptyCellIndex = this.#openedCells.findIndex(p => p === null);
        if (emptyCellIndex >= 0 && this.isClosedCell(id) && !this.#isDisabled) {
            this.#openedCells[emptyCellIndex] = id;
            this.#draw(id, RenderType.Image);

            if (emptyCellIndex > 0) {
                this.#isDisabled = true;
                setTimeout(() => {
                    if (!this.isStreak()) {
                        this.#result -= this.prizePoints;
                        this.#clearOpenedCells();
                    } else if (emptyCellIndex === this.#openedCells.length - 1) {
                        this.#result += this.prizePoints;
                        this.#resetOpenedCells();
                    }
                    this.setResult();
                    if (this.isFinish()) {
                        if (this.#result > localStorage[key] || localStorage[key] === undefined) {
                            localStorage[key] = this.#result;
                            this.setRecord();
                        }
                        alert('Your result: ' + this.#result);
                    }
                    this.#isDisabled = false;
                }, 350);
            }
        }
    }

    getImageUrl = (id) => 'url(' + imgPath + images[id] + ')'

    getCellImage = (id) => $('#' + id).css('background-image');

    isClosedCell = (id) => this.getCellImage(id) === 'none';

    isStreak() {
        for(let i = 1; i < this.#openedCells.length; i++)
            if(this.#cells[this.#openedCells[i]] !== this.#cells[this.#openedCells[i - 1]] && 
                this.#openedCells[i] !== null && this.#openedCells[i - 1] !== null)
                return false;
        return true;
    }

    isFinish() {
        for (let i = 0; i < this.area; i++)
            if (this.isClosedCell(i))
                return false;
        return true;
    }

    setResult = () => $("#result").text(this.#result);

    setRecord = () => $("#record").text(localStorage[key] ?? 0);

    shuffle(a) {
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    engine = () => {
        $("#start").prop('disabled', true);
        this.#resetOpenedCells();
        for (let i = 0; i < this.area; i++)
            this.#draw(i, RenderType.Image);
        setTimeout(() => {
                for (let i = 0; i < this.area; i++)
                    this.#draw(i, RenderType.Empty);
                $("#start").prop('disabled', false);
            }, this.previewTimeSec * 1000);
    }

    go() {
        this.setResult();
        this.setRecord();
        this.#openedCells = new Array(this.repeatNum);
        let array = Array.from(Array(images.length).keys());
        array = this.shuffle(array).slice(0, this.imagesNum);
        for (let i = 0; i < this.repeatNum; i++)
            this.#cells = this.#cells.concat(array);
        this.shuffle(this.#cells);
        this.engine();
    }
}

$(document).ready(function() {
    load();
});

function resetRecord() {
    localStorage[key] = 0;
    $("#record").text(localStorage[key]);
}

function load() {
    let memory = new Memory({ repeatNum: 3, previewTimeSec: 5 });
    memory.go();
}