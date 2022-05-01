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
        if(other instanceof Vec){
            let ret = new Vec(this.n);
            for(let i=0;i<this.n;i++){
                ret.arr[i] = this.arr[i] * other.arr[i];
            }
            return ret;
        }else if(typeof other === "number"){
            let ret = new Vec(this.n);
            for(let i=0;i<this.n;i++){
                ret.arr[i] = this.arr[i] * other;
            }
            return ret;
        }

    }
    div(other){
        let ret = new Vec(this.n);
        for(let i=0;i<this.n;i++){
            ret.arr[i] = this.arr[i]/other;
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
    embed(k){
        let ans = new Vec(k);
        for(let i=0;i<k;i++){
            if(i < this.n){
                ans.arr[i] = this.arr[i];
            }else{
                ans.arr[i] = 1;
            }
            
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
        let ans = [];
        for(let i=0;i<this.m;i++){
            let tmp = []
            for(let j=0;j<matrix.n;j++){
                let val = this.arr[i].dot(matrix.get_col(j));
                tmp.push(val);
            }
            ans.push(tmp);
        }
        return new Matrix(ans);
    }
    
    multiNum(val){
        let tmp = [];
        for(let i=0;i<this.m;i++){
            let x = [];
            for(let j=0;j<this.n;j++){
                x.push(this.arr[i].arr[j]*val);
            }
            tmp.push(x);
        }
        return new Matrix(tmp);
    }

    multi(input){
        if(input instanceof Vec){
            return this.multiVec(input);
        }else if(input instanceof Matrix){
            return this.multiMatrix(input);
        }else if(typeof input === 'number'){
            return this.multiNum(input);
        }
    }

    add(matrix){
        let tmp = [];
        for(let i=0;i<this.m;i++){
            let x = [];
            for(let j=0;j<this.n;j++){
                x.push(this.arr[i].arr[j]+matrix.arr[i].arr[j]);
            }
            tmp.push(x);
        }
        return new Matrix(tmp);
    }

    det(){
        if(this.m == 2){
            return this.arr[0].arr[0]*this.arr[1].arr[1] - this.arr[0].arr[1]*this.arr[1].arr[0];
        }
        let ans = 0;
        for(let j=0;j<this.n;j++){
            let val = this.arr[0].arr[j]*this.Astartij(0,j);
            ans += val;
        }
        return ans;
    }

    inverse(){
        let astart = this.AstartT().transpose();
        let det_val = this.det();
        return astart.multiNum(1/det_val);
    }

    transpose(){
        let ans = [];
        for(let j=0;j<this.n;j++){
            let tmp = [];
            for(let i=0;i<this.m;i++){
                tmp.push(this.arr[i].arr[j]);
            }
            ans.push(tmp);
        }
        return new Matrix(ans);
    }


    Astartij(i1,j1){
        let ans = [];
        for(let i=0;i<this.m;i++){
            if(i == i1){
                continue;
            }
            let tmp = [];
            for(let j=0;j<this.n;j++){
                if(j == j1){
                    continue;
                }
                tmp.push(this.arr[i].arr[j]);
            }
            if(tmp.length > 0){
                ans.push(tmp);
            }
        }
        let mat = new Matrix(ans);
        if((i1+j1)%2 == 0){
            return mat.det();
        }else{
            return -1*mat.det();
        }
    }

    AstartT(){
        let ans = [];
        for(let i=0;i<this.m;i++){
            let tmp = [];
            for(let j=0;j<this.n;j++){
                tmp.push(this.Astartij(i,j));
            }
            ans.push(tmp);
        }
        return new Matrix(ans);
    }

}

function I(m){
    let tmp = [];
    for(let i=0;i<m;i++){
        let x = [];
        for(let j=0;j<m;j++){
            if(i == j){
                x.push(1);
            }else{
                x.push(0);
            }
        }
        tmp.push(x);
    }
    return new Matrix(tmp);
}