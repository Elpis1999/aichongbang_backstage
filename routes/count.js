var express = require('express');
var router = express.Router();
const client = require('ykt-http-client');
client.url('127.0.0.1:8080');


// router.get('/:id',async function(req,res){
//     let storeid = req.params.id;
//     let countData =await client.get('/order/',{submitType: 'findJoin', ref: 'store','store.$id':storeid});
//     let times = new Date()
//     let year = times.getFullYear()
//     let month = times.getMonth()+1
//     // console.log(year, typeof year)



//     if(month<=6){
//         let arr = []
//         for(let i = 0;i<countData.length;i++){
//             let months = countData[i].time.split('-')
//             // console.log(months[0]);
           
//            if(months[1]<7 && months[0]==year){
//                arr.push(countData[i])
//            }
//         }
//         let goods =[];//商品
//         let serve =[];//服务
//         for(let j = 0;j<arr.length;j++){
//             goods.push(arr[j].order_goods)
//             serve.push(arr[j].order_serve)
//         }
//         let goodsnum = 0;//商品总价
//         let servesum = 0;//服务总价
//         for(let k=0; k<goods.length;k++){
//              for(let v=0;v<goods[k].length;v++){
//                 goodsnum+=Number(goods[k][v].price)
//              }
//         }

//         for(let l=0 ; l<serve.length;l++){
//             for(let z=0;z<serve[l].length;z++){
//                 servesum+=Number(serve[l][z].price)
//             }
          
//         }
        
//         res.send({goodsnum,servesum})
//     }

//     if(month>6){
//         let arr = []
//         for(let i = 0;i<countData.length;i++){
//             let months = countData[i].time.split('-')
           
//            if(months[1]>6 && months[0]==year){
//                arr.push(countData[i])
//            }
//         }
//         let goods =[];//商品
//         let serve =[];//服务
//         for(let j = 0;j<arr.length;j++){
//             goods.push(arr[j].order_goods)
//             serve.push(arr[j].order_serve)
//         }
//         let goodsnum = 0;//商品总价
//         let servesum = 0;//服务总价
//         for(let k=0; k<goods.length;k++){
//              for(let v=0;v<goods[k].length;v++){
//                 goodsnum+=Number(goods[k][v].price)
//              }
//         }

//         for(let l=0 ; l<serve.length;l++){
//             for(let z=0;z<serve[l].length;z++){
//                 servesum+=Number(serve[l][z].price)
//             }
          
//         }
//         res.send({goodsnum,servesum})
//     }

// });











