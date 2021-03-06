
var SocialCalc;
if (!SocialCalc) SocialCalc = {}; // May be used with other SocialCalc libraries or standalone
                                 // In any case, requires SocialCalc.Constants.
SocialCalc.ChartHelper = function () {
    let minY, maxY;
    let valueformat = null;
    function detectNumberValueFormat(sheetobj, cell) {
        if (valueformat) {
            return;
        }
        let valuetype = cell.valuetype || ""; // get type of value to determine formatting
        if (cell.valuetype && valuetype.charAt(0) == 'n' && cell.nontextvalueformat) {
            valueformat = sheetobj.valueformats[cell.nontextvalueformat-0];
        }
    }
    function detectYAxis (cell) {
        if (minY == undefined || cell.datavalue < minY) {
            minY = cell.datavalue - 0;
        }
        if (maxY == undefined || cell.datavalue > maxY) {
            maxY = cell.datavalue - 0;
        }
    }

    this.detect = function (sheet, cell) {
        detectNumberValueFormat(sheet, cell);
        detectYAxis(cell);
    }

    this.getTooltip = function () {
        if (valueformat) {
            return {
                formatter: function () {
                    return this.series.name  + "<br/><b>" + this.x + ": "  + SocialCalc.format_number_for_display(this.y, "n", valueformat) + "</b>";
                }
            }
        } else {
            return {
                formatter: function () {
                    return this.series.name  + "<br/><b>" + this.x + ": "  + this.y + "</b>";
                }
            }
        }
    }

    this.getYAxis = function () {
        let det = maxY - minY;
        let unit = "";
        let div = 1;
        if (det < 10000) {
        } else if (det < 10000000) {
            div = 1000;
            unit = "k";
        } else if (det < 10000000000) {
            div = 1000000;
            unit = "M";
        } else {
            div = 1000000000;
            unit = "G";
        }
        return {
            title: {text: ''},
            labels: {
                formatter: function () {
                    return this.value / div + unit;
                }
            }
        };
    }
};

// $(document).ready(function() {
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

    function renderChart(sheet, config) {
        /*const cells = workbook.getCurrentSheet().cells
        const { anchorcoord, bottom, top, left, right } = editor.range || {}
        const col = anchorcoord && anchorcoord.slice(0, 1)
        const endCol = getColName(col, right - left)
        var json = {};
        if(config.type === 'pie') {
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
           
        } else */if(config.type === 'line' || config.type === 'bar' || config.type === 'area') {
            return renderChartX(sheet, config);
        }
        // return json;
    }

    /*let selectedChart = ''
    $('.chart-list img').click(function() {
        $('.chart').css('display', 'block')
        $(this).addClass('selected').siblings().removeClass('selected')
        selectedChart = $(this).attr('name')
        $('#chart-demo-wrapper').highcharts(renderChart(selectedChart));
    })*/
    
    /*$('#buttonSaveChart').click(function() {
        $('#chart-container').highcharts(renderChart(selectedChart));
        $('#modelChart').modal('hide')
    })*/

    /*$('.chart-delete').click(function() {
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
    })*/

    /*var oBar = document.getElementById('chart')
    var oBox = document.getElementById('chart')
    startDrag(oBar, oBox);*/

// })

var credits = {
    enabled: false
};

function renderChartX(sheet, config) {
     // config:{title, subtitle, tooltip, legend, hasLegend, hasXsis, invert}
    let chartHelper = new SocialCalc.ChartHelper();
    const cells = sheet.cells;
    let pair = SocialCalc.ParseRange(config.range);
    let left = Math.min(pair.cr1.col, pair.cr2.col);
    let right = Math.max(pair.cr1.col, pair.cr2.col);
    let top = Math.min(pair.cr1.row, pair.cr2.row);
    let bottom = Math.max(pair.cr1.row, pair.cr2.row);
    let startCol = config.hasXsis ? left + 1 : left;
    let startRow = config.hasLegend ? top + 1 : top;
    var xAxis = {
        categories: [],
        reversed: config.reversed,
    };
    for (let row = startRow; row<=bottom; row++) {
        if (config.hasXsis) {
            xAxis.categories.push(cells[SocialCalc.crToCoord(left, row)].datavalue);
        } else {
            xAxis.categories.push("");
        }
    }
    var series =  [];
    for (let col = startCol; col <= right; col++) {
        let s = {
            name: config.hasLegend ? cells[SocialCalc.crToCoord(col, top)].datavalue : "",
            data: []
        };
        series.push(s);
    }
    for (let col = startCol; col <= right; col++) {
        let data = series[col - startCol].data;
        for (let row=startRow; row<=bottom; row++) {
            let coord = SocialCalc.crToCoord(col, row);
            var value = cells[coord].datavalue - 0;
            data.push(value);
            chartHelper.detect(sheet, cells[coord]);
        }
    }
    var legend = {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle',
        borderWidth: 0
    };
    var json = {};
    json.chart = {type: config.type };
    json.title = {text: config.title };
    json.subtitle = {text: config.subtitle};
    json.xAxis = xAxis;
    json.yAxis = chartHelper.getYAxis();
    json.tooltip = chartHelper.getTooltip();
    json.legend = legend;
    json.series = series;
    // json.plotOptions = plotOptions;
    json.credits = credits;
    return json;
}
