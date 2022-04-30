class Loader{

    constructor(data) {
        this.data = data;
        this.vertexs = [];
        this.faces= [];
        this.max_position = [-1000,-1000,-1000]
        this.min_position = [1000,1000,1000]
        this.center = []
        this.init();
      }
    
    init(){
        for(let s of this.data.split("\n")){
            if(s.startsWith("v ")){
                let arr = [];
                for(let num of s.substr(2,s.length-2).split(" ")){
                    arr.push(parseFloat(num));
                }
                for(let i=0;i<3;i++){
                    if(this.max_position[i] < arr[i]){
                        this.max_position[i] = arr[i];
                    }
                    if(this.min_position[i] > arr[i]){
                        this.min_position[i] = arr[i];
                    }
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
        for(let i=0;i<3;i++){
            this.center[i] = (this.max_position[i]+this.min_position[i])/2;
        }
    }




}