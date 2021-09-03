class Renderer{
    constructor(data, headers, tableContainer, tableHeader, cellSize){
        this.data = data;
        this.headers = headers;

        this.cellHeight = cellSize.height;
        this.cellWidth = cellSize.width;

        this.table = tableContainer;
        this.header = tableHeader;

        this.totalRowsToDisplay = Math.floor(tableContainer.offsetWidth / this.cellHeight);
        this.totalColsToDisplay = Math.floor(tableContainer.offsetWidth / this.cellWidth);
        
        this.startVisibleRow = 0;
        this.endVisibleRow = this.totalRowsToDisplay;
        this.startVisibleCol = 0;
        this.endVisibleCol = this.totalColsToDisplay;

        this.rowOffset = 0;
        this.colOffset = 0;

        this.renderHeader();
        this.render();
    }

    renderTable(percentage, isVertical) {
        if(isVertical){
            let firstRow = Math.floor(percentage * this.data.length);
            let lastRow = firstRow +  this.totalRowsToDisplay;
            this.rowOffset = (firstRow - percentage * this.data.length) * this.cellHeight;
            if (lastRow >= this.data.length - 1){
                lastRow = this.data.length - 1;
                firstRow = lastRow - this.totalRowsToDisplay;
            }
            this.startVisibleRow = firstRow;
            this.endVisibleRow = lastRow;           
        }else{
            let firstCol = Math.floor(percentage * this.headers.length);
            let endCol = firstCol + this.totalColsToDisplay + 1;
            this.colOffset = (firstCol - percentage * this.headers.length) * this.cellWidth;
            if (endCol >= this.headers.length-1){
                endCol = this.headers.length-1;
                firstCol = endCol - this.totalColsToDisplay;
            }
            this.startVisibleCol = firstCol;
            this.endVisibleCol = endCol;
            
            this.renderHeader();
            
        }
        this.render();
        
    }
    renderHeader(){
        this.header.innerHTML = "";
        let left = this.colOffset;

        for (let i = this.startVisibleCol; i <= this.endVisibleCol; i++) {
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
        
        for (let i = this.startVisibleRow; i <=this.endVisibleRow; i++) {
            let row = this.data[i];
            for (let j = this.startVisibleCol; j <=this.endVisibleCol; j++) {
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
        // console.log(this.view)
    }  
}