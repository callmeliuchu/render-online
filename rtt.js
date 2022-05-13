class Material{
    constructor(color,albedo,spec,refractVal){
        this.color = color;
        this.albedo = albedo;
        this.spec = spec;
        this.refractVal = refractVal;
    }
}

class Light{
    constructor(position,intensity){
        this.position = position;
        this.intensity = intensity;
    }
}


class Sphere{
    constructor(position,r,material){
        this.center = position;
        this.r = r;
        this.material = material;
    }
}

function reflect(I,N){
    return I.sub(N.multi(N.dot(I) * 2));
}

function refract(I,N,alpha){
    let c = I.dot(N);
    if(c > 0){
        N = N.multi(-1);
        alpha = 1 / alpha;
    }else{
        c = -c;
    }
    let theta = Math.acos(c);
    let sin_theta = Math.sqrt(1-c*c);
    let sin_alp = sin_theta / alpha;
    if(sin_alp >= 1){
        return reflect(I,N);
    }
    let cos_alp = Math.sqrt(1-sin_alp*sin_alp);
    let uu = I.sub(N.multi(-c)).normal();
    let vv = N.multi(-1);
    return uu.multi(sin_alp).add(vv.multi(cos_alp));
}

function hitSphere(orig,dir,sphere){
    let a = dir.dot(dir);
    let b = 2 * (orig.sub(sphere.center).dot(dir));
    let v = orig.sub(sphere.center);
    let c = v.dot(v) - sphere.r*sphere.r;
    let delta = b*b-4*a*c;
    if(delta < 0){
        return {'is_hit':false}
    }
    delta = Math.sqrt(delta);
    let t = (-b+delta)/(2*a);
    let t1 = (-b-delta)/(2*a);
    if(t < 0){
        return {'is_hit':false};
    }
    if(t1 > 0){
        return {'is_hit':true,'dist':t1,'material':sphere.material};
    }else{
        return {'is_hit':true,'dist':t,'material':sphere.material}
    }
}

function cross3(v1,v2){
    return [v1[1]*v2[2]-v1[2]*v2[1],-v1[0]*v2[2]+v1[2]*v2[0],v1[0]*v2[1]-v1[1]*v2[0]];
}


function cross_vec(vec1,vec2){
    if(vec1.arr.length == 2){
        return cross2(vec1.arr,vec2.arr);
    }else if(vec1.arr.length == 3){
        return new Vec(cross3(vec1.arr,vec2.arr));
    }
}


function  binary_center(tri,p){
    let ac = tri[0].sub(tri[2]).proj(2);
    let bc = tri[1].sub(tri[2]).proj(2);
    let pc = p.sub(tri[2]).proj(2);
    let alpha = cross_vec(pc,bc)/cross_vec(ac,bc);
    let beta = cross_vec(pc,ac)/cross_vec(bc,ac);
    let gamma = 1 -alpha - beta;
    return new Vec([alpha,beta,gamma]);
}

function hitTriangle(orig,dir,triangle){
    let ab = triangle[1].sub(triangle[0])
    let ac = triangle[2].sub(triangle[0])
    let bc = triangle[2].sub(triangle[1])
    let n = cross_vec(ac,bc).normal();
    let mat = new Matrix(
        [
            ab.arr,
            ac.arr,
            dir.arr
        ]
    );
    mat = mat.transpose();
    let b = orig.sub(triangle[0]);
    let ans = mat.inverse().multi(b);
    let alpha = ans.arr[0];
    let beta = ans.arr[1];
    let gamma = 1 - alpha - beta;
    let t = -ans.arr[2];
    let p = ab.multi(alpha).add(ac.multi(beta));
    let isHit = false;
    if(t > 0 && alpha > 0 && alpha < 1 && alpha > 0 && beta < 1 && beta > 0 && gamma < 1 && gamma > 0){
        isHit = true;
    }else{
        return {'is_hit':false}
    }
    let material = new Material(new Vec([0.1,0.4,0.5]),new Vec([0.9,0.1,0.0,0.0]),10,1.0);
    return {'is_hit':isHit,'point':p,'normal':n,'material':material,'dist':t}
}

