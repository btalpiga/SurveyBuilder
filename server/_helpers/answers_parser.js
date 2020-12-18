'use strict'

const fs = require('fs');
const readline = require('readline');

class AnswerParser{
    surveyDefJson;
    constructor(surveyDefJson){
        this.surveyDefJson = surveyDefJson;
        this.surveyDefJson.allElements = {};
        this.surveyDefJson.pages.forEach(page=>{
            let questionElementTypes = ['radiogroup', 'boolean', 'text', 'dropdown', 'matrixdropdown'];
            if(page.elements){
                page.elements.filter(pgE=>questionElementTypes.indexOf(pgE.type)>=0).forEach(pageElement=>{
                    surveyDefJson.allElements[pageElement.name] = pageElement;
                })
            }
        })
    }

    parseRecord(answersJson){
        let responses = {};
        let ansData = answersJson.data;
        let questions = Object.keys(this.surveyDefJson.allElements);//Object.keys(ansData);
        questions.forEach(qName=>{
            let qDef = this.surveyDefJson.allElements[qName];
            let qType = qDef.type;
            let qAns = ansData[qName];
            let effectiveAns = undefined;
            let qIdx = parseInt(qName.substring('question'.length))-1;
            if(qAns){
                if(['radiogroup', 'boolean', 'text', 'dropdown'].indexOf(qType) >= 0){
                    effectiveAns = this.getSimpleAnswer(qType, qAns, qDef.choices);
                }else if(qType === 'matrixdropdown'){
                    effectiveAns = [];
                    let rowNames = Object.keys(qAns);
                    let columns = qDef.columns;
                    rowNames.forEach(rowName=>{
                        let matrixRow = [];
                        columns.forEach(column=>{
                            let columnName = column.name;
                            let cellType = column.cellType;
                            let choices = qDef.choices;
                            matrixRow.push(this.getSimpleAnswer(cellType, qAns[rowName][columnName], choices))
                        });
                        effectiveAns.push(matrixRow);
                    })
                }
            }
            
            responses[qIdx] = effectiveAns;
        })
        return responses;
    }

    getSimpleAnswer(dataType, qAns, choices){
        if(dataType === 'radiogroup' || dataType === 'dropdown'){
            if(choices === undefined){
                return qAns;
            }else{
                let mapped = choices.find(choice=>{
                    return choice.value === qAns
                });
                return mapped ? mapped.text : qAns;
            }
        }else if(dataType === 'matrixdropdown'){
            return undefined;
        }else { 
            //'boolean', 'text', undefined
            return qAns;
        }
    }
}

class BaInfoLineParser extends AnswerParser{
    
    csvHeader;
    rspPoz;
    rspLine;

    constructor(surveyDefJson, surveyId){
        super(surveyDefJson);
        this.surveyId = surveyId;
        let allQuestions = this.surveyDefJson.allElements;
        let qKeys = Object.keys(allQuestions);
        let questionKeysNo = qKeys.map(qName=>parseInt(qName.substring('question'.length)-1));
        let maxQuestionNumber =  Math.max(...questionKeysNo)+1;
        let questionNos = maxQuestionNumber;
        qKeys.forEach(qKey=>{
            let question = allQuestions[qKey]
            if(question.type === 'matrixdropdown'){
                questionNos += question.rows.length-1;
            }
        })

        this.csvHeader = new Array(questionNos);
        this.rspPoz = new Array(questionNos);
        this.rspLine = new Array(questionNos);

        let currentPoz = 0;
        new Array(maxQuestionNumber).fill().map((_, idx)=>idx).forEach(qNo=>{
            let questionName = 'question'+(qNo+1);
            let question = allQuestions[questionName];
            if(question){
                if(question.type !== 'matrixdropdown'){
                    this.csvHeader[currentPoz] = questionName;
                    this.rspPoz[currentPoz] = qNo+"";
                    currentPoz++;
                }else{
                    question.rows.forEach( (row,rowIdx)=>{
                        this.csvHeader[currentPoz] = questionName+'_'+row.value;
                        this.rspPoz[currentPoz] = qNo+'_'+rowIdx;
                        currentPoz++;
                    })
                }
            }else{
                this.csvHeader[currentPoz] = questionName;
                this.rspPoz[currentPoz] = -1;
                currentPoz++;
            }
        })
    }
    castToCsv(responses){
        Object.keys(responses).forEach(qNo=>{
            let response = responses[qNo];
            if(typeof(response) === 'string' || typeof(response)!== 'object'){
                qNo = qNo+'';
                let responsePoz = this.rspPoz.findIndex(pozKey => pozKey === qNo);
                let cell = response;
                if(cell === 'Da'){cell = true}
                if(cell === 'Nu'){cell = false}
                this.rspLine[responsePoz] = cell;
            }else{
                response.forEach((responseCell,idx)=>{
                    let compoundQNo = qNo+'_'+idx;
                    let responsePoz = this.rspPoz.findIndex(pozKey => pozKey === compoundQNo);
                    let cell = responseCell;
                    if(cell === 'Da'){cell = true}
                    if(cell === 'Nu'){cell = false}
                    this.rspLine[responsePoz] = cell;
                })
            }
        })
        return this.rspLine.map(cell=>cell?`"${cell}"` : "").join("^");
    }

}


