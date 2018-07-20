
String.prototype.capitalizeFirstLetter = function() {
	//if(this == null) return null;
    return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
}

function addMutationToDatarow(data){
	
	var results = $.grep(dataRow, function(e){
				return data.drug == e.drug;
	})
	var row;

	if(results.length == 0){
		row = {drug: data.drug, mutationTumor: []}
		dataRow.push(row);
	}
	else{
		if(results.length > 1) console.log("NC: multiple entries!!");
		row = results[0];
	}

	var re = $.grep(row.mutationTumor, function(e){
		return e.mutation == data.mutation && e.tumor.toLowerCase() == data.tumor.toLowerCase();
	})
		if(re.length > 0) {
			re[0].values.push(data.value)
		}
		else {
			var obj = {mutation: data.mutation, tumor: data.tumor, values: []}
		    row.mutationTumor.push(obj);
		    obj.values.push(data.value);
		}
}

//parseCGI();
//parseOncoKB();
//parseSynapse();
//parseCosmic();

var driverFiles = [];
var driverCount = 0;
//driverFiles.push({file: "aml", tumor: "Acute myeloid leukemia"})
//driverFiles.push({file: "all", tumor: "Acute lymphoblastic leukemia"})
//driverFiles.push({file: "thca", tumor: "Thyroid"})
//driverFiles.push({file: "brca", tumor: "Breast"})

//driverFiles.push({file: "cll", tumor: "Chronic lymphocytic leukemia"})
//driverFiles.push({file: "luad", tumor: "Lung"})
//driverFiles.push({file: "blca", tumor: "Bladder"})
//driverFiles.push({file: "hnsc", tumor: "Head and neck"})
// driverFiles.push({file: "coread", tumor: "Colorectal"})
// driverFiles.push({file: "prad", tumor: "Prostate"})
// driverFiles.push({file: "nsclc", tumor: "Non-small cell lung"})
//parseDriver(driverFiles[driverCount].file, driverFiles[driverCount].tumor);

var allCsv = "mutation,tumor,statement\n";
var driverState = [];


function parseDriver(filename, tumor){
	d3.tsv("javascripts/datasets/" + filename + ".tsv", function(error, data){
		if(error) throw error;
		data.forEach(function(d){
			if(!d.protein.match("p")) return;
			var gene = d.gene.trim();
			var proteins = d.protein.split(".")
			var protein = proteins[1].trim();
			var result = d.driver.trim();
			if(result == "predicted") result = "predicted driver";
			else if(result == "") result = d["driver_statement"];
			var mutation = gene + "(" + protein + ")";
			var re = $.grep(mutationDrug, function(e){
				return e.mutation == mutation && e.tumor == tumor
			})
			if(re.length > 0 || result == "known" || result == "predicted driver")
				driverState.push({mutation: mutation, tumor: tumor, state: result})
		})
		driverCount++;
		if(driverCount >= driverFiles.length) wrapup()
		else parseDriver(driverFiles[driverCount].file, driverFiles[driverCount].tumor);
	})
}

function wrapup(){
	driverState = _.uniqWith(driverState, _.isEqual);
	for(var i = 0; i < driverState.length; i++){
		allCsv += driverState[i].mutation + "," + driverState[i].tumor + "," + driverState[i].state + "\n"
	}
	download("driver.csv", allCsv);
}



function setInitialActiveMutation(){
	// console.log(mutation)
	var temp = [//"Q9WJQ2(K65R)",
	// "ABL1(H396P)","ABL1(M351T)","ABL1(Q252H)",
	// "ABL1(Y253F)", 
	// "BRAF(V600E)", 
	// "EGFR(T790M)", //"ABL(I242T)", "ABL(F317C)",
	"ABL1(T315I)",
 "ABL1(F317L)",
 "ABL1(F317I)",
 "ABL1(E255K)",
 "ABL1(Y253H)",
 "ABL1(F359V)",
 "EGFR(L861Q)",
 "EGFR(L858R)",
 // "EGFR(G719S)",
 // "EGFR(G719C)",
  // "EGFR(T790M)",

 
 // "KIT(D816V)",
 // "RET(M918T)"
// "ABL1(G250E)", 
// "GHSR(S123Y)",
// "ABL1(T315I)",
// "EZH2(Y641N)",
// "Q20MD5(S31N)",
// "FLT3(D835Y)",
// "BRAF(V600E)",
// "IDE(E341A)",
// "HEXB(P504S)"
]
	for(var i = 0; i < temp.length; i++){
//mutationChecked( temp[i])
		mutationWaitingList.push(temp[i])
		//setTimeout(mutationChecked( temp[i]), 5000 * i)
		//document.getElementById("input" + temp[i]).checked = true;
	}
	mutationChecked(mutationWaitingList[0])

}