function hitTriangleObj(orig,dir,triangle_list){
    let dist = 10000000;
    let res = {'is_hit':false};
    for(let i=0;i<triangle_list.length;i++){
        let ans = hitTriangle(orig,dir,triangle_list[i]);
        if(ans['is_hit'] && dist > ans['dist']){
            dist = ans['dist'];
            res = ans;
        }
    }
    return res;
}

// let triangle_list = [];
// let loader = new Loader(obj_str3);
// for(let i=0;i<loader.faces.length;i++){
//     let tmp = [];
//     for(let j=0;j<3;j++){
//         let v = loader.getVertex(i,j);
//         v[2] -= 5;
//         tmp.push(new Vec(v));
//     }
//     triangle_list.push(tmp);
// }



function  hitScene(orig,dir,spheres){
    let dist = 10000000;
    let ans1 = {'is_hit':false};
    for(let sphere of spheres){
        let ans = hitSphere(orig,dir,sphere);
        if(ans['is_hit']){
            if(dist > ans['dist']){
                dist = ans['dist'];
                ans1['is_hit'] = true;
                ans1['point'] = orig.add(dir.multi(ans['dist']));
                ans1['normal'] = ans1['point'].sub(sphere.center).normal();
                ans1['material'] = ans['material'];
            }
        }
    }
    let t = (-4 - orig.arr[1])/dir.arr[1];
    if(t > 0.0001){
        let hitPoint = orig.add(dir.multi(t));
        let dist1 = dir.length() * t;
        if(hitPoint.arr[0] >= -20 && hitPoint.arr[0] <= 20 && hitPoint.arr[2] >= -40 && hitPoint.arr[2] <= -5 && dist1 < dist){
            ans1['is_hit'] = true;
            ans1['point'] = hitPoint;
            ans1['normal'] = new Vec([0,1,0]);
            let k = (parseInt(hitPoint.arr[0]*0.5) + parseInt(hitPoint.arr[2]*0.5) + 1000) % 2;
            let color = new Vec([0.3, 0.1, 0.1]);
            if(k == 1){
                color = new Vec([1,1,1]);
            }
            ans1['material'] = new Material(color,new Vec([0.9,0.1,0.0,0.0]),10,1.0);
        }
    }
    // let triangle = [
    //     new Vec([-20,-4,-10]),
    //     new Vec([-15,-4,-5]),
    //     new Vec([10,-4,-20])
    // ];
    // let ans2 = hitTriangleObj(orig,dir,triangle_list);
    // if(ans2['is_hit']){
    //     let dd = ans2['dist'];
    //     if(dist > dd){
    //         ans1 = ans2;
    //     }
    // }
    return ans1;
}

