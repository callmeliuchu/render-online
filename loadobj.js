class Loader{

    constructor(data) {
        this.data = data;
        this.vertexs = [];
        this.faces= [];
        this.max_position = [-1000,-1000,-1000]
        this.min_position = [1000,1000,1000]
        this.center = []
        this.vns = [];
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
                    let tmp = [];
                    for(let x of ss.split("/")){
                        tmp.push(parseInt(x)-1);
                    }
                    arr.push(tmp);
                }
                this.faces.push(arr);
            }
            if(s.startsWith("vn ")){
                let arr = [];
                for(let num of s.substr(4,s.length-4).split(" ")){
                    arr.push(parseFloat(num));
                }
                this.vns.push(arr);
            }
        }
        for(let i=0;i<3;i++){
            this.center[i] = (this.max_position[i]+this.min_position[i])/2;
        }
    }

    getVertex(f_id,nth_idx){
        return this.vertexs[this.faces[f_id][nth_idx][0]];
    }

    getNormal(f_id,nth_idx){
        return this.vns[this.faces[f_id][nth_idx][2]];
    }

}