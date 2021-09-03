class ScrollBar{
    constructor(tableRenderer){
        this.barWidth = 20;
        this.tickerSize = 10;

        // this.view = undefined;
        this.header = undefined;
        this.childView = undefined;       
        this.viewWidth = undefined;
        this.viewHeight = undefined;
    
        this.childViewWidth = undefined;
        this.childViewHeight = undefined;
        this.verticalBar = undefined;
        this.horizontalBar = undefined;
        this.verticalTicker = undefined;
        this.outOfViewHeight = 0;
        
        this.verticalBarMouseMoveHandler = undefined;
        this.horizontalBarMouseMoveHandler = undefined;
        this.tableRenderer = tableRenderer;
        // this.wheelDown();
    }
    attachViews(view, header, childView, tableSize){
        // this.view = view;
        this.header = header;
        this.childView = childView;
        this.childViewWidth = tableSize.width;
        this.childViewHeight = tableSize.height;        

        this.computerWidthsAndHeights();
        this.addScrollBarAndTicker();
        this.bindMouseEvent();
    }
    computerWidthsAndHeights(){
        this.viewWidth = this.childView.offsetWidth;
        this.viewHeight = this.childView.offsetHeight;
        this.outOfViewWidth = Math.max(this.childViewWidth - this.viewWidth, 0);
        this.outOfViewHeight = Math.max(this.childViewHeight - this.viewHeight, 0);    
        console.log(this.viewWidth, this.viewHeight, this.outOfViewWidth, this.outOfViewHeight)
    }

    addScrollBarAndTicker(){
        let verticalBar = document.querySelector("#verticalBar");          
        verticalBar.style.width = this.barWidth - 2 + "px";
        verticalBar.style.height = this.viewHeight - 2 - this.barWidth + "px";
        verticalBar.style.left = this.viewWidth - this.barWidth + "px";

        this.verticalBar = verticalBar;

        let verticalTicker = document.querySelector("#verticalTicker");  
        verticalTicker.style.width = this.barWidth - 2 + "px";
        verticalTicker.style.height = this.tickerSize + "px";
        this.verticalTicker = verticalTicker;

        let horizontalBar = document.querySelector("#horizontalBar");  
        horizontalBar.style.width = this.viewWidth - this.barWidth - 2 + "px";
        horizontalBar.style.height = this.barWidth - 2 + "px";
        horizontalBar.style.top = this.viewHeight - this.barWidth + "px";
        
        this.horizontalBar = horizontalBar;

        let horizontalTicker = document.querySelector("#horizontalTicker");  
        horizontalTicker.style.width = this.tickerSize + "px";
        horizontalTicker.style.height = this.barWidth - 2 + "px";
        this.horizontalTicker = horizontalTicker;
    }

    bindMouseEvent(){
        this.verticalBarMouseMoveHandler = this.verticalBarMouseMove.bind(this);
        this.verticalBar.onmousedown = this.verticalBarOnMouseDown.bind(this);
        this.verticalBar.onclick = this.verticalBarOnclick.bind(this);

        this.horizontalBarMouseMoveHandler = this.horizontalBarMouseMove.bind(this);
        this.horizontalBar.onmousedown = this.horizontalBarOnMouseDown.bind(this);
        this.horizontalBar.onclick = this.horizontalBarOnclick.bind(this);

        this.wheelMoveHandler = this.wheelMove.bind(this);
        this.remmoveListenerHander = this.remmoveListener.bind(this);
    }
    verticalBarOnclick(e){
        this.verticalBarTicker(e.pageY - 50);
    }
    verticalBarMouseMove(e) {
        this.verticalBarTicker(e.pageY - 50);
        e.preventDefault();
    }
    verticalBarOnMouseDown(){
        document.querySelector("#verticalBar").addEventListener("mousemove", this.verticalBarMouseMoveHandler, false);
    }  
    verticalBarOnMouseUp(){
        document.querySelector("#verticalBar").removeEventListener("mousemove", this.verticalBarMouseMoveHandler, false);
    }
    verticalBarTicker(tickerPosition) {       
        tickerPosition = Math.min(tickerPosition, this.viewHeight - this.tickerSize - this.barWidth);
        tickerPosition = Math.max(0, tickerPosition);
        
        this.verticalTicker.style.top = tickerPosition + "px";    
        let verticalPercentage = tickerPosition / this.viewHeight;    
        let verticalMove = verticalPercentage * this.outOfViewHeight;
        this.childView.style.top = -1 * verticalMove + "px";        
        
        this.tableRenderer.renderRow(verticalMove, verticalMove + this.viewHeight);
    }
    wheelMove(dY){
        this.verticalBarTicker(this.verticalTicker.offsetTop+dY)
    }

    horizontalBarOnclick(e){
        this.verticalBarTicker(e.clientX);
    }
    horizontalBarMouseMove(e){
        this.horizontalBarTicker(e.clientX - 10);
        e.preventDefault();
    }
    horizontalBarOnMouseDown(){
        document.querySelector("#horizontalBar").addEventListener("mousemove", this.horizontalBarMouseMoveHandler, false);
    }
    horizontalBarOnMouseUp(){
        document.querySelector("#horizontalBar").removeEventListener("mousemove", this.horizontalBarMouseMoveHandler, false);
    }

    horizontalBarTicker(tickerPosition) {        
        tickerPosition = Math.min(tickerPosition, this.viewWidth - this.tickerSize - this.barWidth - 2);
        tickerPosition = Math.max(0, tickerPosition);  

        this.horizontalTicker.style.left = tickerPosition + "px";    
        let horizontalPercentage = tickerPosition / this.viewWidth;    
        let horizontalMove = horizontalPercentage * this.outOfViewWidth;
        this.childView.style.left = -1 * horizontalMove + "px"; 
        this.header.style.left = -1 * horizontalMove + "px"; 
   
        this.tableRenderer.renderCol(horizontalMove, horizontalMove + this.viewWidth);
    }
    remmoveListener(e){
        this.horizontalBarOnMouseUp();
        this.verticalBarOnMouseUp();
    }
    
}