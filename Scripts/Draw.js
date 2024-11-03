let WidthResIn = document.getElementById("WidthRes")
let HeightResIn = document.getElementById("HeightRes")
let ColorIn = document.getElementById("Color")
let Canvas = document.getElementById("Screen")
let Context = Canvas.getContext('2d')

let Pixels = {}

let rect
let scaleX
let scaleY

let MouseX
let MouseY

WidthResIn.value = 1
HeightResIn.value = 1

function SetRectSize(){
    rect = Canvas.getBoundingClientRect()
    scaleX = rect.width/Canvas.width;
    scaleY = rect.height/Canvas.height;
}
SetRectSize()

function SetMousePosition(Event){
    MouseX = (Event.clientX - rect.left) / scaleX
    MouseY = (Event.clientY - rect.top) / scaleY
}

function DrawSqaures(){
    Context.clearRect(0,0,Canvas.width,Canvas.height)
    let currentX = 0
    let XmoveIndex = Math.ceil(400/WidthResIn.value)
    let YmoveIndex = Math.ceil(400/HeightResIn.value)
    for(let xindex=0; xindex<WidthResIn.value;xindex++){
        let currentY = 0
        for(let yindex=0;yindex<HeightResIn.value;yindex++){
            if(Pixels[`${xindex},${yindex}`] != "blank"){
                Context.fillStyle = Pixels[`${xindex},${yindex}`]
                Context.fillRect(currentX,currentY,XmoveIndex,YmoveIndex)
            }
            currentY+=YmoveIndex
        }
        currentX+=XmoveIndex
    }
    
}

function SizeChange(){
    Pixels = {}
    for(let x=0;x<WidthResIn.value;x++){
        for(let y=0;y<HeightResIn.value;y++){
            Pixels[`${x},${y}`] = "blank"
        }
    }
    console.log(Pixels)
    DrawSqaures()
}

function DrawPixel(){
    let LocXMultiplier = WidthResIn.value/400
    let LocYMultiplier = HeightResIn.value/400
    let SelectX = Math.floor(MouseX*LocXMultiplier)
    let SelectY = Math.floor(MouseY*LocYMultiplier)
    Pixels[`${SelectX},${SelectY}`] = ColorIn.value
    console.log(`${SelectX},${SelectY}`)
    DrawSqaures()
}

window.addEventListener("mousemove", (Event) => {
    SetMousePosition(Event)
})
Canvas.addEventListener('mouseup', DrawPixel)

window.addEventListener('resize', SetRectSize)
WidthResIn.addEventListener('input', SizeChange)
HeightResIn.addEventListener('input', SizeChange)
SizeChange()