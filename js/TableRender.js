class TableRender {
  constructor(view, viewSize, data, rowHeight, cellWidth) {
    this.view = view;
    this.viewSize = viewSize;
    this.data = data;
    this.rowHeight = rowHeight;
    this.cellWidth = cellWidth;

    this.headers = undefined;

    this.startVisibleRow = 0;
    this.endVisibleRow = viewSize.height / rowHeight;
    this.startVisibleCol = 0;
    this.endVisibleCol = viewSize.width / cellWidth;

    this.renderHeader();
    this.render();
  }
  getSize() {
    let size = { width: 0, height: 0 };
    size.height = this.rowHeight * (this.data.rows.length + 1);
    size.width = this.cellWidth * (this.data.columns.length + 1);
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
    if (this.headers != undefined) {
      this.headers.forEach((header) => {
        this.view.parentElement.removeChild(header);
      });
    }
    this.headers = [];

    var left = 0;
    var top = 0;

    for (var i = this.startVisibleCol; i <= this.endVisibleCol; i++) {
      let cell = document.createElement("div");
      cell.className = "cell"
      cell.style.top = top + "px";
      cell.style.left = left + "px";
      cell.style.height = this.rowHeight + "px";
      cell.style.width = this.cellWidth + "px";     
      cell.appendChild(document.createTextNode(this.data.columns[i]));
      
      this.view.parentElement.appendChild(cell);
      this.headers.push(cell);

      left += this.cellWidth;
    }
  }
  
  render() {
    //clear the view
    this.view.innerHTML = "";
    //calculate the render window
    let firstRow = this.startVisibleRow;
    let lastRow = Math.min(this.endVisibleRow + 1, this.data.rows.length - 1);
    let firstCol = this.startVisibleCol;
    let endCol = Math.min(this.endVisibleCol + 1, this.data.columns.length-1);
    
    //pos for first cell
    let left = 0;
    let top = this.rowHeight + firstRow * this.rowHeight;
    
    for (let i = firstRow; i <= lastRow; i++) {
      let row = this.data.rows[i];
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
