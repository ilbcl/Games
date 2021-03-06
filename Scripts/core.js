const enums = {
    Arrow: Object.freeze({ "Left": 1, "Up": 2, "Right": 3, "Down": 4 }),
    SizeChart: Object.freeze({ "D1": 1, "D2": 2 }),
    RenderType: Object.freeze({ "Empty": 0, "Content": 1 }),
    TimeUnit: Object.freeze({ "Second": 1, "Minute": 2 })
}

class Game {
    constructor() {

    }

    generateTable(rows, cols, sizeChart) {
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
                row.appendChild(cell);
                if (sizeChart === enums.SizeChart.D1)
                    cell.setAttribute("id", cnt++);
                else if (sizeChart === enums.SizeChart.D2)
                    cell.setAttribute("id", i + '_' + j);
            }
            gt.append(row);
        }
        gt.append(fragment);
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    getRandomPos = (cnt) => Math.floor(Math.random() * cnt) + 0;
}

export { Game, enums }