parseCgiCancerName()
var tumorList = {}
var tumors = []
function parseCgiCancerName(){
	d3.tsv("javascripts/datasets/tumor.tsv", function(err, tumorObjs){
		//console.log(tumors)
		tumorObjs.forEach(function(d){
			tumors.push(d.tumor)
		})
		console.log(tumors)
		d3.tsv("javascripts/datasets/cancer_acronyms.tsv", function(error, data){
			if(error) throw error;
			data.forEach(function(d){
				if(tumors.indexOf(d.description.trim().capitalizeFirstLetter()) > -1){
					//var obj = {}
					tumorList[d.cancer_acronym.trim()] = d.description.trim().capitalizeFirstLetter();
					//console.log(obj)
					//tumorList.push(obj)
				}
			})
			console.log(tumorList)
			parseCgiMutation();
		})
	})
}

// var mutationList = [];
// function getMutationList(){
// 	d3.tsv("javascripts/datasets/mutation.tsv", function(err, mutations){
// 		mutationList = mutations;
// 		parseCgiMutation()
// 	})
// }

var cgiMutation = "mutation,tumor,source\n"

function parseCgiMutation(){
	d3.tsv("javascripts/datasets/cgi_oncogenic_muations.tsv", function(error, data){
		if(error) throw error;
		data.forEach(function(d){
			var tums = d.cancer_acronym.split(";")
			var proPart = d.protein.split(".");
			var source = d.source.replace(/,/g, ";")
			if(proPart.length < 2) return;
			var mutation = d.gene.trim() + "(" + proPart[1].trim() + ")"
			for(var i = 0; i < tums.length; i++){
				if(tumorList.hasOwnProperty(tums[i])){
					cgiMutation += mutation + "," + tumorList[tums[i]] + "," + source + "\n"
					//var obj = {mutation: mutation, tumor: tumorList[tumors[i]], source: source}
				}
			}
		})
		download('cgiMutation.csv', cgiMutation);
	})
}

