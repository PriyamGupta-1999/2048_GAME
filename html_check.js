(function(){

let model = {

    gridelemets: [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],

    _score: 0,

    get score(){
        return this._score;
    },

    set score(x){
        this._score=x;
    },
    get gridGs(){
        return this.gridelemets;
    },
    set gridGs(newgrid){
        this.gridelemets=newgrid;
    },

    
    reseter: (function(){ 
        var items=document.getElementsByClassName('items');

        var a=document.getElementById("btn");
        a.addEventListener("click",function(){
            for(var i=0;i<items.length;i++){
                items[i].innerHTML="0";
            }
        })
    })(),
    cellValues: [2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048],
    emptyGrid: function() {
        return [[0, 0, 0, 0],[0, 0, 0, 0],[0, 0, 0, 0],[0, 0, 0, 0]];
    },

    transpose: function(grid) {
        let newGrid = this.emptyGrid()
        for(let i = 0; i < 4; i++) {
            for(let j = 0; j < 4; j++) {
                newGrid[j][i] = this.gridelemets[i][j];
            }
        }
        return newGrid
    },

    reverse: function(grid) {
        let reversedGrid = JSON.parse(JSON.stringify(grid))
        for(let i = 0; i < 4; i++) {
            for(let j = 0; j < 2; j++) {
                const x = reversedGrid[i][3-j]
                reversedGrid[i][3-j] = reversedGrid[i][j]
                reversedGrid[i][j] = x
            }
        }
        return reversedGrid
    },
   


}



let view={
    scoreDisplay: document.getElementById('result'),
    backGrid: document.getElementById('container'),
    init :function(){
        octopus.resetGrid();
        document.getElementById('btn').addEventListener('click', octopus.resetGrid)
    },
    clearDOMGrid: function() {
        // console.log('Clearing grid')
        let gridCellElts = document.getElementsByClassName('items')
        while(gridCellElts.length) {
            gridCellElts[0].remove()
        }
        // console.log('Cleared')
    },

    renderGrid: function(){
        const grid=model.gridGs;
        console.log(grid,"rendering");

        // var a=document.getElementById('item1');
        // a.innerText="12323434";
        var items=document.getElementsByClassName('items');
        var c=0;
        var d=0;
        for(var i=0;i<items.length;i++){
            
            
            if(d>=4){
                c=c+1;
                d=0;
            }

            if(c==4){
                break;
            }
            var a=items[i].getAttribute("Id");
            var b=document.getElementById(a);
            b.innerText=grid[c][d];
            d++;
           
            
        }
    },

    keyhandler: function(e){
        console.log(e.key);
        console.log(octopus.canMove(model.gridGs))
        if(!octopus.canMove(model.gridGs)) {
            alert('Game over');
            return;
        }

        let nextGrid=model.emptyGrid();
        let curGrid=model.gridGs;
        switch(e.key){
            case 'ArrowLeft':
            nextGrid=octopus.moveLeft(model.gridGs);
            //octopus.clearGrid();
            model.gridGs=nextGrid;
            model.gridGs = (model.gridGs!==curGrid) ? octopus.createNumber(model.gridGs) : curGrid
            view.renderGrid()
            case 'ArrowUp':
                    nextGrid = octopus.moveUp(model.gridGs)
                    //octopus.clearGrid()
                    model.gridGs = nextGrid
                    model.gridGs = (model.gridGs!==curGrid) ? octopus.createNumber(model.gridGs) : curGrid
                    view.renderGrid()
                    break
            case 'ArrowRight':
                    nextGrid = octopus.moveRight(model.gridGs)
                   // octopus.clearGrid()
                    model.gridGs = nextGrid
                    model.gridGs = (model.gridGs!==curGrid) ? octopus.createNumber(model.gridGs) : curGrid
                    view.renderGrid()
                    break
                case 'ArrowDown':
                    nextGrid = octopus.moveDown(model.gridGs)
                    //octopus.clearGrid()
                    model.gridGs= nextGrid
                    model.gridGs = (model.gridGs!==curGrid) ? octopus.createNumber(model.gridGs) : curGrid
                    view.renderGrid()
                    break
            

        }

    }




}


let octopus= {
    createNumber: function(grid, number=2) {
        let emptyPositions = []
        for(let i = 0; i < 4; i++) {
            for(let j = 0; j < 4; j++) {
                if(grid[i][j] === 0) {
                    emptyPositions.push([i, j])
                }
            }
        }
        console.log(emptyPositions)
        if(emptyPositions.length === 0)
            return grid
        let chosen = Math.floor(Math.random()*emptyPositions.length)
        grid[emptyPositions[chosen][0]][emptyPositions[chosen][1]] = number
        return grid
    },
    canMove: function(originalGrid) {
        const grid = originalGrid;
        const grid1 = originalGrid;

        // JSON.parse(JSON.stringify(originalGrid))
        
       if(grid1 === this.moveDown(grid) && grid1 === this.moveLeft(grid) && grid1 === this.moveRight(grid) && grid1 === this.moveUp(grid)) {
            console.log('Cant move!')
            return false
        }
        console.log('Can move')
        return true
    },

    setScore: function(newScore) {
        model.score = newScore
        document.getElementById('result').innerText = model.score
    },
    resetGrid: function() {
        console.log('Resetting grid')
            
            console.log(model.gridGs)
            let grid = model.emptyGrid()
            // ? Why `octopus` here instead of `this`? Because this function is bound to a button before execution and creation of namespace
            octopus.setScore(0)
           
            
            model.gridGs = grid
            view.renderGrid()
            console.log('Grid reset')
    },
    
    clearGrid: function() {
        view.clearDOMGrid()
        model.gridGs = model.emptyGrid()
    },
    moveLeft: function(grid) {
        let newGrid = []
        for(let i = 0; i < 4; i++) {
            // console.log(`For i = ${i}`)
            let intermediateGridRow = [], gridRow = []
            for(let j = 0; j < 4; j++) {
                if(grid[i][j] !== 0) {
                    // console.log(`Found ${i} ${j}`)
                    intermediateGridRow.push(grid[i][j])
                }
            }
            // console.log(`IGR: ${intermediateGridRow}, sz: ${intermediateGridRow.length}`)
            while(intermediateGridRow.length > 1) {
                let first = intermediateGridRow.shift()
                let second = intermediateGridRow[0]
                // console.log(`F: ${first} S: ${second}`)
                if(first === second) {
                    gridRow.push(first*2)
                    // ? Why `this` here instead of `octopus`? Because the function has now executed
                    this.setScore(model.score + 2*first)
                    intermediateGridRow.shift()
                } else {
                    gridRow.push(first)
                }
            }
            if(intermediateGridRow.length) {
                // console.log(`Has IGR: ${intermediateGridRow}, sz: ${intermediateGridRow.length}`)
                gridRow.push(intermediateGridRow[0])
                intermediateGridRow.shift()
            }
            // console.log(`Length of row: ${gridRow.length}, gridRow: ${gridRow}`)
            while(gridRow.length < 4)
                gridRow.push(0)
            newGrid.push(gridRow)
            // console.log(`\n\n`)
        }
        // console.log(newGrid)
        return newGrid
    },
    moveRight: function(grid) {
        let reversedGrid = model.reverse(grid)
        reversedGrid = octopus.moveLeft(reversedGrid)
        reversedGrid = model.reverse(reversedGrid)
        return reversedGrid
    },
    moveUp: function(grid) {
        let transposedGrid = model.transpose(grid)
        transposedGrid = this.moveLeft(transposedGrid)
        transposedGrid = model.transpose(transposedGrid)
        return transposedGrid
    },
    moveDown: function(grid) {
        let transposedGrid = model.transpose(grid)
        transposedGrid = this.moveRight(transposedGrid)
        transposedGrid = model.transpose(transposedGrid)
        return transposedGrid
    }




}






view.init();
    document.addEventListener('keydown', view.keyhandler)

})();


