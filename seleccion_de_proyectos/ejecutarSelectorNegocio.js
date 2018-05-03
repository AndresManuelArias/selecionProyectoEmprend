'use strict';
// @ts-check 
const csvdata = require('csvdata'), 
fs = require('fs'),
selectorBusiness = require('./selectorNegocio/selectorBusiness.js'),
InformarProyectosSeleccionados = require('./views/informarProyectosSeleccionados.js');

const filePath = 'baseData/proyectos empresariales - conocimiento.csv',
 graficarResultado = 'public/graficarResultado.html';
csvdata.load(filePath, {
    delimiter: ',',
    log: true,
    objName: false,
    stream: false
}).then((dataCompany)=>{
    csvdata.load('baseData/proyectos empresariales - ideas de negocio.csv', {
        delimiter: ',',
        log: true,
        objName: false,
        stream: false
    }).then((dataDraft)=>{
        console.log(dataCompany);
        let averagedataCompany = selectorBusiness.averageCompanyAbilities(dataCompany);
        console.log(averagedataCompany[0]["ablitiesCompany"]);
        let averageDraft = selectorBusiness.averageDraftAbilities(dataDraft);
        console.log(averageDraft);
        console.log(selectorBusiness.averageDraftAbilities(dataDraft)[0]);
        console.log("selectorBusiness.compareCompanyWithProject(averagedataCompany,averageDraft);");
        // console.log(selectorBusiness.compareCompanyWithProject(averagedataCompany,averageDraft)[1]["proyect"])//[0]["ablitiesForDraft"]);
        console.log(selectorBusiness.sumPointProyect(selectorBusiness.compareCompanyWithProject(averagedataCompany,averageDraft)));
        let resultadoMejorNegocio = selectorBusiness.sumPointProyect(selectorBusiness.compareCompanyWithProject(averagedataCompany,averageDraft));
        fs.writeFileSync('./baseData/resultado.json',JSON.stringify(resultadoMejorNegocio));
        let informarProyectosSeleccionados = new InformarProyectosSeleccionados(graficarResultado);
        informarProyectosSeleccionados.graficar(resultadoMejorNegocio);
    });
});