function parseDTC(){
	// d3.request("javascripts/datasets/group.csv")
	//   .response(function(text){ return d3.dsvFormat(';').parse(text.responseText); })
	//   .get(interpretDTC)
	d3.dsv(";")("javascripts/datasets/group1.csv", 
	function interpretDTC(data){
		//console.log(data)
		data.forEach(function(d, i){
			
			// split EGFR(L858R, T790M)
			//var parts = d["Mutation information"].split(/[()-]+/);
			var parts = d["Mutation information"].split("-");

			//find all drugs from DTC related to the mutation, not just ones that appear in CGI
			var results = $.grep(mutationDrug, function(e){
				return d["Compound Name"].trim().toUpperCase() == e.drug.trim().toUpperCase() && parts[0].trim() == e["mutation"] //&& e.effect == "Responsive"
			})
			//find the drug and mutation in CGI
			if(results.length > 0){
				if(results.length > 1) console.log("multiple drug entries!!!")
				//console.log(d["Compound Name"]);

				//var parts = d["Mutation information"].split(/[\(\)]+/).filter(Boolean);
				//console.log(parts)
				var muTemp = parts[0].trim();//d["Mutation information"]//parts[0] + ":" + parts[1]; 

				var bioa = {
						"Compound Name": d["Compound Name"], 
						"Standard inchi key": d["Standard inchi key"], 
						"Uniprot ID": d["Uniprot ID"], 
						"Target Pref Name": d["Target Pref Name"], 
						"Gene Name": d["Gene Names"], 
						"Mutation Information": muTemp,
						"PubMed ID": d["PubMed ID"],
					    "End Point Standard Type": d["End Point Standard Type"], 
					    "End Point Standard Relation": d["End Point Standard Relation"], 
					    "End Point Standard Value": d["End Point Standard Value"], 
					    "End Point Standard Units": d["End Point Standard Units"], 
					    "Endpoint Mode of Action": d["Endpoint Mode of Action"],
					    "Assay Format": d["Assay Format"], 
					    "Assay Type": d["Assay Type"]
					   }
			//console.log(bioa);
			//bioactivity.push(bioa);

				//console.log(results[0].mutation);
				if(!results[0].hasOwnProperty("total")){
					results[0].total = [];
					results[0].dtcsource = [];
					results[0].dataset.push("DTC")
				}

				results[0].total.push( parseFloat(d["End Point Standard Value"].replace(/\,/g,'.')) )
				results[0].dtcsource.push( d["PubMed ID"] )
									//console.log(results[0]);

			}
			else {
				//data not in CGI
				var ob = {drug: d["Compound Name"].capitalizeFirstLetter(), mutation: parts[0].trim(), total: [], dtcsource: [], dataset: ["DTC"]};
				ob.total.push( parseFloat(d["End Point Standard Value"].replace(/\,/g,'.')) )
				ob.dtcsource.push( d["PubMed ID"] )
				mutationDrug.push(ob)
			}


		})


		//console.log(drugList)
		
		//activeMutation = mutation.slice();

		mutationDrug.forEach(function(d, i){
			if(!d.hasOwnProperty("total")) return;

			d.total = d.total.sort();
			//console.log(d.total)
			length = d.total.length;
			if(length % 2 == 0) d.med = ( d.total[Math.floor(length / 2)] + d.total[Math.floor(length / 2) - 1] ) / 2;
			else d.med = d.total[Math.floor(length / 2)];//d.total / d.count;
			//console.log(d.med);
		})

		var subset = $.grep(mutationDrug, function(e){
			var results = $.grep(activeMutation, function(c){
				return c.mutation == e.mutation
			})
			return results.length > 0;
		})

		//var curDrug = [];
		subset.forEach(function(d, i){
			var results = $.grep(dataRow, function(e){
				return d.drug == e.drug;
			})
			//console.log(d);
			if(results.length == 0){
				var obj = {drug: d.drug, dataset: {CGI: false, DTC: false}, mutationTumor: [], total: 0 }
				dataRow.push(obj);
				addMutationToDatarow(d, obj);
			}
			else{
				if(results.length > 1) console.log("NC: multiple entries!!");
				addMutationToDatarow(d, results[0]);
			}

		})
		//console.log(dataRow);

		new Ui();

	})
}

var cgiCsv = "drug,mutation,tumor,effect,evidence,source\n";

