const grid = document.querySelector(".grid");
let squares = Array.from(document.querySelectorAll(".grid div"));
const score = document.getElementById("score");
const startBtn = document.getElementById("start-button");
const btnImg = document.getElementById("btnimg");
let count= 0;
const width = 10;

//arrow buttons 

let leftbtn = document.getElementById("left");
let rightbtn = document.getElementById("right");
let downbtn = document.getElementById("down");
let rotatebtn = document.getElementById("rotate");

//for diff colors

const colour = [
    "red",
    "blue",
    "pink",
    "yellow",
    "purple"
]


//rough code for printing index
/* for (i=0;i<200;i++)
{
    squares[i].textContent=count;
    count++;
} */

//shapes
const lshape = [
    [1,width+1,width*2+1,2],
    [width, width+1, width+2, width*2+2],
    [1,width+1,width*2+1,width *2],
    [width, width*2, width*2+1, width*2+2] 
]

const zshape =[
    [width+1, width+2, width*2, width*2+1],
    [0, width, width+1, width*2+1],
    [width+1, width+2, width*2, width*2+1],
    [0, width, width+1, width*2+1]
]

const tshape = [
    [1, width, width+1, width+2],
    [1, width+1, width+2, width*2+1],
    [width, width+1, width+2, width*2+1],
    [1, width, width+1, width*2+1]
]

const oshape = [
    [0, 1, width, width+1],
    [0, 1, width, width+1],
    [0, 1, width, width+1],
    [0, 1, width, width+1]
]

const ishape = [
    [1, width+1, width*2+1, width*3+1],
    [width, width+1, width+2, width+3],
    [1, width+1, width*2+1, width*3+1],
    [width, width+1, width+2, width+3]
]

const theShapes = [lshape, zshape,  oshape, tshape,ishape]

let currentPosition = 4;
let currentRotation = 0;

let random = Math.floor(Math.random()*theShapes.length) //shape selection randomly betn 0-4
let currentShapes = theShapes[random][currentRotation]

//draw the shapes
function draw() 
{
    currentShapes.forEach((index)=> {
        squares[currentPosition + index].style.background = colour[random]
    })
}
draw()

//erase shape
function erase()
{
    currentShapes.forEach((index)=> {
        squares[currentPosition + index].style.background = ''
    }) 
}

//movedown
function moveDown()
{
    erase()
    currentPosition += width;
    draw()
    stop()
}

var timer = setInterval(moveDown, 1000)

//stop the shape
function stop()
{
    if(currentShapes.some(index => squares[currentPosition + index + width].classList.contains('freeze')))
    {
        currentShapes.forEach(index => squares[currentPosition + index].classList.add('freeze'))


        //start a new shape 
        random = Math.floor(Math.random()*theShapes.length)
        currentRotation = 0
        currentShapes = theShapes[random][currentRotation]
        currentPosition = 4

        draw()
        gameOver()
        addScore()

    }
}

//to control the game
function control(e)
{
    if(e.keyCode === 37) //37 is the keycode of left arrow
    {
        moveLeft()
    }

    else if(e.keyCode === 39) //3+ is the keycode of right arrow
    {
        moveRight()
    }
    else if (e.keyCode === 40)
    {
        moveDown()
    }
    else if (e.keyCode === 32) //spacebar for rotation
    {
        rotate()
    }
}

window.addEventListener("keydown",control);

// controls in mobile

leftbtn.addEventListener("click",moveLeft)
rightbtn.addEventListener("click", moveRight)
downbtn.addEventListener("click", moveDown)
rotatebtn.addEventListener("click", rotate)

function moveLeft()
{
    erase()

    let LeftBlockage = currentShapes.some(index  => (currentPosition + index) % width === 0)
    let Blockage = currentShapes.some(index => squares[currentPosition + index -1].classList.contains('freeze'))

    if(!LeftBlockage && !Blockage)
    {
        currentPosition--;
    }
    
    draw()
}

function moveRight()
{
    erase()

    let RightBlockage = currentShapes.some(index  => (currentPosition + index) % width === width - 1)
    let Blockage = currentShapes.some(index => squares[currentPosition + index  + 1].classList.contains('freeze'))

    if(!RightBlockage && !Blockage)
    {
        currentPosition++;
    }
    
    draw()
}

//rotate funtion
function rotate()
{
    erase()
    currentRotation++;
    if(currentRotation === 4)
    {
        currentRotation = 0
    }
      currentShapes = theShapes[random][currentRotation]
    draw()
}

// pause functionality

function pause()
{
    if(timer)
    {
        clearInterval(timer)
        timer = null;
        btnImg.src = "play.png";
    }
    else 
    {
        draw()
        timer = setInterval(moveDown, 1000);
        btnImg.src = "pause.png";
    }
}

startBtn.addEventListener("click",pause)

//GameOver 

function gameOver()
{
    if(currentShapes.some(index => squares[currentPosition + index].classList.contains('freeze')))
    {
        score.innerHTML = "Game Over"
        clearInterval(timer)
    }
}

//Adding Score

function addScore()
{
    for (let i=0; i<199; i+=width)
    {
        const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]

        if(row.every(index => squares[index].classList.contains("freeze")))
        {
            count+=10;
            score.textContent = `score.${count}`
            row.forEach(index => {
                squares[index].classList.remove("freeze")
                squares[index].style.background = '';
            })
            const squareRemoved = squares.splice(i,width)
            squares = squareRemoved.concat(squares)
            squares.forEach(square => grid.appendChild(square))
        }
    }
}

