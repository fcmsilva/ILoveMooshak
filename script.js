 zip.useWebWorkers = false;

 $(document).ready(function() {

 	var totalReport = {
 		files: 0,
 		errors: 0
 	}

 	$("#total-report").hide();

 	function updateTotalReport() {
 		$("#total-report").show();
 		if (totalReport.errors > 0) {
 			let pluralErr = (totalReport.errors > 1 ? "s" : "");
 			let pluralFile = (totalReport.files > 1 ? "s" : "");
 			let text = "Encontrado" + pluralErr +" "+ totalReport.errors + " erro"+pluralErr+" em " + totalReport.files + " ficheiro" + pluralFile;
 			document.getElementById('total-report').innerHTML = text;
 		} else {
 			document.getElementById('total-report').innerHTML = "Nenhum erro encontrado!"
 		}
 	}

 	function isAscii(input) {
 		return input.charCodeAt(0) <= 127;
 	}

 	function findAsciiErrors(code) {
 		var returned_obj = {
 			"errors_location": [],
 			"fixable_location": [],
 			"errors_msg": "",
 			"fixed_msg": ""
 		};
 		var i;
 		for (i = 0; i < code.length; i++) {
 			var curr_char = code.charAt(i);
 			if (!isAscii(curr_char)) {
 				returned_obj.errors_location.push(i);
 				returned_obj.errors_msg += "<span class='err'>" + curr_char + "</span>"
 			} else {
 				returned_obj.errors_msg += curr_char;
 			}
 		}
 		return returned_obj;
 	}

 	function jumpTo(id) {
 		//id = "#processed_code"
 		$('html, body').animate({
 			scrollTop: $(id).offset().top
 		}, 500);
 	}

 	function createReport(text, errorNum, filename) {
 		let good = errorNum == 0;
 		let template = `
		<div class="info output_type output_msg"><span>filename</span> - info_text</div>
		<pre class="code processed_code">text</pre>`;
 		let badTxt = "Foram encontrados " + errorNum + " erros"
 		let goodTxt = "Não foram encontrados erros"
 		template = template.replace('filename', filename)
 		template = template.replace('info_text', (good ? goodTxt : badTxt));
 		template = template.replace('output_type', (good ? "output_good" : "output_bad"));
 		template = template.replace('text', text);

 		return template;
 	}

 	function processCode(toFix, filename) {
 		filename = filename || "";
 		toFix = replaceTags(toFix);
 		var output_txt = "";
 		var error_obj;
 		/*if (isPretty()) {
 			toFix = js_beautify(toFix);
 		}*/
 		error_obj = findAsciiErrors(toFix);
 		output_txt = error_obj.errors_msg;
 		let errorNum = error_obj.errors_location.length;
 		if (errorNum > 0) {
 			totalReport.files++;
 			totalReport.errors += errorNum;
 		} else {
 			output_txt = "";
 		}
 		updateTotalReport();
 		let html = createReport(output_txt, errorNum, filename);
 		document.getElementById('output_list').innerHTML += html;
 	}

 	function fixBugs() {
 		//you wish...
 	}

 	function replaceTags(str) {
 		let tagsToReplace = {
 			'&': '&amp;',
 			'<': '&lt;',
 			'>': '&gt;'
 		};

 		function replaceTag(tag) {
 			return tagsToReplace[tag] || tag;
 		}

 		return str.replace(/[&<>]/g, replaceTag);
 	}

 	document.getElementById('uploader').addEventListener('change', function() {
 		totalReport = {
 			files: 0,
 			errors: 0
 		}
 		$("#total-report").hide();
 		document.getElementById('output_list').innerHTML = "";
 		var file = this.files[0];
 		if (file.name.includes(".zip")) {
 			console.log('loading zip...');
 			zip.createReader(new zip.BlobReader(file), function(reader) {

 				reader.getEntries(function(entries) {
 					if (entries.length) {
 						let validEntries = 0;
 						for (let i = 0; i < entries.length; i++) {
 							let entry = entries[i];
 							if (!entry.directory && entry.filename.includes(".java")) {
 								validEntries++;
 								console.log(entry.filename);
 								entry.getData(new zip.TextWriter(entry), function(text) {
 									processCode(text, entry.filename);
 									reader.close(() => {});
 								}, (current, total) => {});
 							}
 						}
 						if (validEntries == 0) {
 							alert('Não foram encontrados ficheiros .java no zip');
 						}
 					} else {
 						alert('Não foram encontrados ficheiros no zip');
 					}
 				});
 			}, function(error) {
 				alert('Erro a ler o zip');
 			});
 		} else {
 			alert("O ficheiro introduzido não é um zip");
 		}
 	});

 });