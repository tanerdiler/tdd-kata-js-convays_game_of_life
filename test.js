var chai        = require('chai');

chai.should();


describe( "Convay's Game Of Life\n", function() {

    var convaysgame = require('./convaysgame');

    describe("The universe of the Game of Life is an infinite two-dimensional orthogonal grid of square cells that", function () {

        it("should give count of cell on the board", function () {
            var board = convaysgame.aBoard(5, 5);
            board.getCountOfCells().should.equal(25);
        });

        it("should create board with dead cells", function () {
            var board = convaysgame.aBoard(2,2);
            board.getCountOfDeadCells().should.equal(4);
        });

        it("should sign a cell as alive", function () {
            var board = convaysgame.aBoard(2,2);
            board.signCellAsAlive(1,1);
            board.signCellAsAlive(0,0);
            board.getCountOfAliveCells().should.equal(2);
        });

        it("should sign a cell as dead", function () {
            var board = convaysgame.aBoard(2,2);
            board.signCellAsAlive(0,0);
            board.signCellAsAlive(0,1);
            board.signCellAsAlive(1,0);
            board.signCellAsAlive(1,1);
            board.getCountOfAliveCells().should.equal(4);
            board.signCellAsDead(0,1);
            board.signCellAsDead(1,0);
            board.getCountOfDeadCells().should.equal(2);
        });

        it("should prevent changing status of a cell after freezing board", function () {
            var failed = false;
            var board = convaysgame.aBoard(2,2);
            board.signCellAsAlive(0,0);
            board.signCellAsAlive(0,1);
            board.signCellAsAlive(1,0);
            board.signCellAsAlive(1,1);
            board.freeze();
            try {
                board.signCellAsDead(0,0);
            }
            catch(err){
                failed = true;
                //err.should.equal(new FrozenBoardException("You can't change any cell state after starting game."));
            }
            failed.should.equal(true);
        });

        it("should get size of population around the cell", function()
        {
            var board = convaysgame.aBoard(3,3);
            board.signCellAsAlive(0,0);
            board.signCellAsAlive(2,2);
            board.getPopulationSizeOfCell(1,1).should.equal(2);
        });

        it("should not try to interact to non-exist cells if the cell is on edge", function()
        {
            var board = convaysgame.aBoard(3,3);
            board.signCellAsAlive(0,1);
            board.signCellAsAlive(1,0);
            board.signCellAsAlive(1,1);
            board.getPopulationSizeOfCell(0,0).should.equal(3);
        });

        it("should throw exception unless cell exists on the coordinate", function()
        {
            var board = convaysgame.aBoard(3,3);
            board.signCellAsAlive(0,1);
            board.signCellAsAlive(1,0);
            board.signCellAsAlive(1,1);
            board.getPopulationSizeOfCell(-1,-1).should.equal(0);
        })

        it("should not count the cell specified", function()
        {
            var board = convaysgame.aBoard(3,3);
            board.signCellAsAlive(0,0);
            board.signCellAsAlive(0,1);
            board.signCellAsAlive(1,0);
            board.signCellAsAlive(1,1);
            board.getPopulationSizeOfCell(0,0).should.equal(3);
        })
    });

    describe("An alive cell", function() {
        it("will be dead if it don't have neighbours", function () {
            var board = convaysgame.aBoard(3,3);
            board.signCellAsAlive(1, 1);
            var game = convaysgame.aNew().withBoard(board).get();
            game.iterate();
            game.isCellDead(1, 1).should.equal(true);
        })

        it("will be dead if it has only one neighbour", function () {
            var board = convaysgame.aBoard(3,3);
            board.signCellAsAlive(0, 0);
            board.signCellAsAlive(1, 1);
            var game = convaysgame.aNew().withBoard(board).get();
            game.iterate();
            game.isCellDead(0, 0).should.equal(true);
            game.isCellDead(1, 1).should.equal(true);
        })

        it("will be dead if it has more than three neighbours", function () {
            var board = convaysgame.aBoard(3,3);
            board.signCellAsAlive(0, 0);
            board.signCellAsAlive(0, 1);
            board.signCellAsAlive(0, 2);
            board.signCellAsAlive(1, 0);
            board.signCellAsAlive(1, 1);
            var game = convaysgame.aNew().withBoard(board).get();
            game.iterate();
            game.isCellDead(0, 1).should.equal(true);
            game.isCellDead(1, 1).should.equal(true);
        })
    });

    describe("A dead cell", function() {
        it("will come to life if it has three neighbours", function(){
            var board = convaysgame.aBoard(3,3);
            board.signCellAsAlive(0,0);
            board.signCellAsAlive(0,1);
            board.signCellAsAlive(1,1);
            var game = convaysgame.aNew().withBoard(board).get();
            game.iterate();
            game.isCellAlive(1,0).should.equal(true);
        })
    })

    it("should kill or revive cells on each iteration", function() {
        var board = convaysgame.aBoard(3,3);
        board.signCellAsAlive(1, 0);
        board.signCellAsAlive(1, 1);
        board.signCellAsAlive(1, 2);
        var game = convaysgame.aNew().withBoard(board).get();
        game.iterate();
        game.isCellDead(1, 0).should.equal(true);
        game.isCellDead(1, 2).should.equal(true);
        game.isCellAlive(0, 1).should.equal(true);
        game.isCellAlive(2, 1).should.equal(true);
        game.iterate();
        game.isCellDead(0, 1).should.equal(true);
        game.isCellDead(2, 1).should.equal(true);
        game.isCellAlive(1, 0).should.equal(true);
        game.isCellAlive(1, 2).should.equal(true);
    })

    it("should iterate as much as specified ", function() {
        var board = convaysgame.aBoard(3,3);
        board.signCellAsAlive(1, 0);
        board.signCellAsAlive(1, 1);
        board.signCellAsAlive(1, 2);
        var game = convaysgame.aNew().withBoard(board).get();
        var result = game.start(3);
        result.getHowManyCellsKilled().should.equal(6);
        result.getHowManyCellsRevived().should.equal(6);

    })
});