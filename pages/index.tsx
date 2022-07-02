import type { NextPage } from "next";
import { useEffect, useRef, useState, useCallback } from "react";

import {
    collisionB,
    collisionT,
    COLS,
    createAndFillTwoDArray,
    FPS,
    getNextCur,
    ROWS
} from "../Constants/utils";

// Pieces
import { I, J, L, O, S, T, Z } from "../Constants/pieces";

// Components
import {
    Container,
    FC,
    Flex,
    Level,
    Link,
    Matrix,
    Next,
    Score,
    Screen
} from "../Components";

// Interfaces and Types
import {
    moveDown,
    moveLeft,
    moveRight,
    moveUp,
    rotate
} from "../Constants/moves";

let pause: boolean = false;
let gameOver: boolean = false;
let cur: any = null;
let nextCur: any = null;

const Home: NextPage = () => {
    const requestRef = useRef<any>();
    const previousTimeRef = useRef<any>();

    const [drawEmpty, setDrawEmpty] = useState(false);

    const [score, setScore] = useState(0);
    const [m, setM] = useState(
        createAndFillTwoDArray({ rows: ROWS, cols: COLS, defaultValue: 0 })
    );

    const resetMatrix = () => {
        // resets the matrix for a new game, sets new current/next pieces
        // console.log(
        // "🚀 ~ file: index.tsx ~ line 72 ~ resetMatrix ~ resetMatrix",
        // resetMatrix
        // );
        const newM = m;

        if (!newM) return;

        for (let i = 0; i < ROWS; i++) {
            for (let j = 0; j < COLS; j++) {
                if (newM[i][j] !== 0) {
                    newM[i][j] = 0;
                }
            }
        }
        piecePipeLine();
        setM(newM);
        // console.log("matrix reset", m);
    };

    const clearSetLines = () => {
        // console.log(
        // "🚀 ~ file: index.tsx ~ line 105 ~ clearSetLines ~ clearSetLines",
        // clearSetLines
        // );

        let rowsToClear: any = [];

        for (let i = 0; i < ROWS; i++) {
            if (m[i].every((cell: any) => cell === 1)) {
                rowsToClear.push(i);
            }
        }

        if (!rowsToClear.length) return [];

        let newM: any = m;
        let clearM: any = m;

        while (rowsToClear.length) {
            let pad: any = [];
            // for each row to be cleared

            // pop the blank row
            // shift the preceding piece (values) forward by one row
            // add a blank row on top
            const rowToPop = rowsToClear.pop();
            const rowsAbove = newM.slice(0, rowToPop);

            const rowsBelow = newM.slice(rowToPop + 1, ROWS);
            for (let j = 0; j < COLS; j++) {
                pad.push(0);
            }

            clearM = [pad].concat(rowsAbove, rowsBelow);
        }
        console.log(clearM);
        //all rows to be cleared processed, set new matrix
        for (let i = 0; i < ROWS; i++) {
            newM[i] = clearM[i];
        }

        setM([...newM]);
    };

    const setFixedPieces = () => {
        // updates matrix to reprsenty settled pieces
        // console.log(
        // "🚀 ~ file: index.tsx ~ line 124 ~ setFixedPieces ~ setFixedPieces",
        // setFixedPieces
        // );

        const newM = m;

        if (!newM) return;

        for (let i = 0; i < ROWS; i++) {
            for (let j = 0; j < COLS; j++) {
                if (newM[i][j] !== 0) {
                    newM[i][j] = 1;
                }
            }
        }

        setM([...newM]);
        // console.log("setFixedPieces", m);
    };

    const updateCurPiece = () => {
        // updates the position of current piece
        // console.log(
        // "🚀 ~ file: index.tsx ~ line 144 ~ updateCurPiece ~ updateCurPiece",
        // updateCurPiece
        // );

        if (gameOver || !m.length || collisionT(m)) return;

        if (!cur) piecePipeLine();

        if (collisionB(m)) {
            // console.log("collided, getting new pieces", m);
            setFixedPieces();
            clearSetLines();
            piecePipeLine();
            return;
        } else {
            // console.log("moving down", m);
            moveDown(m, cur, updateMatrix);
            return;
        }
    };

    const updateMatrix = () => {
        // console.log(
        // "🚀 ~ file: index.tsx ~ line 186 ~ updateMatrix ~ updateMatrix",
        // updateMatrix
        // );
        //inserts current piece @ location

        if (gameOver || !cur || !m.length) return;

        // // console.log("update matrix", m);

        let newM: any = m;

        const pieceMap: any = {
            T: T(cur.posX, cur.posY, cur.rot),
            O: O(cur.posX, cur.posY, cur.rot),
            L: L(cur.posX, cur.posY, cur.rot),
            J: J(cur.posX, cur.posY, cur.rot),
            I: I(cur.posX, cur.posY, cur.rot),
            S: S(cur.posX, cur.posY, cur.rot),
            Z: Z(cur.posX, cur.posY, cur.rot)
        };

        for (let i = 0; i < COLS; i++) {
            for (let j = 0; j < ROWS; j++) {
                if (newM[j][i] !== 1) {
                    // cell is not settled, either current piece or empty
                    let piece = pieceMap[cur.name];
                    if (
                        JSON.stringify(piece).indexOf(JSON.stringify([i, j])) !=
                        -1
                    ) {
                        // show the piece
                        newM[j][i] = cur.name;
                    } else {
                        // clear piece trail
                        newM[j][i] = 0;
                    }
                }
            }
        }

        setM([...newM]);
        // // // // console.log("🚀 updateMatrix ~ newM", newM);
    };

    const piecePipeLine = () => {
        // sets current and next pieces
        // console.log(
        // "🚀 ~ file: index.tsx ~ line 197 ~ piecePipeLine ~ piecePipeLine",
        // piecePipeLine
        // );

        const c = getNextCur();
        cur = c;
        const nc = getNextCur();
        nextCur = nc;
        // console.log("next pieces set ", cur.name, nextCur.name);
        return;
    };

    const newGame = () => {
        // console.log("🚽 new game");
        return resetMatrix();
        // return piecePipeLine();
    };

    const gameLoop = (time: any) => {
        //TODO: optimise this https://gist.github.com/elundmark/38d3596a883521cb24f5
        setTimeout(() => {
            if (previousTimeRef.current != undefined) {
                if (!gameOver) {
                    if (!pause) {
                        updateCurPiece();
                    } else {
                        // // console.log("game paused");
                    }
                }
            }
            previousTimeRef.current = time;
            requestRef.current = requestAnimationFrame(gameLoop);
        }, 1000 / FPS);
    };

    const handleKeyboard = (event: any) => {
        // console.log(event.key);

        if (event.key === " ") {
            rotate(m, cur, updateMatrix);
        }

        if (event.key === "ArrowLeft") {
            moveLeft(m, cur, updateMatrix);
        }

        if (event.key === "ArrowRight") {
            moveRight(m, cur, updateMatrix);
        }

        if (event.key === "ArrowDown") {
            moveDown(m, cur, updateMatrix);
        }

        if (event.key === "ArrowUp") {
            rotate(m, cur, updateMatrix);
        }

        if (event.key === "p" || event.key === "P") {
            pause = !pause;
        }
    };

    useEffect(() => {
        console.log("render/begin");
        requestRef.current = requestAnimationFrame(gameLoop);
        return () => cancelAnimationFrame(requestRef.current);
    }, []);

    useEffect(() => {
        // console.log("new m rerender", m);
    }, [m]);

    return (
        <div className="App" onKeyDown={handleKeyboard} tabIndex={-1}>
            <Screen></Screen>
            <FC>
                <h1>
                    <i>
                        selectris<sup>TM</sup>
                    </i>
                    <br />
                    <Link>ゼロイーブン</Link>
                </h1>
            </FC>
            <Container>
                <Flex>
                    <button onClick={newGame}>New Game</button>
                    <button onClick={() => (pause = !pause)}>Pause</button>
                    <input
                        type={"checkbox"}
                        onChange={() => setDrawEmpty(!drawEmpty)}
                        checked={drawEmpty}
                    />
                    <button
                        onClick={() => {
                            // console.log(m, cur, nextCur);
                        }}
                    >
                        SCORE:500
                    </button>
                </Flex>
                {<Matrix matrix={m} drawEmpty={drawEmpty} />}
                <Flex>
                    <button onClick={() => rotate(m, cur, updateMatrix)}>
                        Rotate
                    </button>
                    <button onClick={() => moveLeft(m, cur, updateMatrix)}>
                        Left
                    </button>
                    <button onClick={() => moveRight(m, cur, updateMatrix)}>
                        Right
                    </button>
                    <button onClick={() => moveDown(m, cur, updateMatrix)}>
                        Down
                    </button>
                    <button onClick={() => moveUp(m, cur, updateMatrix)}>
                        Up
                    </button>
                </Flex>
            </Container>

            <hr />
            <Container>
                <Flex>
                    <Level>
                        <p>{FPS}</p>
                        <p>Level</p>
                    </Level>
                    <Next>{nextCur?.name}</Next>
                    <Score>
                        <p>{score}</p>
                        <p>Score</p>
                    </Score>
                </Flex>
            </Container>
        </div>
    );
};

export default Home;
