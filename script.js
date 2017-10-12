 zip.useWebWorkers = false;

$( document ).ready(function() {

var totalReport = {
    files:0,
    errors:0
}

var msgDuration=1.3;
var msgNumb=3;    

var msgs=["A rezar ao Maló","A invocar Satanás","A sacrificar uma virgem","A pedir clemência ao Mooshak","A queimar as teclas","A chumbar AM","A fazer memes","A praxar os bugs"];

$("#total-report").hide();
function updateTotalReport(){
    $("#total-report").show();
    if(totalReport.errors>0){
        let text = "Encontrados "+totalReport.errors+" erros em "+totalReport.files+ " ficheiro"+(totalReport.errors>1 ? "s":"");
        document.getElementById('total-report').innerHTML = text;
    } else{
        document.getElementById('total-report').innerHTML = "Nenhum erro encontrado!"
    }
}
    
function isFixable(char){
    return false;
}
    
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}    

function isPretty(){
    return ($("#pretty").is(':checked'));
}    

function noTimeForShit(){
    return true;
    return ($("#hurry").is(':checked'));
}
    
function charAllowed(charCode){
    return (charCode>0 && charcode<127);
}
    
function isAscii(input) {
  return input.charCodeAt(0) <= 127;
}

function findAsciiErrors(code) {
  var returned_obj={
    "errors_location":[],
    "fixable_location":[],
    "errors_msg":"",
    "fixed_msg":""
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
    
function jumpTo(id){
    //id = "#processed_code"
    $('html, body').animate({
        scrollTop: $(id).offset().top
    }, 500);   
}

function funny(callback){
    //console.log(noTimeForShit());
    if(!noTimeForShit()){
    var i=0;
    var msg_arr = shuffleArray(msgs);
    function changeMsg(){
        $("#box_msg").text(msg_arr[i]+"...");
        setTimeout(function(){
            i++;
            if(i<msgNumb){
                changeMsg();
            } else{
                callback();
            }
        }, msgDuration*1000);
    }
    if(msgNumb>0){
        changeMsg();
    }
    } else{
        callback();
    }
    
}

function createReport(text,errorNum,filename){
    let good = errorNum == 0;
    let template = `
        <div class="info output_type output_msg"><span>filename</span> - info_text</div>
        <pre class="code processed_code">text</pre>`;
    let badTxt = "Foram encontrados "+errorNum+" erros"
    let goodTxt =  "Não foram encontrados erros"
    template = template.replace('filename',filename)
    template = template.replace('info_text',(good ? goodTxt : badTxt));
    template = template.replace('output_type',(good ? "output_good":"output_bad"));
    template = template.replace('text',text);

    return template;
}

function processCode(toFix,filename){
    filename = filename || "";
    $("#modal").show();
    funny(function(){
        $("#modal").hide();
        toFix = replaceTags(toFix);
        var output_txt="";
        var error_obj;
        if(isPretty()){
            toFix=js_beautify(toFix);
        }
        error_obj = findAsciiErrors(toFix);
        output_txt = error_obj.errors_msg;
        let errorNum = error_obj.errors_location.length;
        if(errorNum>0){
            totalReport.files++;
            totalReport.errors += errorNum;
        } else{
            output_txt = "";
        }
        updateTotalReport();
        let html = createReport(output_txt,errorNum,filename);
        document.getElementById('output_list').innerHTML += html;
        //writeToOutput(output_txt);
        //if(error_obj.errors_location.length != 0){
        /*    $("#output_msg").removeClass('output_good').addClass('output_bad').html("Foram encontrados "+error_obj.errors_location.length+" erros");
        } else{
            $("#output_msg").removeClass('output_bad').addClass('output_good').html("Não foram encontrados erros");
        }
        $("#output_msg").show();*/
        //jumpTo("#output_list");
    });
}
    
function fixBugs(){
    writeToOutput(
        findAsciiErrors(
            $("#code_input").val()
        ).fixed_msg);
}
    
function writeToOutput(code){
    $("#processed_code").html(code);
}

function loadFiles(){
    let list = [];
    let inputs = document.getElementsByClassName('uploader');
    for(let i=0;i<inputs.length;i++){
        let input = inputs[i];
    }
    return list;
    return [{name:'filename',content:"txt"}];
}

function replaceTags(str){
    var tagsToReplace = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;'
};

    function replaceTag(tag) {
        return tagsToReplace[tag] || tag;
    }

    return str.replace(/[&<>]/g, replaceTag);
}

function loadTexts(){
    let fileList = loadFiles();
    return fileList.push({name:'manual',content:$("#code_input").val()});
}
    
$("#analyze_btn").click(()=>{

    processCode();
});

function getFiles(file, onend) {
    zip.createReader(new zip.BlobReader(file), function(zipReader) {
        zipReader.getEntries(onend);
    }, onerror);
}

document.getElementById('uploader').addEventListener('change', function() {
        totalReport = {
            files:0,
            errors:0
        }
        $("#total-report").hide();
        document.getElementById('output_list').innerHTML = "";
        var file = this.files[0];
        if(file.name.includes(".zip")){
        console.log('loading zip...');
       /* linkCounter = 0;
        if (!file) {
            return;
        }
        var fileReader = new FileReader();
        fileReader.onload = function (e) {
            output = e.target.result;
            console.log("reading zip");

        };
        fileReader.readAsText(file);*/
        // use a BlobReader to read the zip from a Blob object
        zip.createReader(new zip.BlobReader(file), function(reader) {

          // get all entries from the zip
          reader.getEntries(function(entries) {
            if (entries.length) {
                for(let i = 0;i<entries.length;i++){
                    let entry = entries[i];
                    if(!entry.directory){
                        console.log(entry.filename);
                          // get first entry content as tex
                        entry.getData(new zip.TextWriter(entry), function(text) {
                          // text contains the entry data as a String
                          processCode(text,entry.filename);
                          //console.log(text);
                          // close the zip reader
                          reader.close(function() {
                            // onclose callback
                          });
                        }, function(current, total) {
                          // onprogress callback
                        });
                    }
                }
            } else{
                console.log('no entries found');
            }
          });
        }, function(error) {
          // onerror callback
        });
    } else {
        alert ("O ficheiro introduzido não é um zip");
    }
});

});