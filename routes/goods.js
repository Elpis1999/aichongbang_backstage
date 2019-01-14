var express = require('express');
var router = express.Router();
const client = require('ykt-http-client');
const _ = require("lodash");
client.url('127.0.0.1:8080');

//增加
router.post('/', async function (req, res) {
    let {
        storeId,
        supId
    } = req.body;

    let obj = req.body;
    delete obj.supId;
    delete obj.storeId;

    if (supId) {
        obj.suppiler = {
            $ref: "suppiler",
            $id: supId
        }
    }

    obj.store = {
        $ref: "store",
        $id: storeId
    }
    console.log(obj);
    await client.post('/goods', obj);
    res.send({
        "status": 1
    });
});

//查询
router.get('/', async function (req, res) {
    let {
        page,
        rows,
        type,
        value,
        storeId
    } = req.query;
    let searchObj = {};
    if (type) {
        searchObj = {
            [type]: value || ""
        };
    }
    let data = await client.get("/goods", {
        page,
        rows,
        ...searchObj,
        submitType: "findJoin",
        "store.$id": storeId,
        ref: "store"
    });
    res.send(data);
});

//查询商品销量
router.get('/mgoodsSalesVolume', async function (req, res) {
    let {
        storeId,
        year
    } = req.query;
    let order = await client.get("/order");
    let orderArr = [];
    //找到属于当前店铺的订单
    for (let i = 0; i < order.length; i++) {
        if (storeId === order[i].store.$id) {
            orderArr.push(order[i])
        }
    }

    //找到当前年已完成的订单
    let newOrderArr = [];
    for (let i = 0; i < orderArr.length; i++) {
        if (orderArr[i].time.split("-")[0] == year && orderArr[i].state === "已完成") {
            newOrderArr.push(orderArr[i]);
        }
    }

    //将订单按12个月分
    let monthGoods;
    let january = [];
    let february = [];
    let march = [];
    let april = [];
    let may = [];
    let june = [];
    let july = [];
    let august = [];
    let september = [];
    let october = [];
    let november = [];
    let december = [];
    for (let i = 0; i < newOrderArr.length; i++) {
        if (newOrderArr[i].time.split("-")[1] == 1) {
            january.push(...newOrderArr[i].order_goods);
        } else if (newOrderArr[i].time.split("-")[1] == 2) {
            february.push(...newOrderArr[i].order_goods);
        } else if (newOrderArr[i].time.split("-")[1] == 3) {
            march.push(...newOrderArr[i].order_goods);
        } else if (newOrderArr[i].time.split("-")[1] == 4) {
            april.push(...newOrderArr[i].order_goods);
        } else if (newOrderArr[i].time.split("-")[1] == 5) {
            may.push(...newOrderArr[i].order_goods);
        } else if (newOrderArr[i].time.split("-")[1] == 6) {
            june.push(...newOrderArr[i].order_goods);
        } else if (newOrderArr[i].time.split("-")[1] == 7) {
            july.push(...newOrderArr[i].order_goods);
        } else if (newOrderArr[i].time.split("-")[1] == 8) {
            august.push(...newOrderArr[i].order_goods);
        } else if (newOrderArr[i].time.split("-")[1] == 9) {
            september.push(...newOrderArr[i].order_goods);
        } else if (newOrderArr[i].time.split("-")[1] == 10) {
            october.push(...newOrderArr[i].order_goods);
        } else if (newOrderArr[i].time.split("-")[1] == 11) {
            november.push(...newOrderArr[i].order_goods);
        } else if (newOrderArr[i].time.split("-")[1] == 12) {
            december.push(...newOrderArr[i].order_goods);
        }
    }
    monthGoods = [january,
        february,
        march,
        april,
        may,
        june,
        july,
        august,
        september,
        october,
        november,
        december
    ];

    let newMonthGoods = [];
    for (let i = 0; i < monthGoods.length; i++) {
        newMonthGoods.push(...monthGoods[i]);
    }

    //数组去重
    let newArr = _.uniqWith(newMonthGoods, _.isEqual)

    let seriesData = [];
    let axisData = [];
    for (let i = 0; i < newArr.length; i++) {
        let name = newArr[i].goodsName;
        axisData.push(newArr[i].goodsName);
        let numberData = [];
        for (let j = 0; j < monthGoods.length; j++) {
            let number = 0;
            for (let k = 0; k < monthGoods[j].length; k++) {
                if (monthGoods[j][k].goodsName === newArr[i].goodsName) {
                    number += parseInt(monthGoods[j][k].number);
                }
            }
            numberData.push(number);
        }
        seriesData.push({
            name,
            type: "line",
            stack: name + "销售量",
            smooth: true,
            data: numberData
        });
    }

    res.send({
        axisData,
        seriesData
    });
    // let date = new Date().getMonth();
    // let year = new Date().getFullYear();
    // if (date === 0) {
    //     date = 12;
    //     year = parseInt(year) - 1;
    // }
    // let upMonthOrder = [];

    // for (let i = 0; i < 12; i++) {
    //     if (orderArr[i].time.split("-")[1] == date && orderArr[i].time.split("-")[0] == year) {
    //         upMonthOrder.push(orderArr[i])
    //     }

    // }

    // let goodsArr = [];

    // for (let i = 0; i < upMonthOrder.length; i++) {
    //     goodsArr.push(...upMonthOrder[i].order_goods);
    // }

    // let axisData = [];
    // let seriesData = [];

    // let newArr = _.uniqWith(goodsArr, _.isEqual)

    // for (let i = 0; i < newArr.length; i++) {
    //     let number = 0;
    //     let name = "";
    //     for (let j = 0; j < goodsArr.length; j++) {


    //         if (newArr[i].goodsName == goodsArr[j].goodsName) {
    //             name = goodsArr[j].goodsName;
    //             number += parseInt(goodsArr[j].number);
    //         }
    //     }
    //     axisData.push(name);
    //     seriesData.push(number);
    // }
    // let newSeriesData = [];
    // for (let i = 0; i < axisData.length; i++) {
    //     newSeriesData.push({
    //         name: axisData[i],
    //         type: "line",
    //         stack: "总量",
    //         data: [120, 132, 101, 134, 90, 230, 210]
    //     });
    // }
    // console.log(newSeriesData,"newSeriesData");
    // res.send({
    //     axisData,
    //     seriesData,
    //     goodsArr,
    //     orderArr,
    //     upMonthOrder
    // });
});

