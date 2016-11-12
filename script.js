$( document ).ready(function() {

var msgs=["A rezar ao Maló","A invocar Satanás","A sacrificar uma virgem","A pedir clemência ao Mooshak","A queimar as teclas","A chumbar AM","A fazer memes","A tirar o esparguete do código"];
//array com indexes das frases usadas
var sentencesUsed = [];
    
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function getRandomMsg(){
    sentencesUsed.indexOf(1);
    var i = getRandomInt(0,msgs.length-1);
    while(sentencesUsed.indexOf(i)!=-1){
        i = getRandomInt(0,msgs.length-1);
    }
    sentencesUsed.push(i);
    console.log(i);
    console.log(sentencesUsed);
    return msgs[i];
}

function isPretty(){
    return true;
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
    "errors_msg":""
  };
  for (var i = 0; i < code.length; i++) {
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
    var i=0;
    function changeMsg(){
        $("#box_msg").text(getRandomMsg()+"...");
        setTimeout(function(){
            i++;
            if(i<3){
                changeMsg();
            } else{
                callback();
            }
        }, 1000);
    }

    changeMsg();
    sentencesUsed=[];
    
}
function processCode(){
    $("#modal").show();
    funny(function(){
        $("#modal").hide();
        var input = $("#code_input").val();
        var output_txt="";
        var error_obj;
        if(isPretty()){
            input=js_beautify(input);
        }
        error_obj = findAsciiErrors(input);
        output_txt = error_obj.errors_msg;
        writeToOutput(output_txt);
        jumpTo("#processed_code");
    });
}
function writeToOutput(code){
    $("#processed_code").html(code);
}
    
$("#analyze_btn").click(processCode);
});