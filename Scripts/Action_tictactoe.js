var item,mas,stop,s,id;window.onload=load;
function load(){$('#first').css('color', 'red');$('#second').css('color', 'black');
item=0;stop=0;mas=[0,0,0,0,0,0,0,0,0];
for (i = 0; i < 9; i++){$('td').attr("id",function(p){return p;});$('img').attr("id",function(p){return 'q'+p;});$('#q' + i).attr('src', "");}}
function r(q,w,e){return s==mas[q]&&s==mas[w]&&s==mas[e];}
function win(x){s=x;return r(0,1,2)||r(0,3,6)||r(6,7,8)||r(2,5,8)||r(1,4,7)||r(3,4,5)||r(0,4,8)||r(2,4,6);}
function check(kvadrat){id='q'+kvadrat;if(mas[kvadrat]==0&&stop==0){
item++;if(item%2==0){$('#' + id).attr('src', "Images/nolik.png");mas[kvadrat]=1;
$('#first').css('color', 'red');$('#second').css('color', 'black');
}else{ $('#' + id).attr('src', "Images/krestik.png");mas[kvadrat]=2;
$('#second').css('color', 'red');$('#first').css('color', 'black');
}if(win(1)||win(2)){if(win(1))alert('Second player win!');
else alert('First player win!');stop=1;}else if(item==9){alert('Draw');stop=1;}}
}$(document).ready(function (){$('td').click(function(){check(+($(this).attr('id')));});});