function parseCGI(){
	d3.tsv("javascripts/datasets/biomarkers.tsv", function(error, data){
		if(error) throw error;
		data.forEach(function(d){
				if(d.Drug == "[]" || d["individual_mutation"].trim() == "") return;
				var drug = d.Drug;
				var re = new RegExp(/\[/);  //ignore mutations like Exon 19 deletion/insertion, E311_K312del
				if(re.test(drug)) drug = drug.replace(/\[|\]/g, '');
				drug = drug.replace(/\;/g, ' + ');
				drug = drug.trim().split(',');
				var mutation = d["individual_mutation"]//.replace(/\s\(/g, ''); //delete spaces in biomarkers
				var parts = mutation.split(/\:|\./);
				mutation = parts[0] + "(" + parts[2] + ")"
				var association = d.Association.split("(");

				var tumors = d["Primary Tumor type"].split(";");
				var level = d["Evidence level"].split(",");

				for(var i = 0; i < drug.length; i++){
					for(var j = 0; j < tumors.length; j++){
						tumors[j] = tumors[j].replace("an neck","and neck");
						tumors[j] = tumors[j].replace("Hairy-Cell", "Hairy cell")
						tumors[j] = tumors[j].replace("Neuroendocrine tumor", "Neuroendocrine")
						tumors[j] = tumors[j].replace("Thyroid carcinoma", "Thyroid")
						tumors[j] = tumors[j].replace("adenocarcinoma", "")
						var dr = drug[i].replace("Tensirolimus", "Temsirolimus");
						mutationDrug.push( {drug: dr.trim().toLowerCase(), mutation: mutation, value: {effect: association[0].trim(), level: level[0], source: d["Source"], dataset: ["CGI"]}, tumor: tumors[j].trim()} );
					}
				}
		})
		//mutationDrug = _.uniqWith(mutationDrug, _.isEqual);
		parseOncoKB()
		// for(var i = 0; i < mutationDrug.length; i++){
		// 	cgiCsv += mutationDrug[i].drug + "," + mutationDrug[i].mutation + "," + mutationDrug[i].tumor + ',' +  mutationDrug[i].value.effect + "," + mutationDrug[i].value.level + "," + mutationDrug[i].value.source + "\n"
		// }
		// download('cgi.csv', cgiCsv);
	});
}

var synapseCsv = "drug,mutation,tumor,effect,evidence,source\n";

function parseSynapse(){
	d3.dsv(";")("javascripts/datasets/synapse1.csv", 
	function interpret(rows){
		rows.forEach(function(data){

			if(!(data.Description.trim().match("missense") || data.Description.trim().match("no mutation"))) return;
			if(data.Variant.match("exo") || data.Variant.match("codon") || data.Variant.match("any") || data.Variant.match("domain") || data.Variant.match("mut")) return
			var diseases = data.Disease.split(",");
			for(var j = 0; j < diseases.length; j++){
				if(diseases[j].trim() == 'lung_squamous') diseases[j] = "lung squamous cell";
				else if(diseases[j].trim() == 'head_neck') diseases[j] = "head and neck";
				else if(diseases[j].trim() == "lung_adeno") diseases[j] = "lung adenocarcinoma";
				else{
					var parts = diseases[j].trim().split("_");
					diseases[j] = "";
					for(var i = 0; i < parts.length; i++){
						if(i == parts.length - 1 && (parts[i] == "cancer" || parts[i] == "tumor")) continue;
						diseases[j] += parts[i] + " "
					}
				}
			}
			var variants = [];
			if(data.Description.trim().match("missense")){
				variants = data.Variant.split("/");
				for(var i = 1; i < variants.length; i++){
					variants[i] = variants[0].substr(0, variants[0].length - 2) + variants[i]
				}
				if(variants.length == 1) variants = variants[0].split(",");
				for(var n = 0; n < variants.length; n++){
					variants[n] = data.Gene.trim() + "(" + variants[n].trim() + ")"
				}
			}
			else variants.push(data.Gene.trim() + " wildtype")
			for(var i = 1; i < 9; i++){
				if(!data["Therapeutic context_" + i]) break;
				console.log(i + data["Therapeutic context_" + i])
				var drugs = data["Therapeutic context_" + i].split(",");
				var effect = data["Association_" + i].trim();
				var source = data["PMID_"+i].replace(/\,/g, ';')
				var levels = data["Status_"+i].split(",")
				switch(data["Association_" + i].trim()){
					case "response": effect = "responsive"; break;
					case "sensitivity": effect = "responsive"; break;
					case "resistance": effect = "resistant"; break;
					case "no response": effect = "no responsive"; break;
					case "no sensitivity": effect = "no responsive"; break;
					case "reduced sensitivity": effect = "resistant"; break;
					// case "response": effect = "responsive"; break;
				}
				for(var m = 0; m < drugs.length; m++){
					var dr = drugs[m].replace("Tensirolimus", "Temsirolimus");
					dr = dr.replace("tumor", "tumors");
					dr = dr.replace("novel ", "")
					for(var n = 0; n < variants.length; n++){
						for(var l = 0; l < diseases.length; l++){
							var di = diseases[l].replace("endometrial", "endometrium")
							di = di.trim().capitalizeFirstLetter();
							di = di.replace("adenocarcinoma","")
							mutationDrug.push( {drug: dr.trim().toLowerCase(), mutation: variants[n], value: {effect: effect.trim().capitalizeFirstLetter(), level: levels[0].trim(), source: source, dataset: ["Synapse"]}, tumor: di.trim()} );
						}
					}
				}
			}
		})
		mutationDrug = _.uniqWith(mutationDrug, _.isEqual);
		parseDriver(driverFiles[driverCount].file, driverFiles[driverCount].tumor);

		// for(var i = 0; i < mutationDrug.length; i++){
		// 	synapseCsv += mutationDrug[i].drug + "," + mutationDrug[i].mutation + "," + mutationDrug[i].tumor + ',' +  mutationDrug[i].value.effect + "," + mutationDrug[i].value.level + "," + mutationDrug[i].value.source + "\n"
		// }
		// download('synapse.csv', synapseCsv);
	})
}

var oncokbCsv = "drug,mutation,tumor,effect,evidence,source\n";

function parseOncoKB(){
	d3.tsv("javascripts/datasets/oncoKB.tsv", function(error, data){
		if(error) throw error;
		data.forEach(function(d){
			var oncoKB = {};
			var alt = d["Alteration"].trim();
			var re = new RegExp(/\_|\s|\/|\-|del/);  //ignore mutations like Exon 19 deletion/insertion, E311_K312del
			if(re.test(alt) ) return; 
			if(alt == "Fusions" || alt == "Amplification" || alt.match("del") || alt.match("ins")) return;
			oncoKB.drugs = d["Drugs(s)"].trim().split(",");
			if(alt == "Wildtype") oncoKB.mutation = d["Gene"].trim() + " wildtype"
			else oncoKB.mutation = d["Gene"].trim() + "(" + d["Alteration"].trim() + ")";
			oncoKB["tumor"] = d["Cancer Type"].trim();
			var parts = oncoKB.tumor.split(" ");
			if(parts[parts.length - 1] == "Cancer" || parts[parts.length - 1] == "Tumor"){
				oncoKB.tumor = "";
				for(var i = 0; i < parts.length - 1; i++){
					oncoKB.tumor += parts[i] + " "
				}
			}
			oncoKB.tumor = oncoKB.tumor.trim().capitalizeFirstLetter();
			oncoKB.tumor = oncoKB.tumor.replace("adenocarcinoma", "")
			oncoKB["level"] = d["Level"].trim();
			oncoKB["source"] = d["PMIDs for drug"].trim().replace(/\,/g, ';');
			if(d.Level.trim() != "R1") oncoKB.effect = "Responsive";
			else {
				oncoKB.effect = "Resistant";
				oncoKB.level = "1";
			}
			for(var i = 0; i < oncoKB.drugs.length; i++){
				var dr = oncoKB.drugs[i].replace("Cabozatinib", "Cabozantinib");
				dr = dr.replace("Gefitnib", "Gefitinib");
				mutationDrug.push({drug: dr.trim().toLowerCase(), mutation: oncoKB.mutation, value: {level: oncoKB["level"], effect: oncoKB.effect, dataset: ["oncoKB"], source: oncoKB.source}, tumor: oncoKB.tumor.trim()})
			}
		})
		parseSynapse();
		// mutationDrug = _.uniqWith(mutationDrug, _.isEqual);	
		// for(var i = 0; i < mutationDrug.length; i++){
		// 	oncokbCsv += mutationDrug[i].drug + "," + mutationDrug[i].mutation + "," + mutationDrug[i].tumor + ',' +  mutationDrug[i].value.effect + "," + mutationDrug[i].value.level + "," + mutationDrug[i].value.source + "\n"
		// }
		// download('oncokb.csv', oncokbCsv);
	})
}
//})

// q.awaitAll(function(error, data){
// 	if(error) console.log(error);
// 		console.log(data)

// 	console.log("finishhhhhh")
// });