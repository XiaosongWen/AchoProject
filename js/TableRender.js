class TableRender {
  constructor(view, viewSize, headers, data, rowHeight, cellWidth) {
    this.view = view;
    this.viewSize = viewSize;
    this.headers = headers
    this.data = data;
    this.rowHeight = rowHeight;
    this.cellWidth = cellWidth;

    this.startVisibleRow = 0;
    this.endVisibleRow = viewSize.height / rowHeight;
    this.startVisibleCol = 0;
    this.endVisibleCol = viewSize.width / cellWidth;
    
    this.renderHeader();
    this.render();
  }
  getSize() {
    let size = { width: 0, height: 0 };
    size.width = this.cellWidth * (this.headers.length + 1);
    size.height = this.rowHeight * (this.data.length + 1);    
    return size;
  }

  renderRow(startVisible, endVisible){    
    this.startVisibleRow = Math.floor(startVisible / this.rowHeight);
    this.endVisibleRow = Math.ceil(endVisible / this.rowHeight);
    this.renderHeader();
    this.render();
  }
  renderCol(startVisible, endVisible){
    this.startVisibleCol = Math.floor(startVisible / this.cellWidth);
    this.endVisibleCol = Math.ceil(endVisible / this.cellWidth);
    this.renderHeader();
    this.render();
  }
  renderHeader(){
    // clear
    if (this.headerDivs != undefined) {
      this.headerDivs.forEach((header) => {
        this.view.parentElement.removeChild(header);
      });
    }
    
    this.headerDivs = [];
    let left = 0;
    let top = 0;
    for (let i = this.startVisibleCol; i <= this.endVisibleCol; i++) {
      let cell = document.createElement("div");
      cell.className = "cell"
      cell.style.top = top + "px";
      cell.style.left = left + "px";
      cell.style.height = this.rowHeight + "px";
      cell.style.width = this.cellWidth + "px";     
      cell.appendChild(document.createTextNode(this.headers[i]));
      
      this.view.parentElement.appendChild(cell);
      this.headerDivs.push(cell);

      left += this.cellWidth;
    }
  }
  
  render() {
    //clear the view
    this.view.innerHTML = "";
    //calculate the render window
    let firstRow = this.startVisibleRow;
    let lastRow = Math.min(this.endVisibleRow + 1, this.data.length - 1);
    let firstCol = this.startVisibleCol;
    let endCol = Math.min(this.endVisibleCol + 1, this.headers.length-1);
    
    //pos for first cell
    let left = 0;
    let top = this.rowHeight + firstRow * this.rowHeight;
    
    for (let i = firstRow; i <= lastRow; i++) {
      let row = this.data[i];
      for (let j = firstCol; j <= endCol; j++) {
        let field = row[j];
        let cell = document.createElement("div");
        cell.className = "cell";
        cell.style.top = top + "px";
        cell.style.left = left + "px";
        cell.style.height = this.rowHeight + "px";
        cell.style.width = this.cellWidth + "px";
        cell.appendChild(document.createTextNode(field));
        this.view.appendChild(cell);

        left += this.cellWidth;
      }
      left = 0;
      top += this.rowHeight;
    }
  }
  
}
