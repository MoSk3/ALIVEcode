var serializedData = JSON.parse(document.getElementById('serializedData').textContent)
google.charts.load('current', {'packages':['corechart']});

var datasheetIndex = 0

var charts = {
    // <id>: <Chart>
}

var currentChart

for(let i = 0; i < serializedData['dataSheets'].length; i++) {
    google.charts.setOnLoadCallback(drawChart);
}
google.charts.setOnLoadCallback(loadLiveChart)

function drawChart() {

    let datasheet = serializedData['dataSheets'][datasheetIndex]
    datasheetIndex++

    let rows = [
        [
            'Time', 
            'Signal', 
            'Attention',
            'Meditation',
            'Delta',
            'Theta',
            'Alpha Low',
            'Alpha High',
            'Beta Low',
            'Beta High',
            'Gamma Low',
            'Gamma High',
        ]
    ]

    let startTime = new Date(datasheet['date'])

    let attentionAverage = 0

    if(datasheet['points'].length == 0) {
        rows.push([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
    } else {
        let totalAttention = 0
        for(let pt of datasheet['points']) {
            sensors = [
                        pt['signal_strength'],
                        pt['attention'], 
                        pt['meditation'],     
                        pt['delta'],     
                        pt['theta'],  
                        pt['alpha_low'],
                        pt['alpha_high'], 
                        pt['beta_low'],
                        pt['beta_high'],
                        pt['gamma_low'],
                        pt['gamma_high'],
            ]
            totalAttention += pt['attention']
            convertSensorsData(sensors)
            dt = new Date(pt['date']) - startTime
            let values = [dt / 1000]
            for(let sensor of sensors) {
                values.push(sensor)
            }
            rows.push(values)
        }
        attentionAverage = totalAttention / datasheet['points'].length
    }

    $(`#attention-average-${datasheet['id']}`).text(attentionAverage.toFixed(2))

    let data = google.visualization.arrayToDataTable(rows);

    series = []
    for(let i = 0; i < rows[0].length - 1; i++) series.push({})

    let options = {
        title: datasheet['name'],
        hAxis: {title: 'Time since the start of the recording (seconds)',  titleTextStyle: {color: '#333'}},
        vAxis: {
            title: 'Brain activity', 
            minValue: 0,
            maxValue: 100
        },
        series: series
    };

    let googleChart = new google.visualization.LineChart(document.getElementById(`chart-div-${datasheet["id"]}`));

    let chart = new Chart(datasheet, googleChart, data, options)
    charts[datasheet['id']] = chart
    
    function showHideSeries() {
        var sel = googleChart.getSelection();
        if (sel.length && sel[0].row === null) {
            // toggle the current item selected
            chart.toggleColumn(sel[0]['column'], true)
        }
        chart.draw()
    }

    google.visualization.events.addListener(googleChart, 'select', showHideSeries);
    google.visualization.events.addListener(googleChart, 'onmouseover', (e) => {
        $(`#chart-div-${datasheet["id"]}`).css('cursor', 'pointer')
    });
    google.visualization.events.addListener(googleChart, 'onmouseout', (e) => {
        $(`#chart-div-${datasheet["id"]}`).css('cursor', 'default')
    });
    
    chart.toggleColumns([3, 4, 5, 6, 7, 8, 9, 10, 11])
    chart.draw()
    if(serializedData['currentDataSheet'] != null && datasheet['id'] == serializedData['currentDataSheet']['id']) {
        currentChart = chart
    }
}

var liveChart = {
    options: null,
    googleChart: null,
    data: null,
    update: function(sensors) {
        for(let i = 0; i < sensors.length; i++) {
            if(i >= 11) break
            liveChart.data.setValue(i, 1, sensors[i])
        }
    },
    draw: function() {
        liveChart.googleChart.draw(liveChart.data, liveChart.options)
    }
 }

function loadLiveChart() {
    
    liveChart.data = google.visualization.arrayToDataTable([
        ['dataType', 'value', { role: 'style' }],
        ['Signal', 0, 'blue'],
        ['Attention', 0, 'red'],
        ['Meditation', 0, '#f45047'],
        ['Delta', 0, 'orange'],
        ['Theta', 0, 'yellow'],
        ['Alpha Low', 0, '#08f82c'],
        ['Alpha High', 0, 'green'],
        ['Beta Low', 0, '#00024f'],
        ['Beta High', 0, 'purple'],
        ['Gamma Low', 0, '#a500ff'],
        ['Gamma High', 0, '#ff00fd'],
    ]);

    liveChart.options = {
        title: 'Brain Signals',
        chartArea: {
            // leave room for y-axis labels
            left: 40,
            width: '90%'
        },
        vAxis: {
            minValue: 0,
            maxValue: 100,
        },
        width: '100%',
        height: '100%'
    };

    liveChart.googleChart = new google.visualization.ColumnChart(document.getElementById(`chart-live`));
    liveChart.draw()
}

function convertSensorsData(sensors) {
    sensors[0 ] = sensors[0] / (200 / 100)  // signal_strength
    sensors[1 ] /= 1                        // attention
    sensors[2 ] /= 1                        // meditation
    sensors[3 ] /= (5000000 / 100)          // delta
    sensors[4 ] /= (5000000 / 100)          // theta
    sensors[5 ] /= (2000000 / 100)          // alpha_low
    sensors[6 ] /= (2000000 / 100)          // alpha_high
    sensors[7 ] /= (2000000 / 100)          // beta_low
    sensors[8 ] /= (2000000 / 100)          // beta_high
    sensors[9 ] /= (1000000 / 100)          // gamma_low
    sensors[10] /= (1000000 / 100)          // gamma_high
    return sensors
}

class Chart {
    constructor(datasheet, googleChart, data, options) {
        this.googleChart = googleChart
        this.displayData = data
        this.data = data.clone()
        this.options = options
        this.datasheet = datasheet
        this.startTime = new Date(datasheet['date'])
        this.id = datasheet['id']
        this.hiddenColumns = []
    }

    toggleColumns(columns, update=false) {
        for(let col of columns) this.toggleColumn(col)
        if(update) this.draw()
    }

    toggleColumn(index, update=false) {
        if(this.hiddenColumns.includes(index)) {
            this.hiddenColumns = this.hiddenColumns.filter((el) => {
                return el != index
            })
            for(let row = 0; row < this.data.getNumberOfRows(); row++) {
                let val = this.data.getValue(row, index)
                this.displayData.setValue(row, index, val)
                this.options.series[index - 1] = {}
            }
        } else {
            this.hiddenColumns.push(index)
            for(let row = 0; row < this.displayData.getNumberOfRows(); row++) {
                this.displayData.setValue(row, index, null)
            }
            this.options.series[index - 1] = {
                'color': '#CCCCCC'
            }
        }
        if(update) this.draw()
    }

    update(sensors) {
        sensors.unshift((Date.now() - this.startTime) / 1000)
        this.data.addRow(sensors)

        let displayedData = []
        sensors.forEach((el, index) => {
            if(this.hiddenColumns.includes(index)) {
                displayedData.push(null)
            } else {
                displayedData.push(el)
            }
        });
        this.displayData.addRow(displayedData)
    }

    draw() {
        this.googleChart.draw(this.displayData, this.options)
    }
}