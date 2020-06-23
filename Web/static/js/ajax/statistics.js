$.ajax({
    url: '/api/temperature',
    dataType: 'json',
    async: true,
    type: 'GET',
    data: {
    },
    success: function (data) {
        if (data.message === "OK") {
            var myChart = echarts.init(document.getElementById("chart-temperature"));
            var option = {
                color: ['#17c65d'],
                tooltip: {
                    trigger: 'axis',
                    formatter: function (info) {
                        var htmlStr = "";
                        htmlStr += info[0].data.datas.value;
                        htmlStr += "℃<br>时间：";
                        htmlStr += info[0].data.datas.time;
                        return htmlStr;
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    top: '0%',
                    containLabel: true
                },
                xAxis: [
                    {
                        type: 'category',
                        boundaryGap: false,
                        data: [],
                        position: 'bottom',
                        axisLine: {
                            onZero: false
                        }
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        min: function (value) {
                            return value.min - 5
                        },
                        max: function (value) {
                            return value.max + 5;
                        },
                    }
                ],
                series: [
                    {
                        name: '邮件营销',
                        type: 'line',
                        stack: '总量',
                        areaStyle: {},
                        data: []
                    },
                ]
            };
            for (var i = 0; i < data.data.length; i++) {
                option.xAxis[0].data.push(data.data[i][0]);
                option.series[0].data.push({
                    value: data.data[i][1], datas: {
                        time: data.data[i][0],
                        value: data.data[i][1],
                    }
                });
            }
            myChart.setOption(option);
        }
    }
});

window.setInterval(function(){$.ajax({
    url: '/api/temperature',
    dataType: 'json',
    async: true,
    type: 'GET',
    data: {
    },
    success: function (data) {
        if (data.message === "OK") {
            var myChart = echarts.init(document.getElementById("chart-temperature"));
            var option = {
                color: ['#17c65d'],
                tooltip: {
                    trigger: 'axis',
                    formatter: function (info) {
                        var htmlStr = "";
                        htmlStr += info[0].data.datas.value;
                        htmlStr += "℃<br>时间：";
                        htmlStr += info[0].data.datas.time;
                        return htmlStr;
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    top: '0%',
                    containLabel: true
                },
                xAxis: [
                    {
                        type: 'category',
                        boundaryGap: false,
                        data: [],
                        position: 'bottom',
                        axisLine: {
                            onZero: false
                        }
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        min: function (value) {
                            return value.min - 5
                        },
                        max: function (value) {
                            return value.max + 5;
                        },
                    }
                ],
                series: [
                    {
                        name: '邮件营销',
                        type: 'line',
                        stack: '总量',
                        areaStyle: {},
                        data: []
                    },
                ]
            };
            for (var i = 0; i < data.data.length; i++) {
                option.xAxis[0].data.push(data.data[i][0]);
                option.series[0].data.push({
                    value: data.data[i][1], datas: {
                        time: data.data[i][0],
                        value: data.data[i][1],
                    }
                });
            }
            myChart.setOption(option);
        }
    }
});},1000);

$.ajax({
    url: '/api/smoke',
    dataType: 'json',
    async: true,
    type: 'GET',
    data: {
    },
    success: function (data) {
        if (data.message === "OK") {
            var myChart = echarts.init(document.getElementById("chart-smoke"));
            var option = {
                color: ['#fd3011'],
                tooltip: {
                    trigger: 'axis',
                    formatter: function (info) {
                        var htmlStr = "";
                        htmlStr += info[0].data.datas.value;
                        htmlStr += "<br>时间：";
                        htmlStr += info[0].data.datas.time;
                        return htmlStr;
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    top: '0%',
                    containLabel: true
                },
                xAxis: [
                    {
                        type: 'category',
                        boundaryGap: false,
                        data: [],
                        position: 'bottom',
                        axisLine: {
                            onZero: false
                        }
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        min: function (value) {
                            return value.min - 5
                        },
                        max: function (value) {
                            return value.max + 5;
                        },
                    }
                ],
                series: [
                    {
                        name: '邮件营销',
                        type: 'line',
                        stack: '总量',
                        areaStyle: {},
                        data: []
                    },
                ]
            };
            for (var i = 0; i < data.data.length; i++) {
                option.xAxis[0].data.push(data.data[i][0]);
                option.series[0].data.push({
                    value: data.data[i][1], datas: {
                        time: data.data[i][0],
                        value: data.data[i][1],
                    }
                });
            }
            myChart.setOption(option);
        }
    }
});

window.setInterval(function(){$.ajax({
    url: '/api/smoke',
    dataType: 'json',
    async: true,
    type: 'GET',
    data: {
    },
    success: function (data) {
        if (data.message === "OK") {
            var myChart = echarts.init(document.getElementById("chart-smoke"));
            var option = {
                color: ['#fd3011'],
                tooltip: {
                    trigger: 'axis',
                    formatter: function (info) {
                        var htmlStr = "";
                        htmlStr += info[0].data.datas.value;
                        htmlStr += "<br>时间：";
                        htmlStr += info[0].data.datas.time;
                        return htmlStr;
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    top: '0%',
                    containLabel: true
                },
                xAxis: [
                    {
                        type: 'category',
                        boundaryGap: false,
                        data: [],
                        position: 'bottom',
                        axisLine: {
                            onZero: false
                        }
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        min: function (value) {
                            return value.min - 5
                        },
                        max: function (value) {
                            return value.max + 5;
                        },
                    }
                ],
                series: [
                    {
                        name: '邮件营销',
                        type: 'line',
                        stack: '总量',
                        areaStyle: {},
                        data: []
                    },
                ]
            };
            for (var i = 0; i < data.data.length; i++) {
                option.xAxis[0].data.push(data.data[i][0]);
                option.series[0].data.push({
                    value: data.data[i][1], datas: {
                        time: data.data[i][0],
                        value: data.data[i][1],
                    }
                });
            }
            myChart.setOption(option);
        }
    }
});},1000);

$.ajax({
    url: '/api/light-intensity',
    dataType: 'json',
    async: true,
    type: 'GET',
    data: {
    },
    success: function (data) {
        if (data.message === "OK") {
            var myChart = echarts.init(document.getElementById("chart-light"));
            var option = {
                color: ['#ffe712'],
                tooltip: {
                    trigger: 'axis',
                    formatter: function (info) {
                        var htmlStr = "";
                        htmlStr += info[0].data.datas.value;
                        htmlStr += "<br>时间：";
                        htmlStr += info[0].data.datas.time;
                        return htmlStr;
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    top: '0%',
                    containLabel: true
                },
                xAxis: [
                    {
                        type: 'category',
                        boundaryGap: false,
                        data: [],
                        position: 'bottom',
                        axisLine: {
                            onZero: false
                        }
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        min: function (value) {
                            return value.min - 5
                        },
                        max: function (value) {
                            return value.max + 5;
                        },
                    }
                ],
                series: [
                    {
                        name: '邮件营销',
                        type: 'line',
                        stack: '总量',
                        areaStyle: {},
                        data: []
                    },
                ]
            };
            for (var i = 0; i < data.data.length; i++) {
                option.xAxis[0].data.push(data.data[i][0]);
                option.series[0].data.push({
                    value: data.data[i][1], datas: {
                        time: data.data[i][0],
                        value: data.data[i][1],
                    }
                });
            }
            myChart.setOption(option);
        }
    }
});

window.setInterval(function(){$.ajax({
    url: '/api/light-intensity',
    dataType: 'json',
    async: true,
    type: 'GET',
    data: {
    },
    success: function (data) {
        if (data.message === "OK") {
            var myChart = echarts.init(document.getElementById("chart-light"));
            var option = {
                color: ['#ffe712'],
                tooltip: {
                    trigger: 'axis',
                    formatter: function (info) {
                        var htmlStr = "";
                        htmlStr += info[0].data.datas.value;
                        htmlStr += "<br>时间：";
                        htmlStr += info[0].data.datas.time;
                        return htmlStr;
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    top: '0%',
                    containLabel: true
                },
                xAxis: [
                    {
                        type: 'category',
                        boundaryGap: false,
                        data: [],
                        position: 'bottom',
                        axisLine: {
                            onZero: false
                        }
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        min: function (value) {
                            return value.min - 5
                        },
                        max: function (value) {
                            return value.max + 5;
                        },
                    }
                ],
                series: [
                    {
                        name: '邮件营销',
                        type: 'line',
                        stack: '总量',
                        areaStyle: {},
                        data: []
                    },
                ]
            };
            for (var i = 0; i < data.data.length; i++) {
                option.xAxis[0].data.push(data.data[i][0]);
                option.series[0].data.push({
                    value: data.data[i][1], datas: {
                        time: data.data[i][0],
                        value: data.data[i][1],
                    }
                });
            }
            myChart.setOption(option);
        }
    }
});},1000);