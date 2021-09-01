class ScrollBar{
    constructor(tableRenderer){
        this.barWidth = 20;
        this.tickerSize = 10;

        this.view = undefined;
        this.childView = undefined;       
        this.viewWidth = undefined;
        this.viewHeight = undefined;
    
        this.childViewWidth = undefined;
        this.childViewHeight = undefined;
        this.verticalBar = undefined;
        this.horizontalBar = undefined;
        this.verticalTicker = undefined;
        this.tickerPosition = 0;
        this.outOfViewHeight = 0;
        
        this.verticalBarMouseMoveHandler = undefined;
        this.tableRenderer = tableRenderer;
    }
    attachViews(view, childView, tableSize){
        this.view = view;
        this.childView = childView;
        this.childViewWidth = tableSize.width;
        this.childViewHeight = tableSize.height;        

        this.computerWidthsAndHeights();
        this.addScrollBarAndTicker();
        this.bindMouseEvent();
    }
    computerWidthsAndHeights(){
        this.viewWidth = this.view.offsetWidth;
        this.viewHeight = this.view.offsetHeight;        
        this.outOfViewWidth = Math.max(this.childViewWidth - this.viewWidth, 0);
        this.outOfViewHeight = Math.max(this.childViewHeight - this.viewHeight, 0);        
    }

    addScrollBarAndTicker(){
        let verticalBar= document.createElement("div");  
        verticalBar.className = "scrollBar";        
        verticalBar.style.width = this.barWidth - 2 + "px";
        verticalBar.style.height = this.viewHeight - 2 - this.barWidth + "px";
        verticalBar.style.left = this.viewWidth - this.barWidth + "px";
        verticalBar.style.top = "30px";
        
        this.verticalBar = verticalBar;
        this.view.appendChild(this.verticalBar);

        let verticalTicker = document.createElement("div");  
        verticalTicker.className = "ticker";      
        verticalTicker.style.width = this.barWidth - 2 + "px";
        verticalTicker.style.height = this.tickerSize + "px";
        this.verticalTicker = verticalTicker;
        
        verticalBar.appendChild(this.verticalTicker);

        let horizontalBar = document.createElement("div");  
        horizontalBar.className = "scrollBar";        
        horizontalBar.style.width = this.viewWidth - this.barWidth - 2 + "px";
        horizontalBar.style.height = this.barWidth - 2 + "px";
        horizontalBar.style.top = this.viewHeight - this.barWidth + "px";
        
        this.horizontalBar = horizontalBar;
        this.view.appendChild(this.horizontalBar);

        let horizontalTicker = document.createElement("div");  
        horizontalTicker.className = "ticker";      
        horizontalTicker.style.width = this.tickerSize + "px";
        horizontalTicker.style.height = this.barWidth - 2 + "px";
        this.horizontalTicker = horizontalTicker;
        
        horizontalBar.appendChild(this.horizontalTicker);
    }

    bindMouseEvent(){
        this.verticalBarMouseMoveHandler = this.verticalBarMouseMove.bind(this);
        this.verticalBar.onpointerdown = this.verticalBarOnClick.bind(this);
        this.verticalBar.onmousedown = this.verticalBarOnMouseDown.bind(this);
        // this.verticalBar.addEventListener("mousemove", this.verticalBarMouseMoveHandler, false);

        this.horizontalBarMouseMoveHandler = this.horizontalBarMouseMove.bind(this);
        this.horizontalBar.onpointerdown = this.horizontalBarOnClick.bind(this);
        this.horizontalBar.onmousedown = this.horizontalBarOnMouseDown.bind(this);
        // console.log(this.horizontalBar)
        // this.view.bindWheel = this.bindWheel.bind(this);
        // this.view.addEventListener("mousewheel", this.bindWheel, false)
        // this.
    }
    verticalBarMouseMove(e) {
        this.verticalBarTicker(e.clientY);
        e.preventDefault();
    }
    horizontalBarMouseMove(e){
        this.horizontalBarTicker(e.clientX);
        e.preventDefault();
    }
    verticalBarTicker(tickerPosition) {            
        tickerPosition = Math.min(tickerPosition, this.viewHeight - this.tickerSize - this.barWidth);
        tickerPosition = Math.max(0, tickerPosition);    
        
        this.verticalTicker.style.top = tickerPosition - 30 + "px";    
        let verticalPercentage = tickerPosition / this.viewHeight;    
        let verticalMove = verticalPercentage * this.outOfViewHeight;
        this.childView.style.top = -1 * verticalMove + "px";        
        
        this.tableRenderer.renderRow(verticalMove, verticalMove + this.viewHeight);
    }
    horizontalBarTicker(tickerPosition) {        
        tickerPosition = Math.min(tickerPosition, this.viewWidth - this.tickerSize - this.barWidth - 2);
        tickerPosition = Math.max(0, tickerPosition);  

        this.horizontalTicker.style.left = tickerPosition + "px";    
        let horizontalPercentage = tickerPosition / this.viewWidth;    
        let horizontalMove = horizontalPercentage * this.outOfViewWidth;
        
        this.tableRenderer.renderCol(horizontalMove, horizontalMove + this.viewWidth);
    }
    verticalBarOnClick(e){
        this.verticalBar.setPointerCapture(e.pointerId);
    }
    horizontalBarOnClick(e){
        this.horizontalBar.setPointerCapture(e.pointerId);
    }
    verticalBarOnMouseDown(e){
        console.log(e.clientY)
        e.target.addEventListener("mousemove", this.verticalBarMouseMoveHandler, false);
        this.verticalBarTicker(e.clientY);
    }
    horizontalBarOnMouseDown(e){
        e.target.addEventListener("mousemove", this.horizontalBarMouseMoveHandler, false);
        this.horizontalBarTicker(e.clientX);
    }
    bindWheel(e){
        console.log("bindWheel", e);
    }
}