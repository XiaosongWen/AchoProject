class ScrollBar01{
    constructor(name, renderer, isVertical, cellSize){
        this.name = name;
        this.bar = document.querySelector(name);
        this.ticker = this.bar.querySelector(".ticker");
        this.tableRenderer = renderer;
        this.isVertical = isVertical;
        this.cellSize = cellSize;

        this.mouseMoveHandler = this.mouseMove.bind(this);
        this.bar.onmousedown = this.onMouseDown.bind(this);
        this.bar.onclick = this.onclick.bind(this);
        this.remmoveListenerHander = this.remmoveListener.bind(this);

        if (isVertical){
            this.wheelMoveHandler = this.wheelMove.bind(this);
        }
    }
    mouseMove(e){
        if (this.isVertical){
            this.setTickerPos(e.clientY-50);
        }else{
            this.setTickerPos(e.clientX-20);
        }
        e.preventDefault();
    }
    onclick(e){
        if (this.isVertical){
            this.setTickerPos(e.clientY-50);
        }else{
            this.setTickerPos(e.clientX-20);
        }
    }
    onMouseDown(){
        this.bar.addEventListener("mousemove", this.mouseMoveHandler, false);
    }
    onMouseUp(){
        this.bar.removeEventListener("mousemove", this.mouseMoveHandler, false);
    }
    remmoveListener(){
        this.onMouseUp();
    }
    wheelMove(dy){        
        this.setTickerPos(this.ticker.offsetTop+dy)
    }
    
    setTickerPos(pos){
        pos = Math.max(0, pos);
        let max = 0;
        if (this.isVertical){
            max = this.bar.clientHeight - this.ticker.clientHeight;
            pos = Math.min(pos, max);
            this.ticker.style.top = pos + "px";
        }else{
            max = this.bar.clientWidth - this.ticker.clientWidth;
            pos = Math.min(pos, max);
            this.ticker.style.left = pos + "px";
        }
        let percentage = pos / max;
        this.tableRenderer.renderTable(percentage, this.isVertical);
    }
}