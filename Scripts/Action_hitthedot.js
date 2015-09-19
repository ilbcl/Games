var i,result,time,c,stop,p,row,col;
function rand(){return Math.floor(Math.random()*(row*col))+0;}
function generateTable(){var gt=$('#tab'),frag=document.createDocumentFragment(),tr=document.createElement('tr'),td=document.createElement('td');i=0;
while (i<row){var _tr = tr.cloneNode(),j = 0;while (j<col){_tr.appendChild(td.cloneNode());j++;}gt.append(_tr);i++;}gt.append(frag);
i=0;$('#tab td').attr("id",function(){return i++;});}
function startTimer(){c=setInterval(function (){time++;set_timer();if(time==30){stop=1;stopTimer();clear_goal(p);alert('Game over! Your score: '+result);}},1000)}
function stopTimer(){clearInterval(c);}
function set_goal(o){$('#'+o).css("background-color","orange");}
function clear_goal(i){$('#'+i).css("background-color","white");}
function set_result(){$("#out").text(result);}
function set_timer(){$("#timer").text(time);}
function resetTable(){$('#row').val('');$('#col').val('');}
function showMenu(){resetTable();$('#menu').show();$('#action').hide();stopTimer();}
function choose(a){if(a==p){p=rand();clear_goal(a);set_goal(p);result++;}else result--; set_result();}
function initial(){stop=1;i=0;result=0;time=0;row=$('#row').val();col=$('#col').val();p=rand();}
function go(){set_goal(p);startTimer();stop=0;}
function load(){initial();stopTimer();$("#tab tr").remove();generateTable();$('#menu').hide();$('#action').show();set_result();set_timer();setTimeout(go,1000)};
$(document).ready(function(){$("#tab").on("click", "td", function(){if(!stop)choose(+($(this).attr('id')));});});