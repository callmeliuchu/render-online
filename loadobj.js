class Loader{

    constructor(data) {
        this.data = data;
        this.vertexs = [];
        this.faces= [];
        this.init();
      }
    
    init(){
        for(let s of this.data.split("\n")){
            if(s.startsWith("v ")){
                let arr = [];
                for(let num of s.substr(2,s.length-2).split(" ")){
                    arr.push(parseFloat(num));
                }
                this.vertexs.push(arr);
            }
            if(s.startsWith("f ")){
                let arr = [];
                for(let ss of s.substr(2,s.length-2).split(" ")){
                    let tmp = ss.split("/");
                    // console.log(tmp);
                    arr.push(parseInt(tmp[0])-1);
                }
                this.faces.push(arr);
            }
        }
    }




}