// //查询商品季销量
router.get('/qgoodsSalesVolume', async function (req, res) {
    let {
        storeId,
        year
    } = req.query;
    let order = await client.get("/order");
    let orderArr = [];
    //找到属于当前店铺的订单
    for (let i = 0; i < order.length; i++) {
        if (storeId === order[i].store.$id) {
            orderArr.push(order[i])
        }
    }

    //找到当前年已完成的订单
    let newOrderArr = [];
    for (let i = 0; i < orderArr.length; i++) {
        if (orderArr[i].time.split("-")[0] == year && orderArr[i].state === "已完成") {
            newOrderArr.push(orderArr[i]);
        }
    }

    //将订单按4个季度分
    let monthGoods;
    let spring = [];
    let summer = [];
    let autumn = [];
    let winter = [];
    for (let i = 0; i < newOrderArr.length; i++) {
        let month = newOrderArr[i].time.split("-")[1];
        if (month == 1 || month == 2 || month == 3) {
            spring.push(...newOrderArr[i].order_goods);
        } else if (month == 4 || month == 5 || month == 6) {
            summer.push(...newOrderArr[i].order_goods);
        } else if (month == 7 || month == 8 || month == 9) {
            autumn.push(...newOrderArr[i].order_goods);
        } else if (month == 10 || month == 11 || month == 12) {
            winter.push(...newOrderArr[i].order_goods);
        }
    }
    monthGoods = [spring, summer, autumn, winter];

    let newMonthGoods = [];
    for (let i = 0; i < monthGoods.length; i++) {
        newMonthGoods.push(...monthGoods[i]);
    }

    //数组去重
    let newArr = _.uniqWith(newMonthGoods, _.isEqual)

    let series = [];
    let source = [];
    source.push(["season", "spring", "summer", "autumn", "winter"]);

    for (let i = 0; i < newArr.length; i++) {
        let arr = [];
        arr.push(newArr[i].goodsName);
        for (let j = 0; j < monthGoods.length; j++) {
            let number = 0;
            for (let k = 0; k < monthGoods[j].length; k++) {
                if (newArr[i].goodsName == monthGoods[j][k].goodsName) {
                    number += parseInt(monthGoods[j][k].number);
                }
            }
            arr.push(number);
        }
        source.push(arr);
        series.push({
            type: "bar",
            seriesLayoutBy: "row"
        });
    }


    res.send({
        source,
        series
    });
    // let {
    //     storeId
    // } = req.query;
    // let order = await client.get("/order");
    // let orderArr = [];
    // for (let i = 0; i < order.length; i++) {
    //     if (storeId === order[i].store.$id) {
    //         orderArr.push(order[i])
    //     }
    // }
    // let date = new Date().getMonth() + 1;
    // let year = new Date().getFullYear();
    // let inSeason = [];

    // if (date == 1 || date == 2 || date == 3) {
    //     inSeason = [10, 11, 12];
    // } else if (date == 4 || date == 5 || date == 6) {
    //     inSeason = [1, 2, 3];
    // } else if (date == 7 || date == 8 || date == 9) {
    //     inSeason = [4, 5, 6];
    // } else {
    //     inSeason = [7, 8, 9];
    // }



    // if ((date - 1) === 0) {
    //     year = parseInt(year) - 1;
    // }
    // let upMonthOrder = [];

    // for (let i = 0; i < orderArr.length; i++) {
    //     if ((orderArr[i].time.split("-")[1] == inSeason[0] ||
    //             orderArr[i].time.split("-")[1] == inSeason[1] ||
    //             orderArr[i].time.split("-")[1] == inSeason[2]) &&
    //         orderArr[i].time.split("-")[0] == year) {
    //         upMonthOrder.push(orderArr[i])
    //     }
    // }

    // let goodsArr = [];

    // for (let i = 0; i < upMonthOrder.length; i++) {
    //     goodsArr.push(...upMonthOrder[i].order_goods);
    // }

    // let axisData = [];
    // let seriesData = [];

    // let newArr = _.uniqWith(goodsArr, _.isEqual)

    // for (let i = 0; i < newArr.length; i++) {
    //     let number = 0;
    //     let name = "";
    //     for (let j = 0; j < goodsArr.length; j++) {


    //         if (newArr[i].goodsName == goodsArr[j].goodsName) {
    //             name = goodsArr[j].goodsName;
    //             number += parseInt(goodsArr[j].number);
    //         }
    //     }
    //     axisData.push(name);
    //     seriesData.push(number);
    // }

    // res.send({
    //     axisData,
    //     seriesData,
    // });
});
// //查询商品年销量
// router.get('/ygoodsSalesVolume', async function (req, res) {
//     let {
//         storeId
//     } = req.query;
//     let order = await client.get("/order");
//     let orderArr = [];
//     for (let i = 0; i < order.length; i++) {
//         if (storeId === order[i].store.$id) {
//             orderArr.push(order[i])
//         }
//     }
//     let year = new Date().getFullYear() - 1;

