'use strict';
function isArray(x) {
    return x.constructor.toString().indexOf('Array') > -1;
}

function colectionUnique(company,column){
    let now = [];
    let colection;
    if( company.length > 1){ 
        colection = company.reduce((before,after)=>{
            if(!isArray(before)){ 
                 now.push(before[column]);
                 before = now;
            }
            if(!before.some((knowledge)=> knowledge === after[column])){
                now.push(after[column]);
            }
            return now;
        }); 
    }else{
        colection = [company[0][column]];        
    }
    return colection;
}
function averageAbilities(company,abilites,jsonWhatAverage){
    let sum = 0;
    company.forEach(element => {
        if(element[jsonWhatAverage[0]] === abilites){
            sum += element[jsonWhatAverage[1]];
        }
    });
    let countPeople = colectionUnique(company,jsonWhatAverage[2]);
    return {abilites:abilites, average:sum/countPeople.length};
}
function averageDraftAbilities(companys){
    //sumar las abilidades que posee cada miembro del equipo y despues divididirlas por el total de miembros
    let coleticionDraft = [];
    let companyEvaluation = colectionUnique(companys,'Idea de negocio que propone');
    companyEvaluation.forEach((nameDraft)=>{
        let nowcompany = companys.filter(company => company['Idea de negocio que propone'] === nameDraft );    
        let abilities = colectionUnique(nowcompany,'Conocimiento para la idea');               
        let ablitiesForDraft = [];
        abilities.forEach(element => ablitiesForDraft.push( averageAbilities(nowcompany,element,
            ['Conocimiento para la idea', 
            'puntaje de 1 a 5',
            'Idea de negocio que propone']
        )));
        coleticionDraft.push({nameDraft:nameDraft,ablitiesForDraft:ablitiesForDraft});
    });
    return coleticionDraft;
}
function averageCompanyAbilities(companys){
//sumar las abilidades que posee cada miembro del equipo y despues divididirlas por el total de miembros
    let coleticionCompany = [];
    let companyEvaluation = colectionUnique(companys,'empresa');
    companyEvaluation.forEach((nameCompany)=>{
        let nowcompany = companys.filter(company => company['empresa'] === nameCompany );    
        let abilities = colectionUnique(nowcompany,'Conocimiento que posee ');               
        let ablitiesCompany = [];
        abilities.forEach(element => ablitiesCompany.push( averageAbilities(nowcompany,element,
            ['Conocimiento que posee ','Puntaje de 1 a 5 del Dominio de ese Conocimiento','Nombre']
        )));
        coleticionCompany.push({nameCompany:nameCompany,ablitiesCompany:ablitiesCompany});
    });
    return coleticionCompany;
}
function compareCompanyWithProject(companyAverage,proyectAverage){
    // console.log("companyAverage")
    // console.log(companyAverage)
    // let companyName = colectionUnique(companyAverage,'nameCompany');
    // console.log("companyName");
    // console.log(companyName);  
    return companyAverage.map((company)=>{
        // console.log("Company");
        // console.log(company.nameCompany);
        // console.log("company.ablitiesCompany");
        // console.log(company.ablitiesCompany);
        return{nameCompany:company.nameCompany ,proyect:proyectAverage.map((proyect)=>{  
            console.log("proyect.ablitiesForDraft")          
            console.log(proyect.ablitiesForDraft.length) 
            let ablitiesForDraftLength = proyect.ablitiesForDraft.length;
            return{nameproyect:proyect.nameDraft,ablitiesForDraft:proyect.ablitiesForDraft.map(abilitesDraft => {
                let index = company.ablitiesCompany.findIndex((ablitiesCompa)=>  abilitesDraft.abilites === ablitiesCompa.abilites) ;              
                // console.log('index')
                // console.log(index)
                // if(index !== -1){
                //     console.log("company.ablitiesCompany[index].abilites")
                //     console.log(company.ablitiesCompany[index].abilites)
                //     console.log('company.ablitiesCompany[index].average')                    
                //     console.log(company.ablitiesCompany[index].average)
 
                // }
                let averageRes = index !== -1? company.ablitiesCompany[index].average:0;
                // console.log(`
                // abilitesDraft.abilites:${abilitesDraft.abilites},abilitesDraft.average: ${abilitesDraft.average}.
                // company.ablitiesCompany :${company.ablitiesCompany},
                //  averageRes ${averageRes}
                //  resta:${abilitesDraft.average - averageRes}
                //  varaianza:${Math.pow(abilitesDraft.average - averageRes,2)}`);
                return    {abilites:abilitesDraft.abilites,desvest:Math.sqrt(Math.pow(abilitesDraft.average - averageRes,2)/2)};
            })};
        })};
    });
}

function sumAbilities(abilitiesBefore, abilitesAfter,index){
    let abilitiesBeforeNew = index === 1?abilitiesBefore.desvest:abilitiesBefore;
    return abilitesAfter.desvest + abilitiesBeforeNew;
}

function sumPointProyect(array){
    return array.map((company)=>{
        // console.log("company")
        // console.log(company)
        return {nameCompany:company.nameCompany,proyect:company.proyect.map((proyect)=>{
            // console.log("proyect")
            // console.log(proyect)
            let procenataje = proyect.ablitiesForDraft.reduce(sumAbilities)
           return{ nameproyect:proyect.nameproyect,pointForDraft:procenataje};
        })};
    });
}

// class selectorBusiness {
//     constructor(){

//     }

// }
module.exports = {colectionUnique:colectionUnique,
    averageCompanyAbilities:averageCompanyAbilities,
    averageDraftAbilities:averageDraftAbilities,
    compareCompanyWithProject:compareCompanyWithProject,
    sumPointProyect:sumPointProyect};