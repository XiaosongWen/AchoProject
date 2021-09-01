class DataGenerator {
  constructor() {
    this.data = { columns: [], rows: [] };
    this.randomData();
  }

  randomData() {
    this.data.columns.push("index");
    const dataTypes = [
      "index", 
      "int",
      "double",
      "string",
      "address",
      "boolean",
      "time",
      "balance",
      "url",
    ];
    for (let i = 1; i < 100; i++) {
      let random = Math.floor(Math.random() * dataTypes.length);
      this.data.columns.push(dataTypes[random]);
    }
    for (let index = 0; index < 1000; index++) {
      let row = [];
      for (let i = 0; i < this.data.columns.length; i++) {
        switch (this.data.columns[i]) {
          case "index":
            row.push(index);
            break;
          case "int":
            row.push(Math.floor(Math.random()*1000));
            break;
          case "double":
            row.push(3.14);
            break;
          case "string":
            row.push("Jack");
            break;
          case "address":
            row.push("123 street");
            break;
          case "boolean":
            row.push(Math.random() < 0.5);
            break;
          case "time":
            row.push("00:00:00");
            break;
          case "balance":
            row.push("$100.00");
            break;
          case "url":
            row.push("http://acho.io/");
            break;
          default:
            break;
        }
      }

      this.data.rows.push(row);
    }
  }
}
