// const inputMonto = document.getElementById("inputMonto");      LA USE EN EL EVENTO, PERO LA DEJE AQUI POR SI ACASO
// const selectMoneda = document.getElementById("selectMoneda");  LA USE EN EL EVENTO, PERO LA DEJE AQUI POR SI ACASO
const btnConvertir = document.getElementById("btnConvertir");
const resultado = document.getElementById("resultado");




//Evento para boton convertir 
btnConvertir.addEventListener("click", async () => {
    try {
        const monto = parseFloat(inputMonto.value); //obtencion de valores del input, Parse float para convertir a decimales
        const moneda = selectMoneda.value;          //obtencion de valores del select


        //Uso de condicionales para determinar si la moneda seleccionada es UF o DOLAR
        if (moneda === "uf") {
            const response = await fetch("https://mindicador.cl/api/uf");       //traigo la info de la uf de la api y la paso a un json
            const dataUf = await response.json();                           
            const valorUF = dataUf.serie[0].valor;                                //accedo al elemento del objeto el cual  seria el valor
            const resultadoCambioUf = monto / valorUF;                            //guardo en una constante el calculo para obtener el cambio de valor
            resultado.innerText = `Resultado: ${resultadoCambioUf.toFixed(2)} UF`; //se formatea el valor para que aparezca con 2 decimales
        } else if (moneda === "dolar") {                                         //Misma estructura para obtener y calcular datos del dolar
            const response = await fetch("https://mindicador.cl/api/dolar");
            const dataDolar = await response.json();
            const valorDolar = dataDolar.serie[0].valor;
            const resultadoCambioDolar = monto / valorDolar;
            resultado.innerText = `Resultado: $${resultadoCambioDolar.toFixed(2)} USD`;
        }
    } catch (error) {
        console.error(error);
        alert("El sitio https://mindicador.cl/api presenta un error");   //no se si esto es redundante porque ya puse el console.log :S
    }
});






//AQUI EMPIEZA LO DE EL GRAFICO 

async function getMonedas() {
    // obtencion de los datos de UF
    const ufRes = await fetch("https://mindicador.cl/api/uf/"); // llamado a la api
    const dataUf = await ufRes.json();                          // guardar datos en un json

    // obtencion de los datos de DOLAR
    const dolarRes = await fetch("https://mindicador.cl/api/dolar/");
    const dataDolar = await dolarRes.json();


    // obtencion de los ultimos 10 valores y fechas de la UF usando slice
    const ultimosValoresUf = dataUf.serie.slice(-10);
    const fechasUf = ultimosValoresUf.map((propObjetoUf) => propObjetoUf.fecha);
    const valoresUf = ultimosValoresUf.map((propObjetoUf) => propObjetoUf.valor);

    // obtencion de los ultimos 10 valores y fechas de DOLAR usando slice igual que arriba
    const ultimosValoresDolar = dataDolar.serie.slice(-10);
    const fechasDolar = ultimosValoresDolar.map((propObjetoDol) => propObjetoDol.fecha);  //traje la fecha de dolar aunque mostraré la de la uf
    const valoresDolar = ultimosValoresDolar.map((propObjetoDol) => propObjetoDol.valor);



    // grafico con los datos actualizados
    const options = {
        series: [
        {
            name: "UF",
            data: valoresUf,
        },
        {
            name: "Dólar",
            data: valoresDolar,
        },
    ],
        chart: {
            height: 350,
            type: "line",
            zoom: {
            enabled: false,
        },
    },
        dataLabels: {
            enabled: false,
    },
        markers: {
            size: 8,
    },
        stroke: {
            curve: "straight",
    },
        title: {
            text: "Historial últimos 10 días",
            align: "center",
    },
        grid: {
            row: {
            colors: ["#f3f3f3", "transparent"],
            opacity: 0.5,
        },
    },
        xaxis: {
            categories: fechasUf, // usare fechas de uf como etiquetas en el eje x se usan  las mismas para el dolar
    },
    };

    const chart = new ApexCharts(document.querySelector("#chart"), options);
    chart.render();
}

    getMonedas();


