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
            return renderChartBar({title:"haha", subtitle:"sub haha", firstColAsX:true, firstRowAsS:true});
        } else if(selectedChart === 'area') {
            return renderChartBar({title:"haha", subtitle:"sub haha", firstColAsX:true, firstRowAsS:true});
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

        var credits = {
            enabled: false
        };

        var json = {};
        json.title = {text: config.title };
        json.subtitle = {text: config.subtitle};
        json.xAxis = xAxis;
        json.yAxis = yAxis;
        json.tooltip = tooltip;
        json.legend = legend;
        json.series = series;
        json.credits = credits;
        return json;
    }

    function renderChartBar(config) {
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

        var credits = {
            enabled: false
        };

        var plotOptions = {
            column: {
               pointPadding: 0.2,
               borderWidth: 0
            }
         };

        var json = {};
        json.chart = {type: 'column'};
        json.title = {text: config.title };
        json.subtitle = {text: config.subtitle};
        json.xAxis = xAxis;
        json.yAxis = yAxis;
        json.tooltip = tooltip;
        json.legend = legend;
        json.series = series;
        json.plotOptions = plotOptions;
        json.credits = credits;
        return json;
    }

    function renderChartBar(config) {
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

        var legend = {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            borderWidth: 0
        };

        var credits = {
            enabled: false
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

        var json = {};
        json.chart = {type: 'area'};
        json.title = {text: config.title };
        json.subtitle = {text: config.subtitle};
        json.xAxis = xAxis;
        json.yAxis = yAxis;
        json.tooltip = tooltip;
        json.legend = legend;
        json.series = series;
        json.plotOptions = plotOptions;
        json.credits = credits;
        return json;
    }
})
