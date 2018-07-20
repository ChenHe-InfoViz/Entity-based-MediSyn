var cosmicCsv = "drug,mutation,tumor,effect,evidence,source\n";

// var cosmicData = []; //{drug; mutation; pubmed}
function parseCosmic(){
	d3.tsv("javascripts/datasets/CosmicResistanceMutations.tsv", function(error, data){
		if(error) throw error;
		var cosmicData= [];
		data.forEach(function(d){
			if(d["AA Mutation"].includes('?')) return;
			var drugParts = d["Drug Name"].split("-");
			var drug = drugParts[0].trim().toLowerCase();
			//if(obj.drug.indexOf('-') > 0) return;
			var mut = d["AA Mutation"].split(".");
			var mutation = d["Gene Name"] + "(" + mut[1] + ")";
			// obj.cosmicSource = d["Pubmed Id"];
			var histo = d["Histology"]
			var histo1 = d["Histology Subtype 1"]
			var tissue = d["Primary Tissue"]
			var source = d["Pubmed Id"]
			
			var tumor = "";
			if(tissue == "prostate" || tissue == "breast" || tissue == "thyroid") tumor = tissue;
			else if(tissue == "lung"){
				if(histo1 == "non_small_cell_carcinoma") tumor = "non-small cell lung";
				else tumor = "lung"
			}
			else if(tissue == "large_intestine") tumor = "colorectal"
			else if(histo1 == "basal_cell_carcinoma") tumor = "skin"
			else if(histo == "gastrointestinal_stromal_tumour") tumor = "gastrointestinal stromal"
			else if(histo == "malignant_melanoma") tumor = "melanoma";
			else if(histo == "inflammatory_myofibroblastic_tumour") tumor = 'inflammatory myofibroblasti tumor'
			else if(histo == "primitive_neuroectodermal_tumour-medulloblastoma") tumor = "brain"
			else {
				var parts = histo1.split("-")
				parts = parts[0].split("_")
				for(var i = 0; i < parts.length; i++){
					tumor += parts[i] + " "
				}
			}
			tumor = tumor.trim().capitalizeFirstLetter();
			tumor = tumor.replace(/leukaemia/g, "leukemia")
			var re = $.grep(mutationDrug, function(e){
				return e.drug == drug && e.mutation == mutation && e.tumor == tumor;
			});
			if(re.length > 0){
				re[0].value.source += ";" + source.trim();
			}
			else
				mutationDrug.push( {drug: drug, mutation: mutation, value: {effect: "Resistant", level: "Clinical trial", source: source.trim(), dataset: ["COSMIC"]}, tumor: tumor} );
					
		})
		//mutationDrug = _.uniqWith(mutationDrug, _.isEqual);

		for(var i = 0; i < mutationDrug.length; i++){
			cosmicCsv += mutationDrug[i].drug + "," + mutationDrug[i].mutation + "," + mutationDrug[i].tumor + ',' +  mutationDrug[i].value.effect + "," + mutationDrug[i].value.level + "," + mutationDrug[i].value.source + "\n"
		}
		download('cosmic.csv', cosmicCsv);
		//mutationDrug = mutationDrug.concat(cosmicData)
		//getDTCMutationList();
	})
}