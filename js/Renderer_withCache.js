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
        if (this.windowDisplay.endVisibleRow >= this.cached.endRow 
            || this.windowDisplay.endVisibleCol >= this.cached.endCol){
                console.log("recaching")
                this.computNewCache();
                return true;
            }
        return false;
    }
    computNewCache(){
        if (this.windowDisplay.endVisibleRow >= this.cached.endRow){
            this.cached.startRow = this.cached.endRow - Math.floor(this.totalRowsToDisplay/2);
            this.cached.endRow = this.cached.startRow + this.rowsToCache;
            this.windowDisplay.startVisibleRow = this.cached.startRow;
            this.windowDisplay.endVisibleRow = this.cached.startRow + this.totalRowsToDisplay;
            
        }else{
            this.cached.starCol = this.cached.endCol - Math.floor(this.totalColsToDisplay/2);
            this.cached.endCol = this.cached.starCol + this.colsToCache;  
            this.windowDisplay.startVisibleCol = this.cached.starCol;
            this.windowDisplay.endVisibleCol = this.cached.startRow + this.totalColsToDisplay;          
        }
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
    
        this.CacheDoms();

        this.rowOffset = 0;
        this.colOffset = 0;

        this.renderHeader();
    }
    CacheDoms(){
        this.table.innerHTML = "";
        let left = 0;
        let top = 0;
        for (let i = this.cache.cached.startRow; i <= this.cache.cached.endRow; i++) {
            let row = this.data[i];
            for (let j = this.cache.cached.starCol; j < this.cache.cached.endCol; j++) {
                let field = row[j];
                let cell = document.createElement("div");
                cell.className = "cell";
                cell.style.top = top + "px";
                cell.style.left = left + "px";
                cell.style.width = this.cellWidth + "px";
                cell.style.height = this.cellHeight + "px";
                cell.appendChild(document.createTextNode(field));
                this.table.appendChild(cell);
                left += this.cellWidth;
            }
            left =  0;
            top += this.cellHeight;
        }
    }
    virtualrenderTable(percentage, isVertical){
        console.log(percentage, isVertical, this.cache);
        if (isVertical){
            this.rowOffset = percentage * this.cache.cacheWindowHeight;
            this.colOffset = 0;
        }else{
            this.rowOffset = 0;
            this.colOffset = percentage * this.cache.cacheWindowWidth;
            // this.renderHeader();
        }
        if (this.cache.moveVirtualWindow(this.rowOffset / this.cellHeight, this.colOffset)){
            this.CacheDoms();
            // this.verticalBar.UpDateTicker();
            // this.horizontalBar.UpDateTicker();
        }
        this.virtualRender();
    }

    

    renderHeader(){
        this.header.innerHTML = "";
        let left = this.colOffset;

        for (let i = this.cache.windowDisplay.startVisibleCol; i < this.cache.windowDisplay.endVisibleCol; i++) {
            let cell = document.createElement("div");
            cell.className = "cell"
            cell.style.left = left + "px";
            cell.style.width = this.cellWidth + "px";
            cell.style.height = this.cellHeight + "px";
            cell.appendChild(document.createTextNode(this.headers[i]));            
            this.header.appendChild(cell);      
            left += this.cellWidth;
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