var a=document.querySelector('a #GotoGame');

a.addEventListener('click',function(event){
    event.preventDefault();
    var target_achiever=setInterval(function(){
        var target=document.getElementById('main1').getBoundingClientRect();
        if(target.top<=0){
            clearInterval(target_achiever);
        }
        console.log(target);
        window.scrollBy(0,50);
    },20)
})
    




/***
 * original     //left          //right
 * 2 2 4 0      4 4 0 0         0 0 4 4                 2 2 4
 * 2 0 0 2       40 0 0         0 0 0 4                 2 2
 * 0 2 4 8      2 4 8 0         0 2 4 8                 2 4 8
 * 2 2 2 2
 * 
 * 2 2 2 0
 * 
 * 2 2 4 0  -reverse->  0 4 2 2  -left->   4 4 0 0 -reverse-> 0 0 4 4
 * 0 2 4 8  -reverse->  8 4 2 0  -left->   8 4 2 0 -reverse-> 0 2 4 8
 * 
 *              //up 
 * 2 2 4 0      4 4 8 2         0 0 4 4
 * 2 0 0 2      2 2 2 8         0 0 0 4
 * 0 2 4 8      0 0 0 2         0 2 4 8
 * 2 2 2 2      0 0 0 0
 * 
 * transpose    //left      //transpose
 * 2 2 0 2      4 2 0 0     4 4 8 2
 * 2 0 2 2      4 2 0 0     2 2 2 8
 * 4 0 4 2      8 2 0 0     0 0 0 2
 * 0 2 8 2      2 8 2 0     0 0 0 0
 */



