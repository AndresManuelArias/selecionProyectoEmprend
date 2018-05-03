
'use strict';
//@ts-check
const fs = require('fs');

function paintGraphicsTeam(team){
    console.log('team',team)
    let countProyect = team.proyect.length;
    let  datasets = team.proyect.map((resultUsser,index)=>{
        return{
            label:`${resultUsser.nameproyect}`,
            backgroundColor: `rgba(216, ${index/countProyect*255},${Math.floor(Math.random()*255)}, 0.4)`,
            borderColor: `rgba(100,${index/countProyect*255},${Math.floor(Math.random()*255)},0.6)`,
            data:`${JSON.stringify(resultUsser.pointForDraft)}`
        };
    });
    console.log('datasets.map(dato => dato.label)',datasets.map(dato => dato.label));
    return ` 
        <h2> Grafico proyectos ${team.nameCompany} </h2>
        <canvas id="myChart${team.nameCompany.replace(/\s+/g,'')}}" width="331" height="165" class="chartjs-render-monitor" style="display: block; width: 331px; height: 165px;">
        </canvas>
        <script>
            var marksData = {
                labels:${JSON.stringify(datasets.map(dato => dato.label))},
                datasets: [
                    {
                        label: '# diferencia proyecto  ',
                        data: ${JSON.stringify(datasets.map(dato => dato.data))},
                        backgroundColor: ${JSON.stringify(datasets.map(dato => dato.backgroundColor))},
                        borderColor:${JSON.stringify(datasets.map(dato => dato.borderColor))},
                        borderWidth: 1
                    }
                ]
            };     
            var ctx = document.getElementById("myChart${team.nameCompany.replace(/\s+/g,'')}}");
            var myRadarChart = new Chart(ctx, {
                type: 'bar',
                data: marksData,
                options: {
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero:true
                            }
                        }]
                    }
                }
            });

        
        </script>
    `;
}
function paintEmpresas(array,...functionsPaint){
    console.log('array',array);
    let concatenate = ``;
    array.forEach(element => {
        functionsPaint.forEach((funcionPaint)=>{
            concatenate += 
    ` 
    <section> 
        ${funcionPaint(element)} 
    </section> ` ;
        });
    });
    return concatenate;
}
function encapsularHTML(datosAgregados){
    return `
<!DOCTYPE html>
<head>
    <meta charset="UTF-8">
    <!-- Latest compiled and minified CSS -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">              
    <title>
        ${datosAgregados.title}
    </title>
</head> 
<body>     
    <!-- jQuery library -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>          
    <!-- Latest compiled JavaScript -->
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>   
    <script src="http://www.chartjs.org/dist/2.7.1/Chart.bundle.js"></script>   
    <script src="https://cdn.jsdelivr.net/npm/vue@2.5.13/dist/vue.js"></script>                   
    <h1> ${datosAgregados.title} </h1>
            ${datosAgregados.body} 
</body>    
</html>  `;
}



function paintTableEmpresa(resultEmpresa){
    console.log('resultEmpresa',resultEmpresa)
    return `
        <h1> ${resultEmpresa.nameCompany} </h1>
        <table class="table table-bordered panel-body">
            <thead class="bg-primary text-white">
                <tr>
                    <th> puesto </th>
                    <th> Nombre proyecto </th>
                    <th>Puntaje </th>
                </tr>
            </thead>
            <tbody id="app${resultEmpresa.nameCompany.replace(/\s+/g,'')}">
                <tr v-for="(todo,index) in todos">
                    <td> {{index}}</td>
                    <td> {{ todo.nameproyect}} </td>
                    <td> {{ todo.pointForDraft}} </td>
                </tr>
            </tbody>  
        </table>

        <script>
            new Vue({
                el: "#app${resultEmpresa.nameCompany.replace(/\s+/g,'')}",
                data: {
                    todos: ${JSON.stringify(resultEmpresa.proyect.sort((a, b) => a.pointForDraft > b.pointForDraft ))}
                }
            })  
        </script>
    `;
}

 

class InformarProyectosSeleccionados {
    constructor(lugarGraficos){
        this.lugarGraficos = lugarGraficos;
    }
    graficar(arrayEmpresas){
        fs.writeFileSync(this.lugarGraficos, encapsularHTML({
            title:'Seleccion proyectos',
           body: paintEmpresas(arrayEmpresas,paintTableEmpresa,paintGraphicsTeam)
        }));
    }
}
module.exports = InformarProyectosSeleccionados;