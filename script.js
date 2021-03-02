async function getData() {
    let data = await fetch("https://gist.githubusercontent.com/josejbocanegra/b1873c6b7e732144355bb1627b6895ed/raw/d91df4c8093c23c41dce6292d5c1ffce0f01a68b/newDatalog.json");
    let json = await data.json();

    console.log(json);

    let tbody = document.querySelector("#EventsTable > tbody")
    let map = new Map();
    let totalTrue = 0;
    let total = 0;
    json.forEach((value, index) => {
        let tr = document.createElement("tr")

        let th = document.createElement("th")
        th.scope = "row"
        th.textContent = index + 1

        let td1 = document.createElement("td")
        td1.textContent = value.events.toString()

        //Count TP and FN for each elemt
        value.events.forEach((key) => {
            let data = map.get(key)

            if (data) {
                if (value.squirrel) {
                    data.TP += 1;
                }
                else {
                    data.FN += 1;
                }
                map.set(key, data)
            }
            else {
                if(value.squirrel){                    
                    map.set(key, { "TP": 1, "FN": 0 })
                }
                else{
                    map.set(key, { "TP": 0, "FN": 1 })
                }
            }
        })


        let td2 = document.createElement("td")
        td2.textContent = value.squirrel

        //Set the highlight and add to the count
        if (value.squirrel) {
            tr.className = "table-danger"
            totalTrue += 1;
        }

        tr.appendChild(th)
        tr.appendChild(td1)
        tr.appendChild(td2)

        tbody.appendChild(tr)

        total += 1
    });


    tbody = document.querySelector("#CorrelationTable > tbody");
    let objectsCalculated = []
    let index = 1;
    for (let [key, value] of map) {
        let tr = document.createElement("tr")

        let th = document.createElement("th")
        th.scope = "row"

        let td1 = document.createElement("td")
        td1.textContent = key

        let td2 = document.createElement("td")
        td2.textContent = calculateMCC(value, total, totalTrue);

        tr.appendChild(th)
        tr.appendChild(td1)
        tr.appendChild(td2)

        console.log(tr)
        objectsCalculated.push(tr)
        index += 1;
    }

    //Sort array by MCC
    objectsCalculated.sort((a, b) => {
        let aMCC = a.querySelector("tr > td:nth-child(3)")
        let bMCC = b.querySelector("tr > td:nth-child(3)")

        return parseFloat(bMCC.textContent) - parseFloat(aMCC.textContent)
    })

    objectsCalculated.forEach((value, index) => {
        let th = value.querySelector("tr > th")
        th.textContent = index + 1;
        tbody.appendChild(value);
    })
}

function calculateMCC(info, total, totalTrue) {
    let TP = info.TP
    let FN = info.FN
    let FP = totalTrue - TP
    let TN = total - (TP + FN + FP)

    return ((TP * TN) - (FP * FN)) / (Math.sqrt((TP + FP) * (TP + FN) * (TN + FP) * (TN + FN)))
}

getData();