function castRay(orig,dir,spheres,lights,depth){
    let ans = hitScene(orig,dir,spheres);
    if(!ans['is_hit'] || depth > 4){
        return new Vec([0.2,0.7,0.8]);
    }

    let ref_dir = reflect(dir,ans['normal']).normal();
    let ref_orig = ans['point'].add(ans['normal'].multi(0.001));
    let ref_color = castRay(ref_orig,ref_dir,spheres,lights,depth+1);
    let refra_dir = refract(dir,ans['normal'],ans['material'].refractVal).normal();
    let refrac_orig = null;
    let cc = dir.dot(ans['normal']);
    if(cc < 0){
        refrac_orig = ans['point'].sub(ans['normal'].multi(0.001));
    }else{
        refrac_orig = ans['point'].add(ans['normal'].multi(0.001));
    }
    let refract_color = castRay(refrac_orig,refra_dir,spheres,lights,depth+1);
    

    let diffuse_intensity = 0;
    let spec_intensity = 0;
    for(let light of lights){
        let light_dir = light.position.sub(ans['point']).normal();
        let light_orig = null;
        if(light_dir.dot(ans['normal']) > 0){
            light_orig = ans['point'].add(ans['normal'].multi(0.001));;
        }else{
            light_orig = ans['point'].sub(ans['normal'].multi(0.001));;
        }
        let shadowAns = hitScene(light_orig,light_dir,spheres);
        let light_dist = light.position.sub(ans['point']).length();
        if(shadowAns['is_hit']){
            let tt = shadowAns['point'].sub(light_orig).length();
            if(light_dist > tt){
                continue;
            }
        }
        let ref = reflect(light_dir.multi(-1),ans['normal']);
        diffuse_intensity += Math.max(light_dir.dot(ans['normal']),0)*light.intensity;
        spec_intensity += Math.pow(Math.max(ref.dot(dir.multi(-1)),0),ans['material'].spec)*light.intensity;
    }
    let diff = ans['material'].color.multi(diffuse_intensity).multi(ans['material'].albedo.arr[0]);
    let spec = new Vec([1,1,1]);
    spec = spec.multi(spec_intensity).multi(ans['material'].albedo.arr[1]);
    ref_color = ref_color.multi(ans['material'].albedo.arr[2]);
    refract_color = refract_color.multi(ans['material'].albedo.arr[3]);
    return diff.add(spec).add(ref_color).add(refract_color);
}


function rayTracing(){
    let canvas = document.getElementById("myCanvas1");
    canvas.height = height;
    canvas.width = width;
    var ctx= canvas.getContext("2d");
    let imgdata = ctx.createImageData(width, height);
    let spheres = [];
    let lights = [];

    let l1 = new Light(new Vec([80,20,20]),1.0);
    let l2 = new Light(new Vec([30,70,40]),1.6);
    lights.push(l1);
    lights.push(l2);

    let m1 = new Material(new Vec([0.4, 0.4, 0.3]),new Vec([0.6,0.3,0.1,0]),50,1);
    let m2 = new Material(new Vec([0.6, 0.7, 0.8]),new Vec([0.0,0.5,0.1,0.8]),125,1.5);
    let m3 = new Material(new Vec([0.3, 0.1, 0.1]),new Vec([0.9,0.1,0.0,0.0]),10,1.0);
    let m4 = new Material(new Vec([1.0, 1.0, 1.0]),new Vec([0.0,10,0.8,0.0]),1425,1.0);


    let sp1 = new Sphere(new Vec([-3,0, -16]),2,m1);
    let sp2 = new Sphere(new Vec([-1.0, -1.5, -12]),2,m2);
    let sp3 = new Sphere(new Vec([1.5, -0.5, -18]),3,m3);
    let sp4 = new Sphere(new Vec([7,    5,   -18]),4,m4);
    spheres.push(sp1);
    spheres.push(sp2);
    spheres.push(sp3);
    spheres.push(sp4);
    for(let j=height-1;j>=0;j--){
        for(let i=0;i<width;i++){
            let x = (2*i/width - 1)*(width/height);
            let y = 1 - 2 * j / height;
            let orig = new Vec([0,0,0]);
            let color = new Vec([0,0,0]);
            let nn = 3;
            for(let k=0;k<nn;k++){
                let dir = new Vec([x+Math.random()*0.001,y+Math.random()*0.001,-1]).normal();
                let cc = castRay(orig,dir,spheres,lights,0);
                color = color.add(cc);
            }
            color = color.div(nn);
            let r = color.arr[0];
            let g = color.arr[1];
            let b = color.arr[2];
            let c = Math.max(r,g);
            c = Math.max(c,b);
            if(c > 1){
                r = r / c;
                g = g / c;
                b = b / c;
            }
            let index = i + j * width;
            let idx = 4*index;
            imgdata.data[idx] =  r * 255;
            imgdata.data[idx+1] =  g * 255;
            imgdata.data[idx+2] =  b * 255;
            imgdata.data[idx+3] = 255;
        }
    }
    ctx.putImageData(imgdata, 0, 0);
}