function parseSurveyAnswers(inputFile, outputFile, surveyDef, surveyId){
    //TODO join with data from CRM  -> gen, BA, affinity
    //TODO split sku + brand
    //TODO stergere coloane goale ???

    if(fs.existsSync(outputFile)){fs.unlinkSync(outputFile);}
    
    const readInterface = readline.createInterface({
        input: fs.createReadStream(inputFile),
        // output: process.stdout,
        console: false
    });
    const csvWriter = fs.createWriteStream(outputFile, {
        flags: 'a' // 'a' means appending (old data will be preserved)
      })
    let baParser= new BaInfoLineParser(surveyDef, surveyId);

    let header = baParser.csvHeader.map(h=>`"${h}"`).join('^');
    header = 'survey_id^consumer_id^trigger_action^'+header;
    csvWriter.write(header+'\n');
    readInterface.on('line', function(line){
        let aux = line.split(/\^/);
        let consumerId = aux[0];
        let actionId = aux[1];
        let answersJsonStr = aux[2];
        let answersJson = JSON.parse(answersJsonStr);
        let csvLine = surveyId+"^"+consumerId+"^"+actionId+"^"+baParser.castToCsv(baParser.parseRecord(answersJson));
        csvWriter.write(csvLine+'\n');
    })
    csvWriter.close;

    let questions = baParser.surveyDefJson.allElements;
    let questionLegendPath = outputFile.replace('.csv', '_legend.csv');
    if(fs.existsSync(questionLegendPath)){fs.unlinkSync(questionLegendPath);}
    const legendWriter = fs.createWriteStream(questionLegendPath, {
        flags: 'a' // 'a' means appending (old data will be preserved)
    })
    legendWriter.write('"QuestionName","QuestionText"\n')
    Object.keys(questions).forEach(questionName=>{
        let question = questions[questionName];
        legendWriter.write(questionName+',"'+question.title+'"\n');
        if(question.type === 'matrixdropdown'){
            question.rows.forEach(row=>{
                legendWriter.write(`"${questionName}_${row.value}","${row.text}"\n`)
            })
        }
    })
    legendWriter.close();
}


