'use strict';

var FrozenBoardException = function()
{
}

var Cell = function(row, col)
{
    var alive = false;

    this.isDead = function()
    {
        return !alive;
    }

    this.isAlive = function()
    {
        return alive;
    }

    this.die = function()
    {
        alive = false;
    }

    this.comeToLife = function () {
        alive = true;
    }

    this.getColumn = function()
    {
        return col;
    }

    this.getRow = function()
    {
        return row;
    }
}

var Board = function(rowCount, columnCount)
{
    var grid = [];
    var frozen = false;

    for(var row=0; row<rowCount;row++){
        grid[row] = [];
        for(var col=0; col<columnCount;col++){
            grid[row][col] = new Cell(row, col);
        }
    }

    this.isCellDead = function(row, col)
    {
        return grid[row][col].isDead();
    }

    this.isCellAlive = function(row, col)
    {
        return grid[row][col].isAlive();
    }

    this.getCountOfCells = function()
    {
        return rowCount * columnCount;
    }

    this.signCellAsAlive = function(row, col)
    {
        if (frozen)
        {
            throw new FrozenBoardException();
        }
        grid[row][col].comeToLife();
    }

    this.signCellAsDead = function(row, col)
    {
        if (frozen)
        {
            throw new FrozenBoardException();
        }
        grid[row][col].die();
    }

    this.getCountOfDeadCells = function()
    {
        var counter = 0;
        for (var row in  grid)
        {
            for(var col in grid[row]){
                if(grid[row][col].isDead())
                {
                    counter++;
                }
            }
        }
        return counter;
    }

    this.getCountOfAliveCells = function()
    {
        var counter = 0;
        for (var row in  grid)
        {
            for(var col in grid[row]){
                if(grid[row][col].isAlive())
                {
                    counter++;
                }
            }
        }
        return counter;
    }

    this.forEachCell = function(fnc)
    {
        for (var row in  grid)
        {
            for(var col in grid[row]){
                var cell = grid[row][col];
                fnc(cell);
            }
        }
    }

    this.isOutOfBounds = function(row, col)
    {
        return (row < 0 || row>(rowCount-1))
        || (col < 0 || col>(columnCount-1));
    }

    this.getPopulationSizeOfCell = function(row, col)
    {
        var size = 0;
        for(var rowIndex = row-1; rowIndex <= row+1;rowIndex++ )
        {
            for(var colIndex = col-1; colIndex <= col+1;colIndex++ )
            {
                if(this.isOutOfBounds(rowIndex, colIndex)
                    || (rowIndex == row && colIndex == col))
                {
                    continue;
                }
                var adjacentCell = grid[rowIndex][colIndex];
                size += adjacentCell.isAlive()?1:0;
            }
        }
        return size;
    }

    this.freeze = function()
    {
        frozen = true;
    }
}

var Result = function()
{
    var numberOfCellsKilled = 0;
    var numberOfCellsRevived = 0;

    this.incAsMuchAsResult = function(otherResult)
    {
        this.incNumberOfCellsKilled(otherResult.getHowManyCellsKilled());
        this.incNumberOfCellsRevived(otherResult.getHowManyCellsRevived());
    }

    this.incNumberOfCellsKilled = function(count)
    {
        numberOfCellsKilled += count;
    }

    this.incNumberOfCellsRevived = function(count)
    {
        numberOfCellsRevived += count;
    }

    this.getHowManyCellsKilled = function()
    {
        return numberOfCellsKilled;
    }
    this.getHowManyCellsRevived = function()
    {
        return numberOfCellsRevived;
    }
}

var Game = function(board)
{
    this.isCellDead = function(row, col)
    {
        return board.isCellDead(row, col);
    }

    this.isCellAlive = function(row, col)
    {
        return board.isCellAlive(row, col);
    }

    this.start = function(iterationCount)
    {
        var result = new Result();
        var iteration = 0;
        while(iteration<iterationCount)
        {
            var iterationResult = this.iterate();
            result.incAsMuchAsResult(iterationResult);
            iteration++;
        }
        return result;
    }

    this.iterate = function()
    {
        var result = new Result();
        var cellsWillBeDead = [];
        var cellsWillComeToLife = [];
        board.forEachCell(function(cell){
            var populationSize = board.getPopulationSizeOfCell(cell.getRow(), cell.getColumn());
            if(cell.isAlive() && (populationSize < 2 || populationSize > 3))
            {
                cellsWillBeDead.push(cell);
            }
            else if (cell.isDead() && populationSize == 3)
            {
                cellsWillComeToLife.push(cell);
            }
        });
        for(var index in cellsWillBeDead){
            cellsWillBeDead[index].die();
        }
        for(var index in cellsWillComeToLife)
        {
            cellsWillComeToLife[index].comeToLife();
        }
        result.incNumberOfCellsKilled(cellsWillBeDead.length)
        result.incNumberOfCellsRevived(cellsWillComeToLife.length)
        return result;
    }
}

var GameBuilder = function()
{
    var _board;
    this.withBoard = function(board)
    {
        _board = board;
        return this;
    }
    this.get = function()
    {
        return new Game(_board);
    }
}

module.exports = {
    aBoard: function(rowCount, columnCount){return new Board(rowCount, columnCount)},
    aNew: function(){
        return new GameBuilder();
    }
};