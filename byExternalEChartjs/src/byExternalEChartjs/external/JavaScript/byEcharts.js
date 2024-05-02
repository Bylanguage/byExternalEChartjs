
window.byExternalEChartjs_byEChartjs = (function () {
  const colors = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf'];

  function stringToColor(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const ret = colors[Math.abs(hash) % colors.length];

    return ret;
  }

  function getGradientColors(name) {
    const mainColor = stringToColor(name);
    const gradientColor = stringToColor('gradient' + name);
     
    return {
      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        {
          offset: 0,
          color: mainColor
        },
        {
          offset: 1,
          color: gradientColor
        }
      ])
    };
  }

  const timerStore = {};
  function register(id,timer) {
    timerStore[id] = timer;
  }
  function dispose(id) {
    const e = timerStore[id];
    if (e) {
      clearInterval(e);

    }

  }
  return class {

    /**
/**
 * 创建一个区域堆栈渐变。
 *
 * @param {string} id - 应用渐变的元素的ID。
 * @param {string} title - 图表的标题。
 * @param {string[]} header - 横坐标名称。
 * @param {CharDataArr[]} data {xData:系列名称,yData:表示每个系列的数据点，条数和names数量对应}[] - 系列的数据。  
 * 
 */
static areaStackGradient(id, title, header, data ) {
  if(typeof data =="string"){
      data=JSON.parse(data);
  }
   
  var chartDom = document.getElementById(id);
  var myChart = echarts.init(chartDom);
  var option = {
    //color: echarts.color,
    title: {
      text: title
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985'
        }
      }
    },
    legend: {
      data:data.map(e=>e.xData)
    },
    toolbox: {
      feature: {
        saveAsImage: {}
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        data: header
      }
    ],
    yAxis: [
      {
        type: 'value'
      }
    ],
    series: data.map((item) => {
      const colors = getGradientColors(item.xData);
      return {
        name: item,
        type: 'line',
        stack: 'Total',
        smooth: true,
        lineStyle: {
          width: 0
        },
        showSymbol: false,
        areaStyle: {
          opacity: 0.8,
          color: colors.color
        },
        emphasis: {
          focus: 'series'
        },
        data: item.yData
      };
    })
  };
  
  option && myChart.setOption(option);
}

    /**
 * @param {string} id - id of the div element
 * @param {string} title - title of the
 * @param {string[]} header - ['A','B','C','D','E']
* @param {CharDataArr[]} list - [[time,1,2,3,4,5],[time,2,3,4,5,6],...]
 *
 * 2. 动态条形图,用于表现数据随时间变化
*/
  static barRace(id, title, header, list) 
  {
    if(typeof list =="string")
    {
        list=JSON.parse(list);
    }
  const chartDom = document.getElementById(id);
  const myChart = echarts.init(chartDom);
  let i = 0;  
  
  const option = {
    title: {
      text: title
    },
    xAxis: {
      max: 'dataMax'
    },
    yAxis: {
      type: 'category',
      data: header,
      inverse: true,
      animationDuration: 300,
      animationDurationUpdate: 300,
       // only the largest 3 bars will be displayed
    },
    series: [
      {
        realtimeSort: true,
        name: 'X',
        type: 'bar',
        data: list[0].yData,
        label: {
          show: true,
          position: 'right',
          valueAnimation: true
        }
      }
    ],
    legend: {
      show: true
    },
    animationDuration: 0,
    animationDurationUpdate: 3000,
    animationEasing: 'linear',
    animationEasingUpdate: 'linear'
  };
  function run() {    
    myChart.setOption({
      series: [
        {
          name: list[i].xData,
          data: list[i].yData
        }
      ]
    });
  }
  setTimeout(function () {
    run();
  }, 0);
  var t = setInterval(function () {   
    i = i % list.length;
    i++;  
    run();
  }, 3000);
  register(id, t); 
  option && myChart.setOption(option);
}
    /**
     * 3. 创建一个简单的柱状图。
     * @param {string} id
     * @param {string} title
     * @param {Array} xData
     * @param {Array} yData
     */
    static barSimple(id, title, xData, yData) {
      var myChart = echarts.init(document.getElementById(id));
      var option = {
        title: {
          text: title
        },
        tooltip: {},
        xAxis: {
          data: xData
        },
        yAxis: {},
        series: [{

          type: 'bar',
          data: yData
        }]
      };
      myChart.setOption(option);

    }    /**
* 
* 4.动态线形态
* @param {string} eleId - 应用的元素的ID.
* @param {Array<{label: string, xData: number, yData: number}>} data - The data for the chart. Each object in the array represents a data point in the chart, with a label (country name), xData (x-axis value), and yData (y-axis value).
*@param {string} type - 数据的类型.
 @param {string} xlabel - The label for the x-axis.
* @param {string} ylabel - The label for the y-axis.
*/
    static lineRace(eleId, title, type, data, xlabel, ylabel) {
      if (typeof data == "string") {
        data = JSON.parse(data);
      }
      const id = "all"
      const dataset = [[
        type,
        xlabel,
        ylabel,
      ]];
      const labelsRecord = {};
      for (let i = 0; i < data.length; i++) {
        dataset.push([
          data[i].label,
          data[i].xData,
          data[i].yData
        ]);
        labelsRecord[data[i].label] = true;
      }
      const labels = Object.keys(labelsRecord);
      const seriesList = [];
      const datasetWithFilters = [];
      for (let i = 0; i < labels.length; i++) {
        const datasetId = "dataset_" + labels[i];
        datasetWithFilters.push({
          id: datasetId,
          fromDatasetId: id,
          transform: {
            type: 'filter',
            config: {
              and: [
                {
                  dimension: type,
                  '=': labels[i]
                }
              ]
            }
          }
        });
        seriesList.push({
          type: 'line',
          name: labels[i],
          datasetId: datasetId,
          emphasis: {
            focus: 'series'
          },
          encode: {
            x: xlabel,
            y: ylabel,
            label: [type, xlabel],
            itemName: xlabel,
            tooltip: [ylabel]
          },
        });
      }
      const option = {
        animationDuration: 10000,
        title: {
          text: title
        },
        dataset: [
          {
            id: id,
            source: dataset
          },
          ...datasetWithFilters
        ],
        xAxis: {
          type: 'category',
          nameLocation: xlabel,
        },
        yAxis: {
          name: ylabel,
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        series: seriesList
      };
      const myChart = echarts.init(document.getElementById(eleId));

      myChart.setOption(option);
    }

    /**
     * 5.箱型图，用于展示数据的分布情况
     * @param {number[][]} data - 数据
     * @param {string} id - 要渲染的元素的id
     * @param {string} title - 标题
    */
    static boxplot(id, title, data) {
      const myChart = echarts.init(document.getElementById(id));

      const option = {
        title: [
          {
            text: title,
            left: 'center'
          },

        ],
        dataset: [
          {
            // prettier-ignore
            source: data
          },
          {
            transform: {
              type: 'boxplot',

            }
          },
          {
            fromDatasetIndex: 1,
            fromTransformResult: 1
          }
        ],
        tooltip: {
          trigger: 'item',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '10%',
          right: '10%',
          bottom: '15%'
        },
        xAxis: {
          type: 'category',
          boundaryGap: true,
          nameGap: 30,
          splitArea: {
            show: false
          },
          splitLine: {
            show: false
          }
        },
        yAxis: {
          type: 'value',
          splitArea: {
            show: true
          }
        },
        series: [
          {
            name: 'boxplot',
            type: 'boxplot',
            datasetIndex: 1
          },
          {
            name: 'outlier',
            type: 'scatter',
            datasetIndex: 2
          }
        ]
      };
      myChart.setOption(option);
    }

    /**
     * 6.堆叠柱形图
     * @param {string} id - id of the div element
     * @param {string} title - title of the stack bar chart
     * @param {object} data - {thu: {
     *                          Email: 120,
     *                         Union Ads: 220, },
     *                           fri: {
     *                              Email: 132,
     *                              Union Ads: 182,
     *                         }, ...}
    */
    static stackBar(id, title, data) {

      if (typeof data == "string") {

        data = JSON.parse(data)
      }
      // 1. Initialize ECharts instance
      var chart = echarts.init(document.getElementById(id));

      // 2. Create an empty array to store categories for xAxis
      var categories = [];

      // 3. Create an empty object to store data for each series
      var seriesData = {};

      // 4. Iterate over the input data object
      for (var key in data) {
        // Add the key (date) to the categories array
        categories.push(key);

        // Iterate over the inner object
        for (var innerKey in data[key]) {
          // If the seriesData object doesn't have a property for this innerKey, add one
          if (!seriesData[innerKey]) {
            seriesData[innerKey] = [];
          }

          // Add the data to the appropriate series
          seriesData[innerKey].push(data[key][innerKey]);
        }
      }

      // 5. Convert the seriesData object to an array format that ECharts can understand
      var series = [];
      for (var key in seriesData) {
        series.push({
          name: key,
          type: 'bar',
          stack: 'Ad',
          emphasis: {
            focus: 'series'
          },
          data: seriesData[key]
        });
      }

      // 6. Set the options for the ECharts instance
      var option = {
        title: {
          text: title
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {},
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: categories
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: series
      };

      // 7. Use the set options to update the ECharts instance
      chart.setOption(option);
    }

    /**
     * 7.蜡烛图
     * @typedef {Object} CharData
     * @property {number} xData -The x coordinate
     * @property {number[]} yData -The y coordinate
     * @type {CharData[]}
     * 
     * @param {CharData[]} data 
    */
    static candlestick(id, title, data) {
      if (typeof data == "string") {
        data = JSON.parse(data);
      }
      const option = {
        title: {
          text: title
        },
        xAxis: {
          data: data.map(d => d["xData"])
        },
        yAxis: {},
        series: [{
          data: data.map(ele => ele.yData),
          type: 'candlestick'
        }]
      };
      const chart = echarts.init(document.getElementById(id));

      chart.setOption(option);
    }

    // 
    /**8.上证指数
     
     *  - The date of the stock data.
     * @property {number} open - The opening price of the stock.
     * @property {number} close - The closing price of the stock.
     * @property {number} low - The lowest price of the stock.
     * @property {number} high - The highest price of the stock.
       @param {CharDataArr[]} stockData
    */

    static candlestick_sh(id, title, data) {

      if (typeof data == "string") {
        data = JSON.parse(data);
      }
      const upColor = '#ec0000';
      const upBorderColor = '#8A0000';
      const downColor = '#00da3c';
      const downBorderColor = '#008F28';

      const chart = echarts.init(document.getElementById(id));

      const xAxisData = data.map(d => d.xData);
      const seriesData = data.map(ele => ele.yData);
      function calculateMA(dayCount, stockData) {

        var result = [];
        for (var i = 0, len = stockData.length; i < len; i++) {
          if (i < dayCount) {
            result.push('-');
            continue;
          }
          var sum = 0;
          for (var j = 0; j < dayCount; j++) {
            sum += +stockData[i - j].yData[1];
          }
          result.push(sum / dayCount);
        }
        return result;
      }
      const option = {
        title: {
          text: title,
          left: 0
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        legend: {
          data: ['日K', 'MA5', 'MA10', 'MA20', 'MA30']
        },
        grid: {
          left: '10%',
          right: '10%',
          bottom: '15%'
        },
        xAxis: {
          type: 'category',
          data: xAxisData,
          boundaryGap: false,
          axisLine: { onZero: false },
          splitLine: { show: false },
          min: 'dataMin',
          max: 'dataMax'
        },
        yAxis: {
          scale: true,
          splitArea: {
            show: true
          }
        },
        dataZoom: [
          {
            type: 'inside',
            start: 50,
            end: 100
          },
          {
            show: true,
            type: 'slider',
            top: '90%',
            start: 50,
            end: 100
          }
        ],
        series: [
          {
            name: '日K',
            type: 'candlestick',
            data: seriesData,
            itemStyle: {
              color: upColor,
              color0: downColor,
              borderColor: upBorderColor,
              borderColor0: downBorderColor
            },
            markPoint: {
              label: {
                formatter: function (param) {
                  return param != null ? Math.round(param.value) + '' : '';
                }
              },
              data: [

                {
                  name: 'highest value',
                  type: 'max',
                  valueDim: 'highest'
                },
                {
                  name: 'lowest value',
                  type: 'min',
                  valueDim: 'lowest'
                },
                {
                  name: 'average value on close',
                  type: 'average',
                  valueDim: 'close'
                }
              ],
              tooltip: {
                formatter: function (param) {
                  return param.name + '<br>' + (param.data.coord || '');
                }
              }
            },

          },
          {
            name: 'MA5',
            type: 'line',
            data: calculateMA(5, data),
            smooth: true,
            lineStyle: {
              opacity: 0.5
            }
          },
          {
            name: 'MA10',
            type: 'line',
            data: calculateMA(10, data),
            smooth: true,
            lineStyle: {
              opacity: 0.5
            }
          },
          {
            name: 'MA20',
            type: 'line',
            data: calculateMA(20, data),
            smooth: true,
            lineStyle: {
              opacity: 0.5
            }
          },
          {
            name: 'MA30',
            type: 'line',
            data: calculateMA(30, data),
            smooth: true,
            lineStyle: {
              opacity: 0.5
            }
          }
        ]
      };
      chart.setOption(option);

    }

    /**
     * 9.函数图像
       * @typedef {Object} ChartData
       * @property {number} xData -The x coordinate
       * @property {number} yData -The y coordinate
       * @type {ChartData[]}
       * 
       * @param {ChartData[]} data - The data to be smoothed
      */
    static lineSmooth(id, title, data) {
      if (typeof data == "string") {
        data = JSON.parse(data);
      }
      const option = {
        title: {
          text: title
        },
        xAxis: {
          type: 'category',
          data: data.map(d => d.xData)
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: data.map(d => d.yData),
            type: 'line',
            smooth: true
          }
        ]
      };
      const chart = echarts.init(document.getElementById(id));

      chart.setOption(option);
    }

    /**
     * 10.散点图
     * @param {number[]} data 
    */
    static scatter(id, title, data) {

      const option = {
        title: {
          text: title
        },
        xAxis: {},
        yAxis: {},
        series: [{
          symbolSize: 20,
          data: data,
          type: 'scatter'
        }]
      };
      const chart = echarts.init(document.getElementById(id));

      chart.setOption(option);
    }
    /**11.树形图
     * @typedef {Object} TreeNode
     * @property {string} name - The name of the node.
     * @property {number} value - The value of the node. 
     * @property {TreeNode[]} children - The children of the node.
     * @param {string} id - id of the div element
     * @param {TreeNode[]} data - The data of the tree
    */
    static treeBasic(id, title, data) {
      const myChart = echarts.init(document.getElementById(id));
      if (typeof data == "string") {
        data = JSON.parse(data);
      }

      const option = {
        title: {
          text: title
        },
        tooltip: {
          trigger: 'item',
          triggerOn: 'mousemove'
        },
        series: [
          {
            type: 'tree',
            data: [data],
            top: '1%',
            left: '7%',
            bottom: '1%',
            right: '20%',
            symbolSize: 7,
            label: {
              position: 'left',
              verticalAlign: 'middle',
              align: 'right'
            },
            leaves: {
              label: {
                position: 'right',
                verticalAlign: 'middle',
                align: 'left'
              }
            },
            emphasis: {
              focus: 'descendant'
            },
            expandAndCollapse: true,
            animationDuration: 550,
            animationDurationUpdate: 750
          }
        ]
      };
      myChart.setOption(option);
    }


    /**
 * 
 * 12.漏斗图
 * @property {number} value - The value of the item.
 * @property {string} name - The name of the item.
 * 
 * @param {string} id - id of the div element
 * @param {ChartData[]} data - The data of the funnel
 */
    static funnel(id, title, data) {
      if (typeof data == "string") {
        data = JSON.parse(data);
      }
      data = data.map(ele => {
        return {
          value: ele.yData,
          name: ele.label
        }

      })
      const myChart = echarts.init(document.getElementById(id));

      const option = {
        title: {
          text: title
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c}%'
        },
        toolbox: {
          feature: {
            dataView: { readOnly: false },
            restore: {},
            saveAsImage: {}
          }
        },
        legend: {
          data: data.map(item => item.name)
        },
        series: [
          {
            name: 'Funnel',
            type: 'funnel',
            left: '10%',
            top: 60,
            bottom: 60,
            width: '80%',
            min: 0,
            max: 100,
            minSize: '0%',
            maxSize: '100%',
            sort: 'descending',
            gap: 2,
            label: {
              show: true,
              position: 'inside'
            },
            labelLine: {
              length: 10,
              lineStyle: {
                width: 1,
                type: 'solid'
              }
            },
            itemStyle: {
              borderColor: '#fff',
              borderWidth: 1
            },
            emphasis: {
              label: {
                fontSize: 20
              }
            },
            data: data
          }
        ]
      };
      myChart.setOption(option);
    }
    /**
     * 13.饼图
 * @param {string} id - id of the div element
 * @param {CharData} data - [{value: 1, name: 'foo'}, {value: 2, name: 'bar'}, ...]
*/
    static pieSimple(id, title, data) {
      if (typeof data == "string") {
        data = JSON.parse(data);
      }
      data = data.map(e => {
        return { value: e.yData, name: e.label };
      })
      const myChart = echarts.init(document.getElementById(id));

      const option = {
        title: {
          text: title,
          left: "center"
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'left'
        },
        series: [
          {
            name: 'Access From',
            type: 'pie',
            radius: '50%',
            data: data,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      };
      myChart.setOption(option);
    }

    /**
     * 14.圆角饼图
     * @param {string} id - id of the div element
     * @param {string} title - title of the pie chart
     * @param {ChartData[]} data -  
     * 
    */
    static pieBorderRadius(id, title, data) {
      // Initialize echarts instance with prepared DOM
      var myChart = echarts.init(document.getElementById(id));

      if (typeof data == "string") {
        data = JSON.parse(data);
      }
      // Transform the data into a suitable format
      var transformedData = data.map(e => ({
        name: e.label,
        value: e.yData
      }));

      // Use the same options as before, but replace the title and data
      var option = {
        title: {
          text: title,
          left: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          top: '5%',
          left: 'center'
        },
        series: [
          {

            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: true,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 40,
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: transformedData
          }
        ]
      };

      // Use the specified configuration to show the chart
      myChart.setOption(option);
    }
    /**
     * 15.雷达图
    * @param {string} id - id of the div element
    * @param {string} title - title of the radar chart
    * @param {ChartDataArr[]} data -  
    * @param {ChartData[]} indicator 指标
    * 
      
   */
    static radar(id, titles, data, indicator) {
      if (typeof data == "string") {
        data = JSON.parse(data);
      }
      if (typeof indicator == "string") {
        indicator = JSON.parse(indicator);
      }
      const myChart = echarts.init(document.getElementById(id));

      const option = {
        title: {
          text: titles
        },
        tooltip: {},
        legend: {
          data: data.map(item => item.xData)
        },
        radar: {
          indicator: indicator.map(item => ({ name: item.label, max: item.yData }))
        },
        series: [{
          type: 'radar',
          data: data.map(e => {
            return {
              value: e.yData,
              name: e.xData
            }

          })
        }]
      };
      myChart.setOption(option);
    }

    /**
     * 16. 力导向图
     * @param {string} id - id of the div element
     * @param {string} title - title of the graph
     * @param {object[]} data - [{id:number, name: string, value: number}, {name: 'bar', value: 2}, ...]
    *  @param {[number,number][]} links  - [[0,1],[1,2],...]
    */
    static graphForce(id, title, data, links) {
      const myChart = echarts.init(document.getElementById(id));

      if (typeof data == "string") {
        data = JSON.parse(data);
      }
      const option = {
        title: {
          text: title,
          left: 'center'
        },
        tooltip: {
          formatter: function (x) {
            return x.label;
          }
        },
        legend: [

        ],
        series: [
          {
            name: title,
            type: 'graph',
            layout: 'force',
            data: data.map((e, i) => {
              e.draggable = true;
              e.itemStyle = { color: echarts.color.random() };
              e.id = i;
              e.name = e.label;
              return e;
            }),
            links: links.map(e => {
              return { source: e[0], target: e[1] }
            }),
            categories: data.map((e, i) => {
              return { name: e.label, id: i }
            }),
            roam: true,
            label: {
              position: 'right'
            },
            force: {
              repulsion: 100
            }
          }
        ]
      };
      myChart.setOption(option);
    }
    /**
 * 17. 绘制函数图像
 * @param {string} id - id of the div element
 * @param {string} title - title of the tree chart
 * @param {[number,number][]} data -[[x,y],...
 */
    static lineFunction(id, title, data) {
      const myChart = echarts.init(document.getElementById(id));

      let min = Infinity;
      let max = -Infinity;
      for (let i = 0; i < data.length; i++) {
        min = Math.min(min, data[i][1]);
        max = Math.max(max, data[i][1]);
      }
      min = Math.floor(min);
      max = Math.ceil(max);
      const d = max - min;
      min -= d / 2;
      max += d / 2;
      console.log(min, max, "min,max")
      const option = {
        title: {
          text: title
        },
        animation: false,
        xAxis: {
          name: 'x',
          minorTick: {
            show: true
          },
          minorSplitLine: {
            show: true
          }
        },
        yAxis: {
          name: 'y',
          min,
          max,
          minorTick: {
            show: true
          },
          minorSplitLine: {
            show: true
          }
        },
        dataZoom: [
          {
            show: true,
            type: 'inside',
            filterMode: 'none',
            xAxisIndex: [0],
            startValue: -20,
            endValue: 20
          },
          {
            show: true,
            type: 'inside',
            filterMode: 'none',
            yAxisIndex: [0],
            startValue: min,
            endValue: max
          }
        ],
        series: [
          {
            type: 'line',
            showSymbol: false,
            clip: true,
            data
          }
        ]
      };
      myChart.setOption(option);
    }
    /**
     * 18 南丁格尔玫瑰图
     * @param {string} id - id of the div element
     * @param {ChartData[]} data [{name:'a',value:1},...]
    */
    static Nightingale_rose(id, title, data) {
      if (typeof data == "string") {
        data = JSON.parse(data);
      }
      data = data.map(e => {
        return { name: e.label, value: e.yData };
      });
      const myChart = echarts.init(document.getElementById(id));

      const option = {
        title: {
          text: title
        },
        legend: {
          top: 'bottom'
        },
        toolbox: {
          show: true,
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        series: [
          {
            name: 'Nightingale Chart',
            type: 'pie',
            radius: [50, 250],
            center: ['50%', '50%'],
            roseType: 'area',
            itemStyle: {
              borderRadius: 8
            },
            data: data
          }
        ]
      };
      myChart.setOption(option);
    }

    /**
     * 19.旭日图
     * 用户可以通过颜色和大小快速理解数据的层次和比例关系。
     * @param {string} id - id of the div element
     * @param {string} title - title of the sunburst chart
     * 
     * @typedef {Object} Node
     * @property {string} name - The name of the node.
     * @property {number} [value] - The value of the node.
     * @property {Node[]} [children] - The children of the node.
      
    *  @param {Node[]} data - The data of the sunburst
    */

    static sunburst(id, title, data) {
      const myChart = echarts.init(document.getElementById(id));

      if (typeof data == "string") {
        data = JSON.parse(data);
      }
      const option = {
        title: {
          text: title
        },
        series: {
          type: 'sunburst',
          // emphasis: {
          //     focus: 'ancestor'
          // },
          data: data,
          radius: [0, '90%'],
          label: {
            rotate: 'radial'
          }
        }
      };
      myChart.setOption(option);
    }

    /**
     * 20.河流图
     * @param {string} id - id of the div element
     * @param {string} title - title of the themeRiver chart
     * @param {CharData[]} data - [{label: 日期, yData:值,xData:类型枚举}, ...]
     * @param {string[]} lengend - ['a','b','c'] 枚举的数组
     * 时间轴：themeRiver 的 x 轴通常代表时间，显示数据随时间的变化。
      层叠区域：themeRiver 的 y 轴代表数量或度量，每个主题或事件是一个层叠的区域，区域的宽度表示在特定时间点的数量或度量。
      中心基线：与传统的堆叠区域图不同，themeRiver 的基线（所有区域的“底部”）通常在图表的中心，这使得主题或事件的变化更加明显。
    */
    static themeRiver(id, title, data, lengend) {
      const echarts_instance = echarts.init(document.getElementById(id));

      if (typeof data == "string") {
        data = JSON.parse(data);
      }

      const option = {
        title: {
          text: title
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'line',
            lineStyle: {
              color: 'rgba(0,0,0,0.2)',
              width: 1,
              type: 'solid'
            }
          }
        },
        legend: {
          data: lengend
        },
        singleAxis: {
          top: 50,
          bottom: 50,
          axisTick: {},
          axisLabel: {},
          type: 'time',
          axisPointer: {
            animation: true,
            label: {
              show: true
            }
          },
          splitLine: {
            show: true,
            lineStyle: {
              type: 'dashed',
              opacity: 0.2
            }
          }
        },
        series: [
          {
            type: 'themeRiver',
            emphasis: {
              itemStyle: {
                shadowBlur: 20,
                shadowColor: 'rgba(0, 0, 0, 0.8)'
              }
            },
            data: data.map(item => {
              return [item.label, item.yData, lengend[item.xData]]
            })
          }
        ]
      };
      echarts_instance.setOption(option);
    }

    /**
     * 21. 散点聚合条形图
    这个函数可以用于探索离散变量和两个连续变量之间的关系。
    参数：
    
     `data`：一个包含至少三个维度的数据集，其中一个维度是离散的（例如性别），其他两个维度是连续的（例如身高和体重）。
     数据应该是一个对象,键名作为离散维度，值是一个数组，数组中的每个元素是一个数组，包含两个数字，分别代表两个连续维度的值。 
    
     * @param {string} id - 一个字符串，代表图表的id。
     * @param {ChartData[]} data -  label 类别数据，xData 维度1数据，yData 维度2数据 如{label:"male",weight:80,height:180}
    
    */
    static scatterAggreateBar(id, data) {
      if (typeof data == "string") {
        data = JSON.parse(data);
      }
      const scatterOption = (data) => {
        const dataKeys = Object.keys(data);
        const series = dataKeys.map((key) => ({
          type: 'scatter',
          id: key,
          dataGroupId: key,
          universalTransition: {
            enabled: true,
            delay: function (idx, count) {
              return Math.random() * 400;
            }
          },
          data: data[key]
        }));

        return {
          xAxis: { scale: true },
          yAxis: { scale: true },
          series
        };
      };


      function makeBarChart(data) {
        return {
          xAxis: {
            type: 'category',
            data: Object.keys(data)
          },
          yAxis: {},
          series: [
            {
              type: 'bar',
              id: 'total',
              data: Object.keys(data).map(key => {
                return {
                  value: data[key].length,
                  groupId: key
                };
              }),
              universalTransition: {
                enabled: true,
                seriesKey: Object.keys(data),
                delay: function (idx, count) {
                  return Math.random() * 400;
                }
              }
            }
          ]
        };

      }
      const myChart = echarts.init(document.getElementById(id));
      let flag = false;
      if (typeof data == "string") {
        data = JSON.parse(data);
      }
      var tmp = {};
      data.forEach(item => {
        tmp[item.label] = tmp[item.label] || [];
        tmp[item.label].push([item.xData, item.yData]);
      });

      var t = setInterval(function () {
        flag = !flag;
        myChart.setOption(flag ? makeBarChart(tmp) : scatterOption(tmp), true);
      }, 2000);
      register(id,t);

    }

    static dispose(id, distoryDom = true) {
      var chart = echarts.getInstanceByDom(document.getElementById(id));
      if (chart) {
        chart.dispose();
      }
      if (distoryDom) {
        var dom = document.getElementById(id);
        dom.parentNode.removeChild(dom);
      }
    }
    
    static debug(){
      debugger;
    }
  }








})()