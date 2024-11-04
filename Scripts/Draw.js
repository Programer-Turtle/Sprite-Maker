let WidthResIn = document.getElementById("WidthRes")
let HeightResIn = document.getElementById("HeightRes")
let ColorIn = document.getElementById("Color")
let ModeIn = document.getElementById('Mode')
let Canvas = document.getElementById("Screen")
let Context = Canvas.getContext('2d')
let NameIn = document.getElementById("Name")

let Pixels = {}

let rect
let scaleX
let scaleY

let MouseX
let MouseY
let PrevHover = null

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
    DrawSqaures()
}

function DrawPixel(Event){
    if(Event.button == 0){
        let LocXMultiplier = WidthResIn.value/400
        let LocYMultiplier = HeightResIn.value/400
        let SelectX = Math.floor(MouseX*LocXMultiplier)
        let SelectY = Math.floor(MouseY*LocYMultiplier)
        let Mode = ModeIn.value
        if(Mode == "pen"){
            Pixels[`${SelectX},${SelectY}`] = ColorIn.value
        }
        else if(Mode == "eraser"){
            Pixels[`${SelectX},${SelectY}`] = "blank"
        }

        DrawSqaures()
    }
    else if(Event.button == 2){
        let LocXMultiplier = WidthResIn.value/400
        let LocYMultiplier = HeightResIn.value/400
        let SelectX = Math.floor(MouseX*LocXMultiplier)
        let SelectY = Math.floor(MouseY*LocYMultiplier)
        Pixels[`${SelectX},${SelectY}`] = "blank"

        DrawSqaures()
    }
}

function DrawOnePixelToScreen(x,y,color){
    let XmoveIndex = Math.ceil(400/WidthResIn.value)
    let YmoveIndex = Math.ceil(400/HeightResIn.value)
    if(color != "blank"){
        Context.fillStyle = color
        Context.fillRect(x*XmoveIndex,y*YmoveIndex,XmoveIndex,YmoveIndex)
    }
    else{
        Context.clearRect(x*XmoveIndex,y*YmoveIndex,XmoveIndex,YmoveIndex )
    }
    return
}

function Export(){
    let blob = new Blob([JSON.stringify(Pixels)], { type: 'text/plain' })
    let link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `${NameIn.value}.json`
    link.click()

    setTimeout(() => URL.revokeObjectURL(link.href), 100);
}

Canvas.addEventListener("mousemove", (Event) => {
    SetMousePosition(Event)

    let LocXMultiplier = WidthResIn.value/400
    let LocYMultiplier = HeightResIn.value/400
    let SelectX = Math.floor(MouseX*LocXMultiplier)
    let SelectY = Math.floor(MouseY*LocYMultiplier)
    if(PrevHover == null || SelectX != PrevHover[0] || SelectY != PrevHover[1]){
        if(PrevHover!=null){
            DrawOnePixelToScreen(PrevHover[0],PrevHover[1],Pixels[`${PrevHover[0]},${PrevHover[1]}`])
        }
        PrevHover = [SelectX,SelectY]

        DrawOnePixelToScreen(SelectX,SelectY, ColorIn.value+"62")
    }
})
Canvas.addEventListener('mouseup', (Event)=>{
    DrawPixel(Event)
})

Canvas.addEventListener('contextmenu', (Event)=>{
    Event.preventDefault()
})

Canvas.addEventListener('resize', SetRectSize)
WidthResIn.addEventListener('input', SizeChange)
HeightResIn.addEventListener('input', SizeChange)
SizeChange()