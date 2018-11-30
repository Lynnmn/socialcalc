$(document).ready(function() {
    // var editor = SocialCalc.EditorStepInfo.editor;
    function getColName(col, length) {
        const letters = ["A","B","C","D","E","F","G","H","I","J","K","L","M",
        "N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
        let endCol = ''
        if(col && col.length === 1) {
            const startCode =  col.charCodeAt(0)
            const maxLength =  90 - startCode
            if(length < maxLength ) {
                const endCode = startCode + length
                endCol = String.fromCharCode(endCode)
            } else {
                const low = (length - maxLength) / 26
                const high = (length - maxLength) % 26
                if(low) {
                    endCol = letters[low] + letters[high - 1]
                } else {
                    endCol = letters[high]
                }
            }
        }
        return endCol
    }

    function renderChart(type) {
        const editor = SocialCalc.Keyboard.focusTable
        const cells = workbook.getCurrentSheet().cells
        const { anchorcoord, bottom, top, left, right } = editor.range || {}
        const col = anchorcoord && anchorcoord.slice(0, 1)
        const endCol = getColName(col, right - left)
        var json = {};
        if(type === 'pie') {
            const data = []
            console.log($("#col"), $("#col")[0].checked)
            for(var key in cells) {
                const keyCol = key.slice(0, 1)
                const keyNum = key.slice(1)
                if(keyCol === col && keyNum >= top && keyNum <= bottom) {
                    data.push([ key, cells[key].datavalue ])
                }
                
            }
            console.log(data)
            var chart = {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false
            };
            // var title = {
            //     text: '2014 年各浏览器市场占有比例'   
            // };      
            var tooltip = {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            };
            var plotOptions = {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                        style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                        }
                    }
                }
            };
            var series= [{
                type: 'pie',
                name: '数据',
                data: data
            }]; 
            
            json.chart = chart; 
            json.title = title;     
            json.tooltip = tooltip;  
            json.series = series;
            json.plotOptions = plotOptions;
           
        } else if(selectedChart === 'line') {
            return renderChartLine({title:"haha", subtitle:"sub haha", firstColAsX:true, firstRowAsS:true});
        } else if(selectedChart === 'bar') {
            var chart = {
                type: 'column'
             };
             var title = {
                text: '柱状图'   
             };
             var subtitle = {
                text: 'Source: runoob.com'  
             };
             var xAxis = {
                categories: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
                crosshair: true
             };
             var yAxis = {
                min: 0,
                title: {
                   text: 'Rainfall (mm)'         
                }      
             };
             var tooltip = {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                   '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
                footerFormat: '</table>',
                shared: true,
                useHTML: true
             };
             var plotOptions = {
                column: {
                   pointPadding: 0.2,
                   borderWidth: 0
                }
             };  
             var credits = {
                enabled: false
             };
             
             var series= [{
                  name: 'Tokyo',
                      data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
                  }, {
                      name: 'New York',
                      data: [83.6, 78.8, 98.5, 93.4, 106.0, 84.5, 105.0, 104.3, 91.2, 83.5, 106.6, 92.3]
                  }, {
                      name: 'London',
                      data: [48.9, 38.8, 39.3, 41.4, 47.0, 48.3, 59.0, 59.6, 52.4, 65.2, 59.3, 51.2]
                  }, {
                      name: 'Berlin',
                      data: [42.4, 33.2, 34.5, 39.7, 52.6, 75.5, 57.4, 60.4, 47.6, 39.1, 46.8, 51.1]
             }];     
                
            //  var json = {};   
             json.chart = chart; 
             json.title = title;   
             json.subtitle = subtitle; 
             json.tooltip = tooltip;
             json.xAxis = xAxis;
             json.yAxis = yAxis;  
             json.series = series;
             json.plotOptions = plotOptions;  
             json.credits = credits;
            //  $('#chart-container').highcharts(json);
        } else if(selectedChart === 'area') {
            var chart = {
                type: 'area'
             };
             var title = {
                text: 'US and USSR nuclear stockpiles'   
             };
             var subtitle = {
                text: 'Source: <a href="http://thebulletin.metapress.com/content/c4120650912x74k7/fulltext.pdf">' +
                   'thebulletin.metapress.com</a>'  
             };
             var xAxis = {
                allowDecimals: false,
                labels: {
                   formatter: function () {
                      return this.value; // clean, unformatted number for year
                   }
                }
             };
             var yAxis = {
                title: {
                   text: 'Nuclear weapon states'
                },
                labels: {
                   formatter: function () {
                      return this.value / 1000 + 'k';
                   }
                }
             };
             var tooltip = {
                pointFormat: '{series.name} produced <b>{point.y:,.0f}</b><br/>warheads in {point.x}'
             };
             var plotOptions = {
                area: {
                   pointStart: 1940,
                   marker: {
                      enabled: false,
                      symbol: 'circle',
                      radius: 2,
                      states: {
                         hover: {
                           enabled: true
                         }
                      }
                   }
                }
             };
             var series= [{
                   name: 'USA',
                      data: [null, null, null, null, null, 6, 11, 32, 110, 235, 369, 640,
                          1005, 1436, 2063, 3057, 4618, 6444, 9822, 15468, 20434, 24126,
                          27387, 29459, 31056, 31982, 32040, 31233, 29224, 27342, 26662,
                          26956, 27912, 28999, 28965, 27826, 25579, 25722, 24826, 24605,
                          24304, 23464, 23708, 24099, 24357, 24237, 24401, 24344, 23586,
                          22380, 21004, 17287, 14747, 13076, 12555, 12144, 11009, 10950,
                          10871, 10824, 10577, 10527, 10475, 10421, 10358, 10295, 10104]
                  }, {
                      name: 'USSR/Russia',
                      data: [null, null, null, null, null, null, null, null, null, null,
                          5, 25, 50, 120, 150, 200, 426, 660, 869, 1060, 1605, 2471, 3322,
                          4238, 5221, 6129, 7089, 8339, 9399, 10538, 11643, 13092, 14478,
                          15915, 17385, 19055, 21205, 23044, 25393, 27935, 30062, 32049,
                          33952, 35804, 37431, 39197, 45000, 43000, 41000, 39000, 37000,
                          35000, 33000, 31000, 29000, 27000, 25000, 24000, 23000, 22000,
                          21000, 20000, 19000, 18000, 18000, 17000, 16000]
                }
             ];     
                
            //  var json = {};   
             json.chart = chart; 
             json.title = title;   
             json.subtitle = subtitle; 
             json.tooltip = tooltip;
             json.xAxis = xAxis;
             json.yAxis = yAxis;  
             json.series = series;
             json.plotOptions = plotOptions;
            //  $('#chart-container').highcharts(json);
        }
        return json
    }

    let selectedChart = ''
    $('.chart-list img').click(function() {
        $('.chart').css('display', 'block')
        $(this).addClass('selected').siblings().removeClass('selected')
        selectedChart = $(this).attr('name')
        $('#chart-demo-wrapper').highcharts(renderChart(selectedChart));
    })
    
    $('#buttonSaveChart').click(function() {
        
        
        $('#chart-container').highcharts(renderChart(selectedChart));
        $('#modelChart').modal('hide')
    })

    $('.chart-delete').click(function() {
        $('.chart').css({
            display: 'none',
            border: 'none'
        })
        $('.chart #chart-container').html('')
    })

    $('#modelChart').on('hide.bs.modal', function(e) {
        if(!$('.chart #chart-container').html()) {
            $('.chart').hide()
        }
    })

    var oBar = document.getElementById('chart')
    var oBox = document.getElementById('chart')
    startDrag(oBar, oBox);

    function renderChartLine(config) {
    // config:{title, subtitle, tooltip, legend, firstColAsX, firstRowAsS}
        const editor = SocialCalc.Keyboard.focusTable
        const cells = workbook.getCurrentSheet().cells
        const { anchorcoord, bottom, top, left, right } = editor.range || {}
        let range = editor.range;
        let startCol = config.firstColAsX ? range.left + 1 : range.left;
        let startRow = config.firstRowAsS ? range.top + 1 : range.top;
        var xAxis = {
            categories: []
        };
        for (let row = startRow; row<=range.bottom; row++) {
            if (config.firstColAsX) {
                xAxis.categories.push(cells[SocialCalc.crToCoord(range.left, row)].datavalue);
            } else {
                xAxis.categories.push("");
            }
        }
        var series =  [];
        if (config.firstRowAsS) {
            for (let col = startCol; col <= range.right; col++) {
                let s = {
                    name: config.firstRowAsS ? cells[SocialCalc.crToCoord(col, range.top)].datavalue : "",
                    data: []
                };
                series.push(s);
            }
        }

        for (let col = startCol; col <= range.right; col++) {
            let data = series[col - startCol].data;
            for (let row=startRow; row<=range.bottom; row++) {
                let coord = SocialCalc.crToCoord(col, row);
                var value = cells[coord].datavalue;
                data.push(value);
            }
        }

        var yAxis = {
            title: {
               text: ''
            },
            plotLines: [{
               value: 0,
               width: 1,
               color: '#808080'
            }]
        };

        var tooltip = {
            valueSuffix: ''
        }

        var legend = {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            borderWidth: 0
        };

        var json = {};
        json.title = {text: config.title };
        json.subtitle = {text: config.subtitle};
        json.xAxis = xAxis;
        json.yAxis = yAxis;
        json.tooltip = tooltip;
        json.legend = legend;
        json.series = series;
        return json;
    }
})