router.get('/:id',async function(req,res){
    let storeid = req.params.id;
    let countData =await client.get('/order/',{submitType: 'findJoin', ref: 'store','store.$id':storeid});
    let times = new Date()
    let year = times.getFullYear()
    let month = times.getMonth()+1
    // console.log(year, typeof year)



    if(month<=6){
        let arr = []
        for(let i = 0;i<countData.length;i++){
            let months = countData[i].time.split('-')
            // console.log(months[0]);
           
           if(months[1]<7 && months[0]==year){
               arr.push(countData[i])//获取了门店里面的所有商品和服务信息
           }
        }
        let goods =[];//商品
        let serve =[];//服务
        for(let j = 0;j<arr.length;j++){
            goods.push(arr[j].order_goods)
            serve.push(arr[j].order_serve)
        }

        let mon = [];//1//商品
        let tue = [];//2
        let vwd = [];//3
        let thu = [];//4
        let fri = [];//5
        let sat = [];//6

        let mons = [];//1//服务
        let tues = [];//2
        let vwds = [];//3
        let thus = [];//4
        let fris = [];//5
        let sats = [];//6

        for(let j = 0;j<arr.length;j++){
            let monthes = arr[j].time.split('-')

            if(monthes[1]==1){
                  mon.push(arr[j].order_goods)
                  mons.push(arr[j].order_serve)
            }
            if(monthes[1]==2){
                tue.push(arr[j].order_goods)
                tues.push(arr[j].order_serve)
             }
            if(monthes[1]==3){
                vwd.push(arr[j].order_goods)
                vwds.push(arr[j].order_serve)
            }
            if(monthes[1]==4){
                thu.push(arr[j].order_goods)
                thus.push(arr[j].order_serve)
            }
            if(monthes[1]==5){
                fri.push(arr[j].order_goods)
                fris.push(arr[j].order_serve)
            }
            if(monthes[1]==6){
                sat.push(arr[j].order_goods)
                sats.push(arr[j].order_serve)
             }

        }

         let monthgoods = [];//商品月总价
         let monthserve = []//服务月总价
         let a = 0;
         let ai = 0;
         for(let i=0; i<mon.length;i++){
             for(let j =0; j<mon[i].length;j++){
                 a+=Number(mon[i][j].price)
             }
         }
         for(let i=0; i<mons.length;i++){
            for(let j =0; j<mons[i].length;j++){
                ai+=Number(mons[i][j].price)
            }
        }
         monthgoods[0]=a//1
         monthserve[0]=ai

        let b = 0;
        let bi = 0;
        for(let i=0; i<tue.length;i++){
            for(let j =0; j<tue[i].length;j++){
                b+=Number(tue[i][j].price)
            }
        }
        for(let i=0; i<tues.length;i++){
           for(let j =0; j<tues[i].length;j++){
               bi+=Number(tues[i][j].price)
           }
       }
         monthgoods[1]=b//2
         monthserve[1]=bi

        
         let c = 0;
         let ci = 0;
         for(let i=0; i<vwd.length;i++){
             for(let j =0; j<vwd[i].length;j++){
                 c+=Number(vwd[i][j].price)
             }
         }
         for(let i=0; i<vwds.length;i++){
            for(let j =0; j<vwds[i].length;j++){
                ci+=Number(vwds[i][j].price)
            }
        }
         monthgoods[2]=c//3
         monthserve[2]=ci

        let d = 0;
        let di = 0;
        for(let i=0; i<tue.length;i++){
            for(let j =0; j<tue[i].length;j++){
                d+=Number(tue[i][j].price)
            }
        }
        for(let i=0; i<tues.length;i++){
           for(let j =0; j<tues[i].length;j++){
               di+=Number(tues[i][j].price)
           }
       }
         monthgoods[3]=d//4
         monthserve[3]=di



         
         let e = 0;
         let ei = 0;
         for(let i=0; i<fri.length;i++){
             for(let j =0; j<fri[i].length;j++){
                 e+=Number(fri[i][j].price)
             }
         }
         for(let i=0; i<fris.length;i++){
            for(let j =0; j<fris[i].length;j++){
                ei+=Number(fris[i][j].price)
            }
        }
         monthgoods[4]=e//5
         monthserve[4]=ei

        let f = 0;
        let fi = 0;
        for(let i=0; i<sat.length;i++){
            for(let j =0; j<sat[i].length;j++){
                f+=Number(sat[i][j].price)
            }
        }
        for(let i=0; i<sats.length;i++){
           for(let j =0; j<sats[i].length;j++){
               fi+=Number(sats[i][j].price)
           }
       }
         monthgoods[5]=f//6
         monthserve[5]=fi

   
        let goodsnum = 0;//商品总价
        let servesum = 0;//服务总价
        for(let k=0; k<goods.length;k++){
             for(let v=0;v<goods[k].length;v++){
                goodsnum+=Number(goods[k][v].price)
             }
        }

        for(let l=0 ; l<serve.length;l++){
            for(let z=0;z<serve[l].length;z++){
                servesum+=Number(serve[l][z].price)
            }
          
        }

        monthgoods[6]=goodsnum//7
        monthserve[6]=servesum

        
        let monthNum = ["1月","2月","3月","4月","5月","6月","共计"]
        
        res.send({monthgoods,monthserve,monthNum})
    }







    if(month>6){
        let arr = []
        for(let i = 0;i<countData.length;i++){
            let months = countData[i].time.split('-')
           
           if(months[1]>6 && months[0]==year){
               arr.push(countData[i])
           }
        }
        let goods =[];//商品
        let serve =[];//服务
        for(let j = 0;j<arr.length;j++){
            goods.push(arr[j].order_goods)
            serve.push(arr[j].order_serve)
        }
        let mon = [];//7//商品
        let tue = [];//8
        let vwd = [];//9
        let thu = [];//10
        let fri = [];//11
        let sat = [];//12

        let mons = [];//7//服务
        let tues = [];//8
        let vwds = [];//9
        let thus = [];//10
        let fris = [];//11
        let sats = [];//12

        for(let j = 0;j<arr.length;j++){
            let monthes = arr[j].time.split('-')

            if(monthes[1]==7){
                  mon.push(arr[j].order_goods)
                  mons.push(arr[j].order_serve)
            }
            if(monthes[1]==8){
                tue.push(arr[j].order_goods)
                tues.push(arr[j].order_serve)
             }
            if(monthes[1]==9){
                vwd.push(arr[j].order_goods)
                vwds.push(arr[j].order_serve)
            }
            if(monthes[1]==10){
                thu.push(arr[j].order_goods)
                thus.push(arr[j].order_serve)
            }
            if(monthes[1]==11){
                fri.push(arr[j].order_goods)
                fris.push(arr[j].order_serve)
            }
            if(monthes[1]==12){
                sat.push(arr[j].order_goods)
                sats.push(arr[j].order_serve)
             }

        }

         let monthgoods = [];//商品月总价
         let monthserve = []//服务月总价
         let a = 0;
         let ai = 0;
         for(let i=0; i<mon.length;i++){
             for(let j =0; j<mon[i].length;j++){
                 a+=Number(mon[i][j].price)
             }
         }
         for(let i=0; i<mons.length;i++){
            for(let j =0; j<mons[i].length;j++){
                ai+=Number(mons[i][j].price)
            }
        }
         monthgoods[0]=a//1
         monthserve[0]=ai

        let b = 0;
        let bi = 0;
        for(let i=0; i<tue.length;i++){
            for(let j =0; j<tue[i].length;j++){
                b+=Number(tue[i][j].price)
            }
        }
        for(let i=0; i<tues.length;i++){
           for(let j =0; j<tues[i].length;j++){
               bi+=Number(tues[i][j].price)
           }
       }
         monthgoods[1]=b//2
         monthserve[1]=bi

        
         let c = 0;
         let ci = 0;
         for(let i=0; i<vwd.length;i++){
             for(let j =0; j<vwd[i].length;j++){
                 c+=Number(vwd[i][j].price)
             }
         }
         for(let i=0; i<vwds.length;i++){
            for(let j =0; j<vwds[i].length;j++){
                ci+=Number(vwds[i][j].price)
            }
        }
         monthgoods[2]=c//3
         monthserve[2]=ci

        let d = 0;
        let di = 0;
        for(let i=0; i<tue.length;i++){
            for(let j =0; j<tue[i].length;j++){
                d+=Number(tue[i][j].price)
            }
        }
        for(let i=0; i<tues.length;i++){
           for(let j =0; j<tues[i].length;j++){
               di+=Number(tues[i][j].price)
           }
       }
         monthgoods[3]=d//4
         monthserve[3]=di



         
         let e = 0;
         let ei = 0;
         for(let i=0; i<fri.length;i++){
             for(let j =0; j<fri[i].length;j++){
                 e+=Number(fri[i][j].price)
             }
         }
         for(let i=0; i<fris.length;i++){
            for(let j =0; j<fris[i].length;j++){
                ei+=Number(fris[i][j].price)
            }
        }
         monthgoods[4]=e//5
         monthserve[4]=ei

        let f = 0;
        let fi = 0;
        for(let i=0; i<sat.length;i++){
            for(let j =0; j<sat[i].length;j++){
                f+=Number(sat[i][j].price)
            }
        }
        for(let i=0; i<sats.length;i++){
           for(let j =0; j<sats[i].length;j++){
               fi+=Number(sats[i][j].price)
           }
       }
         monthgoods[5]=f//6
         monthserve[5]=fi

   
        let goodsnum = 0;//商品总价
        let servesum = 0;//服务总价
        for(let k=0; k<goods.length;k++){
             for(let v=0;v<goods[k].length;v++){
                goodsnum+=Number(goods[k][v].price)
             }
        }

        for(let l=0 ; l<serve.length;l++){
            for(let z=0;z<serve[l].length;z++){
                servesum+=Number(serve[l][z].price)
            }
          
        }

        monthgoods[6]=goodsnum//7
        monthserve[6]=servesum
        let monthNum = ["7月","8月","9月","10月","11月","12月","共计"]
        
        res.send({monthgoods,monthserve,monthNum})
    }

});


module.exports = router;    