//     let upMonthOrder = [];

//     for (let i = 0; i < orderArr.length; i++) {
//         if (orderArr[i].time.split("-")[0] == year) {
//             upMonthOrder.push(orderArr[i])
//         }
//     }

//     let goodsArr = [];

//     for (let i = 0; i < upMonthOrder.length; i++) {
//         goodsArr.push(...upMonthOrder[i].order_goods);
//     }

//     let axisData = [];
//     let seriesData = [];

//     let newArr = _.uniqWith(goodsArr, _.isEqual)

//     for (let i = 0; i < newArr.length; i++) {
//         let number = 0;
//         let name = "";
//         for (let j = 0; j < goodsArr.length; j++) {
//             if (newArr[i].goodsName == goodsArr[j].goodsName) {
//                 name = goodsArr[j].goodsName;
//                 number += parseInt(goodsArr[j].number);
//             }
//         }
//         axisData.push(name);
//         seriesData.push(number);
//     }

//     res.send({
//         axisData,
//         seriesData,
//     });

// });
//查询月服务预约量
router.get('/mserviceSalesVolume', async function (req, res) {
    // let {
    //     storeId
    // } = req.query;
    // let order = await client.get("/order");
    // let orderArr = [];
    // for (let i = 0; i < order.length; i++) {
    //     if (storeId === order[i].store.$id) {
    //         orderArr.push(order[i])
    //     }
    // }
    // let date = new Date().getMonth();
    // let year = new Date().getFullYear();
    // if (date === 0) {
    //     date = 12;
    //     year = parseInt(year) - 1;
    // }
    // let upMonthOrder = [];

    // for (let i = 0; i < orderArr.length; i++) {
    //     if (orderArr[i].time.split("-")[1] == date && orderArr[i].time.split("-")[0] == year) {
    //         upMonthOrder.push(orderArr[i])
    //     }
    // }

    // let serviceArr = [];

    // for (let i = 0; i < upMonthOrder.length; i++) {
    //     serviceArr.push(...upMonthOrder[i].order_serve);
    // }

    // let axisData = [];
    // let seriesData = [];

    // //数组去重
    // let hash = {};
    // let newArr = serviceArr.reduce(function (item, next) {
    //     hash[next.name] ? '' : hash[next.name] = true && item.push(next);
    //     return item
    // }, [])

    // for (let i = 0; i < newArr.length; i++) {
    //     let number = 0;
    //     let name = "";
    //     for (let j = 0; j < serviceArr.length; j++) {
    //         if (newArr[i].serveName == serviceArr[j].serveName) {
    //             name = serviceArr[j].serveName;
    //             number += 1;
    //         }
    //     }
    //     axisData.push(name);
    //     seriesData.push(number);
    // }

    // res.send({
    //     axisData,
    //     seriesData
    // });



    let {
        storeId,
        year
    } = req.query;
    let order = await client.get("/order");
    let orderArr = [];
    //找到属于当前店铺的订单
    for (let i = 0; i < order.length; i++) {
        if (storeId === order[i].store.$id) {
            orderArr.push(order[i])
        }
    }

    //找到当前年已完成的订单
    let newOrderArr = [];
    for (let i = 0; i < orderArr.length; i++) {
        if (orderArr[i].time.split("-")[0] == year && orderArr[i].state === "已完成") {
            newOrderArr.push(orderArr[i]);
        }
    }

    //将订单按12个月分
    let monthService;
    let january = [];
    let february = [];
    let march = [];
    let april = [];
    let may = [];
    let june = [];
    let july = [];
    let august = [];
    let september = [];
    let october = [];
    let november = [];
    let december = [];
    for (let i = 0; i < newOrderArr.length; i++) {
        if (newOrderArr[i].time.split("-")[1] == 1) {
            january.push(...newOrderArr[i].order_serve);
        } else if (newOrderArr[i].time.split("-")[1] == 2) {
            february.push(...newOrderArr[i].order_serve);
        } else if (newOrderArr[i].time.split("-")[1] == 3) {
            march.push(...newOrderArr[i].order_serve);
        } else if (newOrderArr[i].time.split("-")[1] == 4) {
            april.push(...newOrderArr[i].order_serve);
        } else if (newOrderArr[i].time.split("-")[1] == 5) {
            may.push(...newOrderArr[i].order_serve);
        } else if (newOrderArr[i].time.split("-")[1] == 6) {
            june.push(...newOrderArr[i].order_serve);
        } else if (newOrderArr[i].time.split("-")[1] == 7) {
            july.push(...newOrderArr[i].order_serve);
        } else if (newOrderArr[i].time.split("-")[1] == 8) {
            august.push(...newOrderArr[i].order_serve);
        } else if (newOrderArr[i].time.split("-")[1] == 9) {
            september.push(...newOrderArr[i].order_serve);
        } else if (newOrderArr[i].time.split("-")[1] == 10) {
            october.push(...newOrderArr[i].order_serve);
        } else if (newOrderArr[i].time.split("-")[1] == 11) {
            november.push(...newOrderArr[i].order_serve);
        } else if (newOrderArr[i].time.split("-")[1] == 12) {
            december.push(...newOrderArr[i].order_serve);
        }
    }
    monthService = [january,
        february,
        march,
        april,
        may,
        june,
        july,
        august,
        september,
        october,
        november,
        december
    ];

    let newMonthService = [];
    for (let i = 0; i < monthService.length; i++) {
        newMonthService.push(...monthService[i]);
    }

    //数组去重
    let newArr = [];
    var obj = {};
    for (var i = 0; i < newMonthService.length; i++) {
        if (!obj[newMonthService[i].serveName]) {
            newArr.push(newMonthService[i]);
            obj[newMonthService[i].serveName] = true;
        }
    }

    let seriesData = [];
    let axisData = [];
    for (let i = 0; i < newArr.length; i++) {
        let name = newArr[i].serveName;
        axisData.push(newArr[i].serveName);
        let numberData = [];
        for (let j = 0; j < monthService.length; j++) {
            let number = 0;
            for (let k = 0; k < monthService[j].length; k++) {
                if (monthService[j][k].serveName === newArr[i].serveName) {
                    number += 1;
                }
            }
            numberData.push(number);
        }
        seriesData.push({
            name,
            type: "line",
            stack: name + "订单量",
            smooth: true,
            data: numberData
        });
    }

    res.send({
        axisData,
        seriesData
    });
});