let baSurveyDef = {"completedHtmlOnCondition":[{"expression":"true","html":"  <p style=\"font-family: 'Times New Roman', Times, serif;\">   Acestea au fost toate întrebările.<br> Mulțumim pentru raspunsuri!  <br>   Pe curand! <br> <i>Echipa JTI</i><p>"}],"pages":[{"name":"Filters","elements":[{"type":"radiogroup","name":"question1","title":"Sunteți de acord?","isRequired":true,"requiredErrorText":"Te rugam sa selectezi un raspuns!","choices":[{"value":"item1","text":"Da"},{"value":"item2","text":"Nu"}]},{"type":"radiogroup","name":"question3","title":"Ai peste 18 ani  împliniți?","isRequired":true,"requiredErrorText":"Te rugam sa selectezi un raspuns!","choices":[{"value":"item1","text":"Da"},{"value":"item2","text":"Nu"}]},{"type":"radiogroup","name":"question2","title":"Fumător/fumătoare?","isRequired":true,"requiredErrorText":"Te rugam sa selectezi un raspuns!","choices":[{"value":"item1","text":"Da"},{"value":"item2","text":"Nu"}]},{"type":"radiogroup","name":"question4","title":"Ați interacționat în ultimele zile cu o reprezentantă a JTI?","isRequired":true,"requiredErrorText":"Te rugam sa selectezi un raspuns!","choices":[{"value":"item1","text":"Da"},{"value":"item2","text":"Nu"}]}],"description":"<h5>Bine te-am regăsit!<br><br>Pentru că dorim să îmbunătățim continuu serviciile pe care ți le oferim avem nevoie de răspunsurile tale la câteva întrebări. Ne interesează cum a decurs ultima întâlnire pe care ai avut-o cu reprezentantul nostru. Am realizat un chestionar foarte scurt pentru că tu să-l poți completă doar în câteva minute.</br></br>îți mulțumim!</h5></br></br></br><b>Conform prevederilor GDPR (General Dată Protection Regulation) ai libertatea de a acceptă sau nu participarea. Te asigurăm că informațiile pe care ni le oferi vor fi tratate în manieră securizată, strict confidențială și complet anonimă.</b>"},{"name":"OPINII ACTIVARE","elements":[{"type":"radiogroup","name":"question9","title":"Unde a avut loc aceasta?","hasOther":true,"choices":[{"value":"item1","text":"Într-un supermarket/ hyper-market."},{"value":"item2","text":"Într-o benzinărie."},{"value":"item3","text":"Într-un magazin specializat de tutun (ex. Inmedio, Tabac Express)."},{"value":"item4","text":"Într-un magazin de cartier."},{"value":"item5","text":"Într-un local (cafenea, bar) în mall/ centru comercial."},{"value":"item6","text":"Într-un local (cafenea, bar) în oraș."},{"value":"item7","text":"La o petrecere organizată în oraș."},{"value":"item8","text":"La un eveniment (concert, festival)."},{"value":"item9","text":"Lângă o clădire de birouri."},{"value":"item10","text":"Nu stiu/Nu răspund."}],"otherText":"Altundeva, unde___?"},{"type":"matrixdropdown","name":"question5","title":" Cât de mult ți-au plăcut următoarele:","description":"Notează următoarele aspecte ale întâlnirii cu note de la 1 la 5 (unde 1 înseamnă „cel mai puțin” și 5 „cel mai mult”. Dacă nu îți amintești cu exactitate poți selecta„Nu știu/Nu răspund”).","isRequired":true,"requiredErrorText":"Te rugam sa selectezi un raspuns!","validators":[{"type":"expression"}],"showHeader":false,"columns":[{"name":"Alege","cellType":"dropdown"}],"choices":[{"value":"5","text":"5"},{"value":"4","text":"4"},{"value":3,"text":"3"},{"value":"2","text":"2"},{"value":"1","text":"1"},{"value":"9","text":"Nu stiu/Nu raspund."}],"optionsCaption":"Alege raspuns...","rows":[{"value":"Row 1","text":" <b>1. Durata dialogului</b>"},{"value":"Row 2","text":" <b>2. Confortul pe care l-ați avut în momentul întâlnirii</b>"},{"value":"Row 3","text":" <b>3.Produsul care ți-a fost recomandat</b>"},{"value":"Row 4","text":" <b>4. Discursul de prezentare al produsului recomandat de reprezentant</b>"},{"value":"Row 5","text":"<b> 5. Acțiunile pe care a fost necesar să le faci pentru a câștiga premiul</b>"},{"value":"Row 6","text":" <b>6. Premiul/ bonusul pe care l-ai câștigat</b>"},{"value":"Row 7","text":" <b>7. Prezentarea altor campanii JTI (de exemplu: posibilitatea de a câștigă alte premii înscriind codurile din pachete pe site)</b>"}]},{"type":"matrixdropdown","name":"question6","title":"În ce măsură discursul reprezentantului nostru a fost:","isRequired":true,"requiredErrorText":"Te rugam sa selectezi un raspuns!","validators":[{"type":"expression"}],"showHeader":false,"columns":[{"name":"Alege","cellType":"dropdown"}],"choices":[{"value":"5","text":"5"},{"value":"4","text":"4"},{"value":3,"text":"3"},{"value":"2","text":"2"},{"value":"1","text":"1"},{"value":"9","text":"Nu stiu/Nu raspund."}],"optionsCaption":"Alege raspuns...","rows":[{"value":"Row 1","text":" <b>1. Ușor de urmărit</b>"},{"value":"Row 2","text":" <b>2. Relevant cu privire la calitățile produsului</b>"},{"value":"Row 3","text":" <b>3. Relevant cu privire la beneficiile consumului produsului recomandat</b>"},{"value":"Row 4","text":"<b> 4.  Relevant cu privire la marca (brand-ul) produsului</b>"},{"value":"Row 5","text":" <b>5. Interesant</b>"},{"value":"Row 6","text":" <b>6. Relevant cu privire la participarea la campanie (ce trebuie făcut pentru a beneficia de ofertă)</b>"},{"value":"Row 7","text":" <b>7. Convingător pentru a încerca/ consuma produsul recomandat</b>"}]},{"type":"matrixdropdown","name":"question7","title":"Cât de mult crezi că dialogul a avut loc...?:","isRequired":true,"requiredErrorText":"Te rugam sa selectezi un raspuns!","validators":[{"type":"expression"}],"showHeader":false,"columns":[{"name":"Alege","cellType":"dropdown"}],"choices":[{"value":"5","text":"5"},{"value":"4","text":"4"},{"value":3,"text":"3"},{"value":"2","text":"2"},{"value":"1","text":"1"},{"value":"9","text":"Nu stiu/Nu raspund."}],"optionsCaption":"Alege raspuns...","rows":[{"value":"Row 1","text":"<b> 1. Într-un moment oportun</b>"},{"value":"Row 2","text":" <b>2. într-o atmosferă/maniera potrivită</b>"},{"value":"Row 3","text":"<b> 3. Potrivit contextului in care eram</b>"}]},{"type":"matrixdropdown","name":"question10","title":"Cât de mult crezi că aspectul reprezentantei/reprezentantului a fost...?:","showHeader":false,"columns":[{"name":"Alege","cellType":"dropdown"}],"choices":[{"value":"5","text":"5"},{"value":"4","text":"4"},{"value":3,"text":"3"},{"value":"2","text":"2"},{"value":"1","text":"1"},{"value":"9","text":"Nu stiu/Nu raspund."}],"optionsCaption":"Alege raspuns...","rows":[{"value":"Row 1","text":"<b>1. Plăcut</b>"},{"value":"Row 2","text":"<b>2. Imbracamintea reprezentantului a fost de calitate</b>"},{"value":"Row 3","text":"<b>3. Decent </b>"},{"value":"Row 4","text":"<b>4.  Potrivit mărcii prezentate</b>"},{"value":"Row 5","text":"<b> 5. Curat</b>"},{"value":"Row 6","text":"<b> 6. A ieșit în evidență pozitiv</b>"}]}],"visibleIf":"{question1} = 'item1' and {question2} = 'item1' and {question3} = 'item1' and {question4} = 'item1'","title":"<h5><b>OPINII</b></h5>","description":"<b>Gândește-te la ultima interacțiune pe care ai avut-o cu un (o) reprezentant(ă) JTI.</b>"},{"name":"CONSUM TUTUN","elements":[{"type":"matrixdropdown","name":"question8","title":"Cât de des consumi ","description":"(zilnic (5), De 2-3 ori pe săptămână (4), lunar (3), O dată la 2-3 luni (2), Mai rar (1), Niciodată (0), Nu stiu/Nu raspund (9) )…","isRequired":true,"requiredErrorText":"Ne pare rau, macar unul dintre raspunsuri trebuie sa fie diferit de 0!","validators":[{"type":"expression","text":"Ne pare rau, macar unul dintre raspunsuri trebuie sa fie diferit de 0!","expression":"{question8.Row 1.   Alege} > 0 ||\n{question8.Row2.   Alege} > 0 ||\n{question8.Row 3.   Alege} > 0 ||\n{question8.Row 4.   Alege} > 0 ||\n{question8.Row 5.   Alege} > 0 "}],"showHeader":false,"columns":[{"name":"   Alege","cellType":"dropdown","isRequired":true}],"choices":[{"value":"5","text":"5"},{"value":"4","text":"4"},{"value":"3","text":"3"},{"value":"2","text":"2"},{"value":"1","text":"1"},{"value":"0","text":"0"},{"value":"9","text":"Nu stiu/Nu raspund"}],"optionsCaption":"Alege raspuns...","rows":[{"value":"Row 1","text":"<b>1. țigarete (la pachet)</b>"},{"value":"Row 2","text":"<b> 2. țigarete (rulate)</b>"},{"value":"Row 3","text":"<b> 3. țigări cu tutun încălzit</b>"},{"value":"Row 4","text":"<b> 4. țigări electronice (cu lichid)</b>"},{"value":"Row 5","text":"<b>5.  Alte produse de tutun (trabucuri, pipă, narghilea)</b>"}]},{"type":"matrixdropdown","name":"question11","title":"Ce țigarete consumi de obicei?","isRequired":true,"requiredErrorText":"Te rugam sa selectezi un raspuns!","validators":[{"type":"expression","text":"Va rugam sa selectati un produs!","expression":"{question11.r1.brand} notempty and {question11.r1.skus} notempty"}],"showHeader":false,"columns":[{"name":"brand","title":"Select brand","cellType":"dropdown","choicesByUrl":{"url":"/api/data/brands"}},{"name":"skus","title":"Select product","cellType":"dropdown"}],"optionsCaption":"Alege raspuns...","rows":[{"value":"r1","text":"<b>Select Brand and Product</b>"}]},{"type":"matrixdropdown","name":"question12","title":" Ce marcă de țigări mai consumi, ocazional?","isRequired":true,"requiredErrorText":"Te rugam sa selectezi un raspuns!","validators":[{"type":"expression","text":"Va rugam sa selectati un produs!","expression":"{question12.r1.brand} notempty and {question12.r1.skus} notempty"}],"showHeader":false,"columns":[{"name":"brand","title":"Select brand","cellType":"dropdown","choicesByUrl":{"url":"/api/data/brands"}},{"name":"skus","title":"Select product","cellType":"dropdown"}],"optionsCaption":"Alege raspuns...","rows":[{"value":"r1","text":"<b>Select Brand and Product</b>"}]},{"type":"matrixdropdown","name":"question13","visibleIf":"{question8.Row 3.   Alege} > 1","title":"Ce marcă de țigări încălzite consumi?","isRequired":true,"requiredErrorText":"Te rugam sa selectezi un raspuns!","validators":[{"type":"expression","text":"Va rugam sa selectati un produs!","expression":"{question13.r1.brand} notempty and {question13.r1.skus} notempty"}],"showHeader":false,"columns":[{"name":"brand","title":"Select brand","cellType":"dropdown","choicesByUrl":{"url":"/api/data/brands-incalzite"}},{"name":"skus","title":"Select product","cellType":"dropdown"}],"optionsCaption":"Alege raspuns...","rows":[{"value":"r1","text":"<b>Select Brand and Product</b>"}]},{"type":"matrixdropdown","name":"question15","visibleIf":"{question8.Row 4.   Alege} > 1","title":"Ce marcă de țigări el ectronice cu lichid consumi?","isRequired":true,"requiredErrorText":"Te rugam sa selectezi un raspuns!","validators":[{"type":"expression","text":"Va rugam sa selectati un produs!","expression":"{question15.r1.brand} notempty and {question15.r1.skus} notempty"}],"showHeader":false,"columns":[{"name":"brand","title":"Select brand","cellType":"dropdown","choicesByUrl":{"url":"/api/data/brands-lichide"}},{"name":"skus","title":"Select product","cellType":"dropdown"}],"optionsCaption":"Alege raspuns...","rows":[{"value":"r1","text":"<b>Select Brand and Product</b>"}]}],"visibleIf":"{question1} = 'item1' and {question2} = 'item1' and {question3} = 'item1' and {question4} = 'item1'","title":"<h5><b>CONSUM TUTUN</b></h5>","description":"<b>Te rugăm să ne răspunzi acum la câteva întrebări privind consumul de tutun.</b>"},{"name":"DATE SOCIO-DEMOGRAFICE","elements":[{"type":"boolean","name":"question21","title":"Gen","isRequired":true,"requiredErrorText":"Te rugam sa selectezi un raspuns!","labelTrue":"Masculin","labelFalse":"Feminin"},{"type":"text","name":"question22","startWithNewLine":false,"title":"VÂRSTA (în ani împliniţi)","isRequired":true,"requiredErrorText":"Te rugam sa selectezi un raspuns!","validators":[{"type":"numeric","minValue":18,"maxValue":99}],"inputType":"number","maxLength":2},{"type":"dropdown","name":"question23","title":"Care este ultima şcoală absolvită? ","isRequired":true,"requiredErrorText":"Te rugam sa selectezi un raspuns!","choices":[{"value":"1","text":"Fară şcoală "},{"value":"2","text":"Şcoală primară"},{"value":"3","text":"Gimnaziu"},{"value":"4","text":"Şcoală profesională ori de meserii "},{"value":"5","text":"Liceu"},{"value":"6","text":"Şcoală post-liceală (inclusiv colegiu)"},{"value":"7","text":"Studii superioare/facultate"},{"value":"8","text":"Studii post-universitare"},{"value":"99","text":"Nu știu / Nu răspund "}],"optionsCaption":"Alege raspuns..."},{"type":"dropdown","name":"question24","title":"Care este ocupația dumneavoastră actuala?","isRequired":true,"requiredErrorText":"Te rugam sa selectezi un raspuns!","choices":[{"value":"r_1","text":"Patron/ întreprinzător particular"},{"value":"r_2","text":"Manager/ șef de departament"},{"value":"r_3","text":"Angajat cu studii superioare"},{"value":"r_4","text":"Angajat cu studii medii"},{"value":"r_5","text":"Elev, student"},{"value":"r_6","text":"Casnic "},{"value":"r_7","text":"Șomer"},{"value":"r_8","text":"Pensionar"},{"value":"r_9","text":"Nu lucrez (concediu de maternitate, de boală etc)"}],"optionsCaption":"Alege raspuns..."},{"type":"radiogroup","name":"question25","title":" În care dintre următoarele categorii se încadrează suma veniturilor nete lunare din gospodăria ta (suma veniturilor tuturor membrilor din gospodărie)?<BR><i>Va rugam sa alegeți o singura varianta de răspuns.</i>","isRequired":true,"requiredErrorText":"Te rugam sa selectezi un raspuns!","choices":[{"value":"item1","text":"Sub 1000 lei"},{"value":"item2","text":" Între 1.001 - 2.000 lei"},{"value":"item3","text":" Între 2.001 - 3.000 lei"},{"value":"item4","text":" Între 3.001 – 4.000 lei"},{"value":"item5","text":" Între 4.001 -  6.000 lei"},{"value":"item6","text":" Între 6.001 - 7.000 lei"},{"value":"item7","text":" Între 7.001 – 9.000 lei"},{"value":"item8","text":"Peste 9.000 lei"},{"value":"item9","text":"Refuz sa răspund"}]},{"type":"radiogroup","name":"question27","title":"În care dintre următoarele categorii se încadrează venitul tău personal lunar net?<BR><i>O singură variantă de răspuns.</i>","isRequired":true,"requiredErrorText":"Te rugam sa selectezi un raspuns!","choices":[{"value":"item1","text":"Fără venit"},{"value":"item2","text":"Sub 1000 lei"},{"value":"item3","text":" Între 1.001 - 2.000 lei"},{"value":"item4","text":" Între 2.001 - 3.000 lei"},{"value":"item5","text":" Între 3.001 – 4.000 lei"},{"value":"item6","text":" Între 4.001 -  6.000 lei"},{"value":"item7","text":" Între 6.001 - 7.000 lei"},{"value":"item8","text":" Între 7.001 – 9.000 lei"},{"value":"item9","text":"Peste 9.000 lei"},{"value":"item10","text":"Refuz sa răspund"}]}],"visibleIf":"{question1} = 'item1' and {question2} = 'item1' and {question3} = 'item1' and {question4} = 'item1'","title":"<h5><b>DATE SOCIO-DEMOGRAFICE</b></h5>"},{"name":"page1","title":"Acestea au fost toate întrebările. Vă mulțumim pentru colaborare!"}],"questionErrorLocation":"bottom","showProgressBar":"top","pagePrevText":"Inapoi","pageNextText":"Continua","completeText":"Trimite"};
let baSurveyId = 'BA121';
let baInput = '/tmp/ba_121_answers.txt';
let baOutput = '/tmp/ba_121_report.csv';
parseSurveyAnswers(baInput,baOutput, baSurveyDef, baSurveyId);

