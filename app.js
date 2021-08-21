document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".grid");
  let squares = Array.from(document.querySelectorAll(".grid div"));
  const scoreDisplay = document.querySelector("#score");
  const startBtn = document.querySelector("#start-button");
  const width = 10;
  let nextRandom = 0
  let timerId
  let score = 0
  const colors = [
    'darkblue','orange','lightgreen','red','purple','yellow','lightblue'

  ]
  
  //tetrominoes
  const teJ = [
    [width*2,1,width+1,width*2+1],
    [width, width*2, width*2 + 1, width * 2 + 2],
    [0, width, width*2,1],
    [width,width+1,width+2,width*2+2],
  ];
  const teL = [
    [1, width + 1, width * 2 + 1, width * 2 + 2],
    [width , width * 2 , width + 1, width + 2],
    [0, 1, width+1, width * 2 + 1],
    [width*2, width *2+1, width + 2, width*2 + 2],
  ];
  const teS = [
    [width * 2, width + 1, width * 2 + 1, width + 2],
    [0, width, width + 1, width * 2 + 1],
    [width * 2, width + 1, width * 2 + 1, width + 2],
    [0, width, width + 1, width * 2 + 1],
  ];
  const teZ = [
    [width, width + 1, width * 2 + 1, width * 2 + 2],
    [width+1,width*2+1,2,width+2],
    [width, width + 1, width * 2 + 1, width * 2 + 2],
    [width+1,width*2+1,2,width+2],
  ];
  const teT = [
    [width, 1, width + 1, width + 2],
    [1, width + 1, width * 2 + 1, width + 2],
    [width, width + 1, width * 2 + 1, width + 2],
    [width, 1, width + 1, width * 2 + 1],
  ];
  const teO = [
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
  ];
  const teI = [
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
  ];
  const theTetrominoes = [teJ, teL, teS, teZ, teT, teO, teI];

  let currentPosition = 4;
  let currrentRotation = 0;
  //隨機選擇第一個出現的方塊
  let randomRot = Math.floor(Math.random() * 3);
  let randomTrs = Math.floor(Math.random() * theTetrominoes.length);
  let current = theTetrominoes[randomTrs][currrentRotation];

  //顯示第一個出現的方塊以及樣式
  function show() {
    current.forEach((index) => {
      squares[currentPosition + index].classList.add("tetromino")
      squares[currentPosition + index].style.backgroundColor = colors[randomTrs]
    })
  }

  function unShow() {
    current.forEach((index) => {
      squares[currentPosition + index].classList.remove("tetromino")
      squares[currentPosition + index].style.backgroundColor = ''
    });
  }
  //方塊下降的速度
  // timerId = setInterval(moveDown, 1000);
  //增加按鍵功能
  function control(e) {
    if (e.keyCode === 37) {
      moveLeft();
    } else if (e.keyCode === 38) {
     rotate();
    } else if (e.keyCode === 39) {
      moveRight();
    } else if (e.keyCode === 40) {
      moveDown();
    } 
  }
  document.addEventListener("keydown", control);

  function moveDown() {
    unShow();
    currentPosition += width;
    show();
    freeze();
  }

  //方塊到底之後停住
  function freeze() {
    if (
      current.some((index) =>
        squares[currentPosition + index + width].classList.contains("taken")
      )
    ) {
      current.forEach((index) =>
        squares[currentPosition + index].classList.add("taken")
      );
      //要再丟一個新方塊
      randomTrs = nextRandom
      nextRandom = Math.floor(Math.random() * theTetrominoes.length);
      current = theTetrominoes[randomTrs][randomRot];
      currentPosition = 4;
      show();
      displayShape();
      addScore()
      gameOver()
    }
  }
  //方塊到左邊邊界的時候不會自動跑到最右邊
  function moveLeft() {
    unShow();
    const isAtLeftEdge = current.some(
      (index) => (currentPosition + index) % width === 0
    );

    if (!isAtLeftEdge) currentPosition -= 1;
    if (
      current.some((index) =>
        squares[currentPosition + index].classList.contains("taken")
      )
    )
      currentPosition += 1;
    show();
  }
  //方塊到右邊邊界的時候不會自動跑到最左邊
  function moveRight() {
    unShow();
    const isAtRightEdge = current.some(
      (index) => (currentPosition + index) % width === width-1
    );

    if (!isAtRightEdge) currentPosition += 1;
    if (
      current.some((index) =>
        squares[currentPosition + index].classList.contains("taken")
      )
    )
      currentPosition -= 1;
    show();}
//設定方塊旋轉
function rotate(){
    unShow()
    currrentRotation++
    if(currrentRotation===current.length){
        currrentRotation=0;
    }
    current = theTetrominoes[randomTrs][currrentRotation]
    show()
}
//顯示下一個出現的方塊
const displaySquares = document.querySelectorAll('.miniGrid div')
const displayWidth =4
let displayIndex = 0

//所有可能會出現的方塊
const nextTrs = [[displayWidth*2,1,displayWidth+1,displayWidth*2+1],
[1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 2 + 2],
[displayWidth * 2, displayWidth + 1, displayWidth * 2 + 1, displayWidth + 2],
[displayWidth, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 2 + 2],
[displayWidth, 1, displayWidth + 1, displayWidth + 2],
[0, 1, displayWidth, displayWidth + 1],
[1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1]
] 

//顯示下一個形狀的在右上角的方格
function displayShape(){
  displaySquares.forEach(square=>{
    square.classList.remove("tetromino")
    square.style.backgroundColor=''
  })
  nextTrs[nextRandom].forEach(index=>{
    displaySquares[displayIndex+index].classList.add("tetromino")
    displaySquares[displayIndex+index].style.backgroundColor = colors[nextRandom]
  })
}
//增加按鍵開始暫停的功能
startBtn.addEventListener('click',()=>{
  if(timerId){
    clearInterval(timerId)
    timerId = null
  }else{
    show()
    timerId = setInterval(moveDown,1000)
    nextRandom = Math.floor(Math.random()*theTetrominoes.length)
    displayShape()
  }
})

//計分
function addScore(){
  for(let i = 0;i<199;i+=width){
    const row = [i,i+1,i+2,i+3,i+4,i+5,i+6,i+7,i+8,i+9]

    if(row.every(index=>squares[index].classList.contains('taken'))){
      score +=10
      scoreDisplay.innerHTML=score
      row.forEach(index=>{
        squares[index].classList.remove('taken')
        squares[index].classList.remove('tetromino')
        squares[index].style.backgroundColor =''
      })
      const squaresRemoved = squares.splice(i,width)
      squares = squaresRemoved.concat(squares)
      squares.forEach(cell=>grid.appendChild(cell))

    }
  }
}
//遊戲結束
function gameOver(){
  if(current.some(index=>squares[currentPosition+index].classList.contains('taken'))){
    
    alert(`Game Over!!!\nScore:${scoreDisplay.innerHTML}`)
    clearInterval(timerId)
  }
}




});