// //查询季服务预约量
router.get('/qserviceSalesVolume', async function (req, res) {
    let {
        storeId,
        year
    } = req.query;
    let order = await client.get("/order");
    let orderArr = [];
    //找到属于当前店铺的订单
    for (let i = 0; i < order.length; i++) {
        if (storeId === order[i].store.$id) {
            orderArr.push(order[i])
        }
    }

    //找到当前年已完成的订单
    let newOrderArr = [];
    for (let i = 0; i < orderArr.length; i++) {
        if (orderArr[i].time.split("-")[0] == year && orderArr[i].state === "已完成") {
            newOrderArr.push(orderArr[i]);
        }
    }

    //将订单按4个季度分
    let MonthService;
    let spring = [];
    let summer = [];
    let autumn = [];
    let winter = [];
    for (let i = 0; i < newOrderArr.length; i++) {
        let month = newOrderArr[i].time.split("-")[1];
        if (month == 1 || month == 2 || month == 3) {
            spring.push(...newOrderArr[i].order_serve);
        } else if (month == 4 || month == 5 || month == 6) {
            summer.push(...newOrderArr[i].order_serve);
        } else if (month == 7 || month == 8 || month == 9) {
            autumn.push(...newOrderArr[i].order_serve);
        } else if (month == 10 || month == 11 || month == 12) {
            winter.push(...newOrderArr[i].order_serve);
        }
    }
    monthService = [spring, summer, autumn, winter];

    let newMonthService = [];
    for (let i = 0; i < monthService.length; i++) {
        newMonthService.push(...monthService[i]);
    }

    //数组去重
    let newArr = [];
    var obj = {};
    for (var i = 0; i < newMonthService.length; i++) {
        if (!obj[newMonthService[i].serveName]) {
            newArr.push(newMonthService[i]);
            obj[newMonthService[i].serveName] = true;
        }
    }

    let series = [];
    let source = [];
    source.push(["season", "spring", "summer", "autumn", "winter"]);

    for (let i = 0; i < newArr.length; i++) {
        let arr = [];
        arr.push(newArr[i].serveName);
        for (let j = 0; j < monthService.length; j++) {
            let number = 0;
            for (let k = 0; k < monthService[j].length; k++) {
                if (newArr[i].serveName == monthService[j][k].serveName) {
                    number += 1;
                }
            }
            arr.push(number);
        }
        source.push(arr);
        series.push({
            type: "bar",
            seriesLayoutBy: "row"
        });
    }


    res.send({
        source,
        series
    });

    // let {
    //     storeId
    // } = req.query;
    // let order = await client.get("/order");
    // let orderArr = [];
    // for (let i = 0; i < order.length; i++) {
    //     if (storeId === order[i].store.$id) {
    //         orderArr.push(order[i])
    //     }
    // }
    // let date = new Date().getMonth() + 1;
    // let year = new Date().getFullYear();
    // let inSeason = [];

    // if (date == 1 || date == 2 || date == 3) {
    //     inSeason = [10, 11, 12];
    // } else if (date == 4 || date == 5 || date == 6) {
    //     inSeason = [1, 2, 3];
    // } else if (date == 7 || date == 8 || date == 9) {
    //     inSeason = [4, 5, 6];
    // } else {
    //     inSeason = [7, 8, 9];
    // }



    // if ((date - 1) === 0) {
    //     year = parseInt(year) - 1;
    // }
    // let upMonthOrder = [];

    // for (let i = 0; i < orderArr.length; i++) {
    //     if ((orderArr[i].time.split("-")[1] == inSeason[0] ||
    //             orderArr[i].time.split("-")[1] == inSeason[1] ||
    //             orderArr[i].time.split("-")[1] == inSeason[2]) &&
    //         orderArr[i].time.split("-")[0] == year) {
    //         upMonthOrder.push(orderArr[i])
    //     }
    // }

    // let serviceArr = [];

    // for (let i = 0; i < upMonthOrder.length; i++) {
    //     serviceArr.push(...upMonthOrder[i].order_serve);
    // }

    // let axisData = [];
    // let seriesData = [];

    // // let newArr = _.uniqWith(goodsArr, _.isEqual)
    // //数组去重
    // let hash = {};
    // let newArr = serviceArr.reduce(function (item, next) {
    //     hash[next.name] ? '' : hash[next.name] = true && item.push(next);
    //     return item
    // }, [])


    // for (let i = 0; i < newArr.length; i++) {
    //     let number = 0;
    //     let name = "";
    //     for (let j = 0; j < serviceArr.length; j++) {


    //         if (newArr[i].serveName == serviceArr[j].serveName) {
    //             name = serviceArr[j].serveName;
    //             number += 1;
    //         }
    //     }
    //     axisData.push(name);
    //     seriesData.push(number);
    // }

    // res.send({
    //     axisData,
    //     seriesData,
    // });

});
// //查询年服务预约量
// router.get('/yserviceSalesVolume', async function (req, res) {

