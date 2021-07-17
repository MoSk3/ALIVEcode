function openSocket() {
    let wsStart = 'ws://'
    if (location.protocol == 'https:') wsStart = 'wss://'
    let endpoint = `${wsStart}${location.host}${location.pathname}/get?id=${serializedData['identifier']}`
    console.log(endpoint)

    socket = new WebSocket(endpoint)
    socket.onopen = e => { }
    socket.onclose = e => { }
    socket.onmessage = e => {
        let json = JSON.parse(e['data'])
        switch (json['type']) {
            case "sensor":
                let sensors = json['sensor']
                convertSensorsData(sensors)
                liveChart.update(sensors)
                liveChart.draw()
                if(currentChart != null) {
                    currentChart.update(sensors)
                    currentChart.draw()
                }
                break
        }
    }
    socket.onerror = e => {
        console.log("error:", e)
    }
}

openSocket()