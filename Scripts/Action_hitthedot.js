var i,result,time,c,stop,p;window.onload=go;
function rand(){return Math.floor(Math.random()*(60))+0;}
function generateTable(){
var gt=$('#tab'),frag=document.createDocumentFragment(),tr=document.createElement('tr'),td=document.createElement('td');i=0;
while (i<6){var _tr = tr.cloneNode(),j = 0;while (j<10){_tr.appendChild(td.cloneNode());j++;}gt.append(_tr);i++;}gt.append(frag);}
function startTimer(){c=setInterval(function (){time++;set_timer();if(time==30){stop=1;stopTimer();alert('Game over! Your score: '+result);}},1000)}
function stopTimer(){clearInterval(c);}
function set_goal(o){$('#'+o).css("background-color","orange");}
function clear_goal(i){$('#'+i).css("background-color","white");}
function set_result(){$("#out").text(result);}
function set_timer(){$("#timer").text(time);}
function choose(a){if(a==p){while(a==p)p=rand();clear_goal(a);set_goal(p);result++;}else result--; set_result();} 
function go(){stop=0;$("#tab tr").remove();	generateTable();i=0;$('td').attr("id",function(){return i++;});p=rand();result = 0;time=0;
set_result();set_timer();set_goal(p);stopTimer();startTimer();}
$(document).ready(function(){$("#tab").on("click", "td", function(){if(!stop)choose(+($(this).attr('id')));});});