//     let {
//         storeId
//     } = req.query;
//     let order = await client.get("/order");
//     let orderArr = [];
//     for (let i = 0; i < order.length; i++) {
//         if (storeId === order[i].store.$id) {
//             orderArr.push(order[i])
//         }
//     }
//     let year = new Date().getFullYear() - 1;

//     let upMonthOrder = [];

//     for (let i = 0; i < orderArr.length; i++) {
//         if (orderArr[i].time.split("-")[0] == year) {
//             upMonthOrder.push(orderArr[i])
//         }
//     }

//     let serviceArr = [];

//     for (let i = 0; i < upMonthOrder.length; i++) {
//         serviceArr.push(...upMonthOrder[i].order_serve);
//     }

//     let axisData = [];
//     let seriesData = [];

//     // let newArr = _.uniqWith(goodsArr, _.isEqual)
//     //数组去重
//     let hash = {};
//     let newArr = serviceArr.reduce(function (item, next) {
//         hash[next.name] ? '' : hash[next.name] = true && item.push(next);
//         return item
//     }, [])


//     for (let i = 0; i < newArr.length; i++) {
//         let number = 0;
//         let name = "";
//         for (let j = 0; j < serviceArr.length; j++) {


//             if (newArr[i].serveName == serviceArr[j].serveName) {
//                 name = serviceArr[j].serveName;
//                 number += 1;
//             }
//         }
//         axisData.push(name);
//         seriesData.push(number);
//     }

//     res.send({
//         axisData,
//         seriesData,
//     });

// });
//查询ID
router.get('/:id', async function (req, res) {
    let id = req.params.id;
    let data = await client.get('/goods/' + id, {
        submitType: "findJoin",
        ref: "store"
    });
    res.send(data);
});

//修改
router.put("/:id", async function (req, res) {
    let id = req.params.id;
    let obj = req.body;

    delete obj._id;

    obj.store = {
        $ref: "store",
        $id: obj.store._id
    }

    let data = await client.put('/goods/' + id, obj);
    res.send({
        "status": 1
    });
});

//删除
router.delete("/:id", async function (req, res) {
    let id = req.params.id;
    await client.delete('/goods/' + id);
    res.send({
        "status": 1
    });
});

module.exports = router;