let infoLineSurveyDef = {"completedHtmlOnCondition":[{"expression":"true","html":"  <p style=\"font-family: 'Times New Roman', Times, serif;\">   Acestea au fost toate întrebările.<br> Mulțumim pentru raspunsuri!  <br>   Pe curand! <br> <i>Echipa JTI</i><p>"}],"pages":[{"name":"Filters","elements":[{"type":"radiogroup","name":"question1","title":"Ești de acord?","isRequired":true,"requiredErrorText":"Te rugam sa selectezi un raspuns!","choices":[{"value":"item1","text":"Da"},{"value":"item2","text":"Nu"}]},{"type":"radiogroup","name":"question3","title":"Ai peste 18 ani?","isRequired":true,"requiredErrorText":"Te rugam sa selectezi un raspuns!","choices":[{"value":"item1","text":"Da"},{"value":"item2","text":"Nu"}]},{"type":"radiogroup","name":"question2","title":"Sunteți fumător/fumătoare?","isRequired":true,"requiredErrorText":"Te rugam sa selectezi un raspuns!","choices":[{"value":"item1","text":"Da"},{"value":"item2","text":"Nu"}]},{"type":"radiogroup","name":"question4","title":"Ai discutat telefonic în ultimele zile cu/(o) reprezentant/(ă) JTI?","isRequired":true,"requiredErrorText":"Te rugam sa selectezi un raspuns!","choices":[{"value":"item1","text":"Da"},{"value":"item2","text":"Nu"}]}],"description":"<h5>Bine te-am regăsit! <br> <br>Pentru că dorim să îmbunătățim continuu serviciile pe care ți le oferim avem nevoie de răspunsurile tale la câteva întrebări. Ne interesează cum a decurs ultima întâlnire pe care ai avut-o cu reprezentantul nostru. Am realizat un chestionar foarte scurt pentru ca tu să-l poți completa doar în câteva minute.</br></br>Îți mulțumim!</h5></br></br></br> <b>Conform prevederilor GDPR (General Data Protection Regulation) ai libertatea de a accepta sau nu participarea. Te asigurăm că informațiile pe care ni le oferi vor fi tratate în manieră securizată, strict confidențială și complet anonimă.</b>"},{"name":"OPINII ACTIVARE","elements":[{"type":"matrixdropdown","name":"question5","title":" Cât de mult ți-au plăcut următoarele:","isRequired":true,"requiredErrorText":"Te rugam sa selectezi un raspuns!","validators":[{"type":"expression"}],"showHeader":false,"columns":[{"name":"Alege","cellType":"dropdown"}],"choices":[{"value":"5","text":"5"},{"value":"4","text":"4"},{"value":3,"text":"3"},{"value":"2","text":"2"},{"value":"1","text":"1"},{"value":"9","text":"Nu stiu/Nu raspund"}],"optionsCaption":"alege raspuns","rows":[{"value":"Row 1","text":" <b>1. Durata dialogului</b>"},{"value":"Row 2","text":" <b>2. Confortul pe care l-ați avut în momentul discuției</b>"},{"value":"Row 3","text":"<b> 3. Produsul care ți-a fost recomandat</b>"},{"value":"Row 4","text":"<b> 4. Discursul de prezentare al produsului recomandat de reprezentant</b>"},{"value":"Row 5","text":"<b> 5. Acțiunile pe care a fost necesar să le faci pentru a câștiga premiul</b>"},{"value":"Row 6","text":" <b>6. Premiul/ bonusul pe care l-ai câștigat</b>"},{"value":"Row 7","text":" <b>7. Prezentarea altor campanii JTI (de exemplu: posibilitatea de a câștiga alte premii înscriind codurile din pachete pe site)</b>"}]},{"type":"matrixdropdown","name":"question6","title":"În ce măsură discursul reprezentantului nostru a fost:","isRequired":true,"requiredErrorText":"Te rugam sa selectezi un raspuns!","validators":[{"type":"expression"}],"showHeader":false,"columns":[{"name":"Alege","cellType":"dropdown"}],"choices":[{"value":"5","text":"5"},{"value":"4","text":"4"},{"value":3,"text":"3"},{"value":"2","text":"2"},{"value":"1","text":"1"},{"value":"9","text":"Nu stiu/Nu raspund"}],"optionsCaption":"alege raspuns","rows":[{"value":"Row1","text":" <b>1. Ușor de urmărit</b>"},{"value":"Row 2","text":" <b> 2. Relevant cu privire la calitățile produsului</b>"},{"value":"Row 3","text":"  <b>3. Relevant cu privire la beneficiile consumului produsului recomandat</b>"},{"value":"Row 4","text":"  <b>4.  Relevant cu privire la marca (brand-ul) produsului</b>"},{"value":"Row 5","text":"  <b>5. Interesant</b>"},{"value":"Row 6","text":"  <b>6. Relevant cu privire la participarea la campanie (ce trebuie făcut pentru a beneficia de ofertă)</b>"},{"value":"Row 7","text":" <b> 7. Convingător pentru a încerca/ consuma produsul recomandat </b>"}]},{"type":"matrixdropdown","name":"question7","title":"Cât de mult crezi că dialogul a avut loc...?:","isRequired":true,"requiredErrorText":"Te rugam sa selectezi un raspuns!","validators":[{"type":"expression"}],"titleLocation":"top","showHeader":false,"columns":[{"name":"Alege","cellType":"dropdown"}],"choices":[{"value":"5","text":"5"},{"value":"4","text":"4"},{"value":3,"text":"3"},{"value":"2","text":"2"},{"value":"1","text":"1"},{"value":"9","text":"Nu stiu/Nu raspund"}],"optionsCaption":"alege raspuns","rows":[{"value":"Row 1","text":"<b> 1. Într-un moment oportun</b>"},{"value":"Row 2","text":"<b> 2. Într-o maniera potrivită</b>"}]}],"visibleIf":"{question1} = 'item1' and {question2} = 'item1' and {question3} = 'item1' and {question4} = 'item1'","title":"<h5><b>OPINII</b></h5>","description":"<b>Gândește-te la ultima discuție telefonică pe care ai avut-o cu un (o) reprezentant(ă)  JTI. <br>Notează următoarele aspecte ale discuției telefonice cu note de la 1 la 5 (unde 1 înseamnă „cel mai puțin” și 5 „cel mai mult”. Dacă nu îți amintești cu exactitate poți selecta „Nu știu/Nu răspund”).<b>"},{"name":"CONSUM TUTUN","elements":[{"type":"matrixdropdown","name":"question8","title":"Cât de des consumi ","description":"(zilnic (5), De 2-3 ori pe săptămână (4), lunar (3), O dată la 2-3 luni (2), Mai rar (1), Niciodată (0), „Nu stiu/Nu răspund”)","isRequired":true,"requiredErrorText":"Ne pare rau, macar unul dintre raspunsuri trebuie sa fie diferit de 0!","validators":[{"type":"expression","text":"Ne pare rau, macar unul dintre raspunsuri trebuie sa fie diferit de 0!","expression":"{question8.Row 1.Alege} > 0 or {question8.Row 2.Alege} > 0 or {question8.Row 3.Alege} > 0 or {question8.Row 4.Alege} > 0 or {question8.Row 5.Alege} > 0"}],"showHeader":false,"columns":[{"name":"Alege","cellType":"dropdown"}],"choices":[{"value":"5","text":"5"},{"value":"4","text":"4"},{"value":3,"text":"3"},{"value":"2","text":"2"},{"value":"1","text":"1"},{"value":"0","text":"0"},{"value":"9","text":"Nu stiu/Nu raspund"}],"optionsCaption":"alege raspuns","rows":[{"value":"Row 1","text":"<b>1. țigarete (la pachet)</b>"},{"value":"Row 2","text":" <b>2. țigarete (rulate)</b>"},{"value":"Row 3","text":" <b>3. țigări încălzite</b>"},{"value":"Row 4","text":"<b> 4. țigări electronice (cu lichid)</b>"},{"value":"Row 5","text":"<b> 5. Alte produse de tutun (trabucuri, pipă, narghilea)</b>"}]},{"type":"matrixdropdown","name":"question11","title":"Ce țigarete consumi de obicei?","isRequired":true,"requiredErrorText":"Te rugam sa selectezi un raspuns!","validators":[{"type":"expression","text":"Va rugam sa selectati un produs!","expression":"{question11.r1.brand} notempty and {question11.r1.skus} notempty"}],"showHeader":false,"columns":[{"name":"brand","title":"Select brand","choicesByUrl":{"url":"/api/data/brands"}},{"name":"skus","title":"Select product"}],"optionsCaption":"Alege raspuns ...","rows":[{"value":"r1","text":"<b>Select Brand and Product </b>"}]},{"type":"matrixdropdown","name":"question12","title":" Ce marcă de țigări mai consumi, ocazional?","isRequired":true,"requiredErrorText":"Te rugam sa selectezi un raspuns!","validators":[{"type":"expression","text":"Va rugam sa selectati un produs!","expression":"{question12.r1.brand} notempty and {question12.r1.skus} notempty"}],"showHeader":false,"columns":[{"name":"brand","title":"Select brand","choicesByUrl":{"url":"/api/data/brands"}},{"name":"skus","title":"Select product"}],"optionsCaption":"Alege raspuns ...","rows":[{"value":"r1","text":"<b>Select Brand and Product</b>"}]},{"type":"matrixdropdown","name":"question13","visibleIf":"{question8.Row 3.Alege} > 1","title":"Ce marcă de țigări încălzite consumi?","isRequired":true,"requiredErrorText":"Te rugam sa selectezi un raspuns!","validators":[{"type":"expression","text":"Va rugam sa selectati un produs!","expression":"{question13.r1.brand} notempty and {question13.r1.skus} notempty"}],"showHeader":false,"columns":[{"name":"brand","title":"Select brand","choicesByUrl":{"url":"/api/data/brands-incalzite"}},{"name":"skus","title":"Select product"}],"optionsCaption":"Alege raspuns ...","rows":[{"value":"r1","text":"<b>Select Brand and Product</b>"}]},{"type":"matrixdropdown","name":"question15","visibleIf":"{question8.Row 4.Alege} > 1","title":"Ce marcă de țigări electronice cu lichid consumi?","isRequired":true,"requiredErrorText":"Te rugam sa selectezi un raspuns!","validators":[{"type":"expression","text":"Va rugam sa selectati un produs!","expression":"{question15.r1.brand} notempty and {question15.r1.skus} notempty"}],"showHeader":false,"columns":[{"name":"brand","title":"Select brand","choicesByUrl":{"url":"/api/data/brands-lichide"}},{"name":"skus","title":"Select product"}],"optionsCaption":"Alege raspuns ...","rows":[{"value":"r1","text":"<b>Select Brand and Product</b>"}]}],"visibleIf":"{question1} = 'item1' and {question2} = 'item1' and {question3} = 'item1' and {question4} = 'item1'","title":"<h5><b>CONSUM TUTUN</b></h5>","description":"<b>Te rugăm să ne răspunzi acum la câteva întrebări privind consumul de tutun.</b>"},{"name":"DATE SOCIO-DEMOGRAFICE","elements":[{"type":"boolean","name":"question21","title":"Gen","isRequired":true,"requiredErrorText":"Te rugam sa selectezi un raspuns!","labelTrue":"Masculin","labelFalse":"Feminin"},{"type":"text","name":"question22","startWithNewLine":false,"title":"VÂRSTA (în ani împliniţi)","isRequired":true,"requiredErrorText":"Te rugam sa selectezi un raspuns!","validators":[{"type":"numeric","minValue":18,"maxValue":99}],"inputType":"number","maxLength":2},{"type":"dropdown","name":"question23","title":"Care este ultima şcoală absolvită? ","isRequired":true,"requiredErrorText":"Te rugam sa selectezi un raspuns!","choices":[{"value":"1","text":"Fară şcoală "},{"value":"2","text":"Şcoală primară"},{"value":"3","text":"Gimnaziu"},{"value":"4","text":"Şcoală profesională ori de meserii "},{"value":"5","text":"Liceu"},{"value":"6","text":"Şcoală post-liceală (inclusiv colegiu)"},{"value":"7","text":"Studii superioare/facultate"},{"value":"8","text":"Studii post-universitare"},{"value":"99","text":"Nu știu / Nu răspund"}],"optionsCaption":"Alege raspuns ..."},{"type":"dropdown","name":"question24","title":"Care este ocupația dumneavoastră actuală?","isRequired":true,"requiredErrorText":"Te rugam sa selectezi un raspuns!","choices":[{"value":"r_1","text":"Patron/ întreprinzător particular"},{"value":"r_2","text":"Manager/ șef de departament"},{"value":"r_3","text":"Angajat cu studii superioare"},{"value":"r_4","text":"Angajat cu studii medii"},{"value":"r_5","text":"Elev,student"},{"value":"r_6","text":"Casnic "},{"value":"r_7","text":"Șomer"},{"value":"r_8","text":"Pensionar"},{"value":"r_9","text":"Nu lucrez (concediu de maternitate, de boală etc)"}],"optionsCaption":"Alege raspuns ..."},{"type":"radiogroup","name":"question25","title":" În care dintre următoarele categorii se încadrează suma veniturilor nete lunare din gospodăria ta (suma veniturilor tuturor membrilor din gospodărie)?<BR><i>Vă rugăm să alegeți o singură variantă de răspuns.</i>","isRequired":true,"requiredErrorText":"Te rugam sa selectezi un raspuns!","choices":[{"value":"item1","text":"Sub 1000 lei"},{"value":"item2","text":"Între 1.001 - 2.000 lei"},{"value":"item3","text":"Între 2.001 - 3.000 lei"},{"value":"item4","text":"Între 3.001 – 4.000 lei"},{"value":"item5","text":"Între 4.001 -  6.000 lei"},{"value":"item6","text":"Între 6.001 - 7.000 lei"},{"value":"item7","text":"Între 7.001 – 9.000 lei"},{"value":"item8","text":"Peste 9.000 lei"},{"value":"item9","text":"Refuz să răspund"}]},{"type":"radiogroup","name":"question27","title":"În care dintre următoarele categorii se încadrează venitul tău personal lunar net?<BR><i>O singură variantă de răspuns.</i>","isRequired":true,"requiredErrorText":"Te rugam sa selectezi un raspuns!","choices":[{"value":"item1","text":"Fără venit"},{"value":"item2","text":"Sub 1000 lei"},{"value":"item3","text":"Între 1.001 - 2.000 lei"},{"value":"item4","text":"Între 2.001 - 3.000 lei"},{"value":"item5","text":"Între 3.001 – 4.000 lei"},{"value":"item6","text":"Între 4.001 -  6.000 lei"},{"value":"item7","text":"Între 6.001 - 7.000 lei"},{"value":"item8","text":"Între 7.001 – 9.000 lei"},{"value":"item9","text":"Peste 9.000 lei"},{"value":"item10","text":"Refuz să răspund"}]}],"visibleIf":"{question1} = 'item1' and {question2} = 'item1' and {question3} = 'item1' and {question4} = 'item1'","title":"<h5><b>DATE SOCIO-DEMOGRAFICE</b></h5>"},{"name":"page1","title":"Acestea au fost toate întrebările. Vă mulțumim pentru colaborare!"}],"showProgressBar":"top","pagePrevText":"Inapoi","pageNextText":"Continua","completeText":"Trimite"};
let infoLineId = 'InfoLine121';
let infoLineInput = '/tmp/infoLine_121_answers.txt';
let infoLineOutput = '/tmp/infoLine_121_report.csv';
parseSurveyAnswers(infoLineInput,infoLineOutput, infoLineSurveyDef, infoLineId);




