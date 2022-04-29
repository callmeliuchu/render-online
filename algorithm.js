class Vec{
    constructor(data){
        if(data instanceof Array){
            this.arr = data;
            this.n = this.arr.length;
        }else{
            this.n = data;
            this.arr = []
            for(let i=0;i<this.n;i++){
                this.arr.push(0);
            }
        }

    }
    multi(other){
        let ret = new Vec(this.n);
        for(let i=0;i<this.n;i++){
            ret.arr[i] = this.arr[i] * other.arr[i];
        }
        return ret;
    }
    div(other){
        let ret = new Vec(this.n);
        for(let i=0;i<this.n;i++){
            ret.arr[i] = this.arr[i] / other.arr[i];
        }
        return ret;
    }
    add(other){
        let ret = new Vec(this.n);
        for(let i=0;i<this.n;i++){
            ret.arr[i] = this.arr[i] + other.arr[i];
        }
        return ret;
    }
    sub(other){
        let ret = new Vec(this.n);
        for(let i=0;i<this.n;i++){
            ret.arr[i] = this.arr[i] - other.arr[i];
        }
        return ret;
    }
    dot(other){
        let ret = 0;
        for(let i=0;i<this.n;i++){
            ret += this.arr[i] * other.arr[i];
        }
        return ret;
    }

    length(){
        let s = 0;
        for(let i=0;i<this.n;i++){
            s += this.arr[i]*this.arr[i];
        }
        return Math.sqrt(s);
    }

    normal(){
        let l = this.length();
        let ans = new Vec(this.n);
        for(let i=0;i<this.n;i++){
            ans.arr[i] = this.arr[i] / l;
        }
        return ans;
    }
    proj(k){
        let ans = new Vec(k);
        for(let i=0;i<k;i++){
            ans.arr[i] = this.arr[i];
        }
        return ans;
    }
}

class Matrix{

    constructor(data){
        this.m = data.length;
        this.n = data[0].length;
        this.arr = []
        for(let i=0;i<this.m;i++){
            this.arr.push(new Vec(data[i]));
        }
    }

    setRow(row,vec){
        this.arr[row] = vec;
    }

    multiVec(vec){
        let res = new Vec(this.m);
        for(let i=0;i<this.m;i++){
            res.arr[i] = this.arr[i].dot(vec);
        }
        return res;
    }

    get_col(col){
        let res = new Vec(this.m);
        for(let i=0;i<this.m;i++){
            res.arr[i] = this.arr[i].arr[col];
        }
        return res;
    }

    multiMatrix(matrix){
        let res = new Matrix(this.m,matrix.n);
        for(let i=0;i<this.m;i++){
            for(let j=0;j<matrix.n;j++){
                let val = this.arr[i].dot(matrix.get_col(j));
                res.arr[i].arr[j] = val;
            }
        }
        return res;
    }

    multi(input){
        if(input instanceof Vec){
            return this.multiVec(input);
        }else if(input instanceof Matrix){
            return this.multiMatrix(input);
        }
    }

}