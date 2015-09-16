var key=2,o,p,i,j,l=false,s1=[0],s2=[0],meet,f=true,stop=false,count=1,one=true,delay=700;
window.onload=go;document.onkeydown=function (e){var b=e.keyCode-37;b>=0&&b<=3?key=b:b;};
function rand(){return Math.floor(Math.random()*(10))+0;}
function check_eat(){var r=true; o=rand();p=rand();for(t=0;t<s1.length;t++){if(s1[t]==o&&s2[t]==p)r=false;}return r;}
function set_cell(x,y){$('#'+x+'_'+y).css("background-color","black");}
function clear_prev(a,b){$('#'+a+'_'+b).css("background-color","white");}
function set_eat(){$('#'+o+'_'+p).css("background-color","orange");}
function change(v){if(key==0)s2[v]--;if(key==2)s2[v]++;if(key==1)s1[v]--;if(key==3)s1[v]++;}
function last(v){if(key==0)s2[v]++;if(key==2)s2[v]--;if(key==1)s1[v]++;if(key==3)s1[v]--;}
function limit(e){return e>=0&&e<=9;}
function initial(){generateTable();i=0,j=0;$('td').attr("id",function(){if(j==10){i++;j=0;}return i+'_'+(j++);});}
function generateTable(){i=0;var gt=$('#tab'),frag=document.createDocumentFragment(),tr=document.createElement('tr'),td=document.createElement('td');
while (i<10){var _tr = tr.cloneNode(),j = 0;while (j<10){_tr.appendChild(td.cloneNode());j++;}gt.append(_tr);i++;}gt.append(frag);}
var code = function(){s1.unshift(s1[0]);s2.unshift(s2[0]);if(!f)change(0);meet=s1[0]==o&&s2[0]==p;
for(t=0;t<s1.length;t++){if(!limit(s1[t])||!limit(s2[t]))stop=true;}
for(t=1;t<(count>1?s1.length:s1.length-1);t++)if(s1[0]==s1[t]&&s2[0]==s2[t]){stop=true;break;}
if(stop){clearInterval(code);if(one)alert("Game over! Your score: "+count);one=false;}
else{if(meet){count++;s1.push(s1[s1.length-1]);s2.push(s2[s2.length-1]);last(s1.length-1);l=false;}
if(!l){while(!check_eat())check_eat();set_eat();l=true;}clear_prev(s1[s1.length-1],s2[s2.length-1]);s1.pop();s2.pop(); 
for(r=0;r<s1.length;r++)set_cell(s1[r],s2[r]);f=false;}}
function go(){initial();setInterval(code,delay);}