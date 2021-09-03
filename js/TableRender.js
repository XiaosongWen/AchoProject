class TableRender {
  constructor(header, view, viewSize, headers, data, size) {
    this.header = header;
    this.view = view;
    this.viewSize = viewSize;
    this.headers = headers
    this.data = data;
    this.rowHeight = size.height;
    this.cellWidth = size.width;

    this.startVisibleRow = 0;
    this.endVisibleRow = viewSize.height / this.rowHeight;
    this.startVisibleCol = 0;
    this.endVisibleCol = viewSize.width / this.cellWidth;
    
    this.renderHeader();
    this.render();
  }
  getSize() {
    let size = { width: 0, height: 0 };
    size.width = this.cellWidth * (this.headers.length);
    size.height = this.rowHeight * (this.data.length + 1);    
    return size;
  }

  renderRow(startVisible, endVisible){    
    this.startVisibleRow = Math.floor(startVisible / this.rowHeight);
    this.endVisibleRow = Math.floor(endVisible / this.rowHeight);
    // this.renderHeader();
    this.render();
  }
  renderCol(startVisible, endVisible){
    this.startVisibleCol = Math.floor(startVisible / this.cellWidth);
    this.endVisibleCol = Math.floor(endVisible / this.cellWidth);
    this.renderHeader();
    this.render();
  }
  renderHeader(){
    // clear
    this.header.innerHTML = "";

    let left = this.startVisibleCol * this.cellWidth;

    for (let i = this.startVisibleCol; i <= this.endVisibleCol; i++) {
      let cell = document.createElement("div");
      cell.className = "cell headerCell"
      cell.style.top = "0px";
      cell.style.left = left + "px";
      cell.style.height = this.rowHeight + "px";
      cell.style.width = this.cellWidth + "px";     
      cell.appendChild(document.createTextNode(this.headers[i]));
      
      this.header.appendChild(cell);      
      left += this.cellWidth;
    }
  }
  
  render() {
    //clear the view
    this.view.innerHTML = "";
    //calculate the render window
    let firstRow = this.startVisibleRow;
    let lastRow = Math.min(this.endVisibleRow, this.data.length - 1);
    let firstCol = this.startVisibleCol;
    let endCol = Math.min(this.endVisibleCol, this.headers.length-1);
    
    //pos for first cell
    let left = firstCol * this.cellWidth;
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
      left = firstCol * this.cellWidth;
      top += this.rowHeight;
    }
    // console.log(this.view)
  }  
}
