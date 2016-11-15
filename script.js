$( document ).ready(function() {

var msgs=["A rezar ao Maló","A invocar Satanás","A sacrificar uma virgem","A pedir clemência ao Mooshak","A queimar as teclas","A chumbar AM","A fazer memes","A tirar o esparguete do código"];

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
    console.log(noTimeForShit());
    if(!noTimeForShit()){
    var i=0;
    var msg_arr = shuffleArray(msgs);
    function changeMsg(){
        $("#box_msg").text(msg_arr[i]+"...");
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
    } else{
        callback();
    }
    
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
        if(error_obj.errors_location.length != 0){
            $("#output_msg").removeClass('output_good').addClass('output_bad').html("Foram encontrados "+error_obj.errors_location.length+" erros");
        } else{
            $("#output_msg").removeClass('output_bad').addClass('output_good').html("Não foram encontrados erros");
        }
        $("#output_msg").show();
        jumpTo("#processed_code");
    });
}
function writeToOutput(code){
    $("#processed_code").html(code);
}
    
$("#analyze_btn").click(processCode);
});