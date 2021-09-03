class Cache{
    constructor(totalRowsToDisplay, totalColsToDisplay){
        this.totalRowsToDisplay = totalRowsToDisplay;
        this.totalColsToDisplay = totalColsToDisplay;
        this.windowDisplay = {
            startVisibleRow: 0,
            endVisibleRow: totalRowsToDisplay,
            startVisibleCol: 0,
            endVisibleCol: totalColsToDisplay
        }
        this.rowsToCache = totalRowsToDisplay * 2;
        this.colsToCache = totalColsToDisplay * 2;

        this.cached = {
            startRow: 0,
            endRow: this.rowsToCache,
            starCol:0,
            endCol: this.colsToCache,
        };
        this.cacheWindowHeight = 0;
        this.cacheWindowWidth = 0;
    }
    moveVirtualWindow(dX, dY){
        this.windowDisplay.startVisibleRow += dX;
        this.windowDisplay.endVisibleRow += dX;
        this.windowDisplay.startVisibleCol += dY;
        this.windowDisplay.endVisibleCol += dY;
        return (this.windowDisplay.endVisibleRow >= this.cached.endRow 
            || this.windowDisplay.endVisibleCol >= this.cached.endCol);
    }
}
class RendererWithCache{
    constructor(data, headers, tableContainer, tableHeader, cellSize){
        this.data = data;
        this.headers = headers;

        this.cellHeight = cellSize.height;
        this.cellWidth = cellSize.width;

        this.table = tableContainer;
        this.header = tableHeader;

        this.cache = new Cache(Math.floor(tableContainer.offsetHeight / this.cellHeight),
                            Math.floor(tableContainer.offsetWidth / this.cellWidth));

        this.cache.cacheWindowHeight = this.cache.rowsToCache * this.cellHeight;
        this.cache.cacheWindowWidth = this.cache.colsToCache * this.cellWidth;
        console.log(this.cache)
        this.CacheDoms();

        this.rowOffset = 0;
        this.colOffset = 0;

        this.renderHeader();
        // this.render();
    }
    CacheDoms(){
        this.table.innerHTML = "";
        let left = 0;
        let top = 0;
        // for (let i = this.windowDisplay.startVisibleRow; i < this.windowDisplay.endVisibleRow; i++) {
        for (let i = this.cache.cached.startRow; i <= this.cache.cached.endRow; i++) {
            let row = this.data[i];
            for (let j = this.cache.cached.starCol; j < this.cache.cached.endCol; j++) {
                let field = row[j];
                let cell = document.createElement("div");
                cell.className = "cell";
                cell.style.top = top + "px";
                cell.style.left = left + "px";
                cell.appendChild(document.createTextNode(field));
                this.table.appendChild(cell);
                left += this.cellWidth;
            }
            left =  0;
            top += this.cellHeight;
        }
    }
    virtualrenderTable(percentage, isVertical){
        console.log(percentage, isVertical);
        if (isVertical){
            this.rowOffset = percentage * this.cache.cacheWindowHeight;
            this.colOffset = 0;
        }else{
            this.rowOffset = 0;
            this.colOffset = percentage * this.cache.cacheWindowWidth;
            // this.renderHeader();
        }
        if (this.cache.moveVirtualWindow(this.rowOffset / this.cellHeight, this.colOffset)){
            CacheDoms();
        }
        this.virtualRender();
    }

    renderTable(percentage, isVertical) {
        if(isVertical){
            let firstRow = Math.floor(percentage * this.data.length);
            let lastRow = firstRow +  this.windowDisplay.totalRowsToDisplay;
            this.rowOffset = (firstRow - percentage * this.data.length) * this.cellHeight;
            if (lastRow >= this.data.length - 1){
                lastRow = this.data.length - 1;
                firstRow = lastRow - this.windowDisplay.totalRowsToDisplay;
            }
            this.windowDisplay.startVisibleRow = firstRow;
            this.windowDisplay.endVisibleRow = lastRow;           
        }else{
            let firstCol = Math.floor(percentage * this.headers.length);
            let endCol = firstCol + this.windowDisplay.totalColsToDisplay + 1;
            this.colOffset = (firstCol - percentage * this.headers.length) * this.cellWidth;
            if (endCol >= this.headers.length-1){
                endCol = this.headers.length-1;
                firstCol = endCol - this.windowDisplay.totalColsToDisplay;
            }
            this.windowDisplay.startVisibleCol = firstCol;
            this.windowDisplay.endVisibleCol = endCol;            
            this.renderHeader();
        }
        this.render();        
    }
    renderHeader(){
        this.header.innerHTML = "";
        let left = this.colOffset;

        for (let i = this.cache.windowDisplay.startVisibleCol; i < this.cache.windowDisplay.endVisibleCol; i++) {
            let cell = document.createElement("div");
            cell.className = "cell"
            cell.style.left = left + "px";
            cell.appendChild(document.createTextNode(this.headers[i]));            
            this.header.appendChild(cell);      
            left += this.cellWidth;
        }
    }
    render(){
        this.table.innerHTML = "";        
        let left = this.colOffset;
        let top = this.rowOffset;
        // for (let i = this.windowDisplay.startVisibleRow; i < this.windowDisplay.endVisibleRow; i++) {
            for (let i = 0; i < 100; i++) {
            let row = this.data[i];
            for (let j = this.windowDisplay.startVisibleCol; j < this.windowDisplay.endVisibleCol; j++) {
                let field = row[j];
                let cell = document.createElement("div");
                cell.className = "cell";
                cell.style.top = top + "px";
                cell.style.left = left + "px";
                cell.appendChild(document.createTextNode(field));
                this.table.appendChild(cell);
                left += this.cellWidth;
            }
            left =  this.colOffset;
            top += this.cellHeight;
        }
    }  

    addScrollBar(verticalBar, horizontalBar){
        this.verticalBar = verticalBar;
        this.horizontalBar = horizontalBar;
    }

    virtualRender(){
        let size = this.table.children.length;
        for(let i = 0; i < size; i++){
            let cell = this.table.children[i];
            cell.style.top = cell.offsetTop - this.rowOffset+ "px";
            cell.style.left = cell.offsetLeft - this.colOffset+ "px";
        }
    }
}