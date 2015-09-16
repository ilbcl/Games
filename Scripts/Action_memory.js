var count = ['0','1','2','3','4','5','0','1','2','3','4','5'],firstOpenImage,secondOpenImage,firstOpenId,secondOpenId,path,result,cells=12;window.onload=load;
var imgSrc = ["Images/orange.png", "Images/apple.png", "Images/blueberries.png", "Images/strawberry.png", "Images/raspberries.png", "Images/mandarin.png"];
function shuffle(o) {for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x); return o;};
function load(){for (i = 0; i < cells; i++) {$('td').attr("id",function(i){return i;});$('img').attr("id",function(i){return 'q'+i;});}
if ((localStorage["Key"] == null))localStorage["Key"] = 0; $("#record").text(localStorage["Key"]); $("#start").prop('disabled', true);
result = 0;count = shuffle(count);$("#out").text(result);clear();for (var i = 0; i < cells; i++){$('#q' + i).attr('src', imgSrc[count[i]]);}
setTimeout(function () {for (i = 0; i < cells; i++) {$('#q' + i ).attr('src', "Images/choose.png");}$("#start").prop('disabled', false);}, 3000);}
function clear() { firstOpenImage = null; secondOpenImage = null; firstOpenId = null; secondOpenId = null;}
function resetRecord() {localStorage["Key"] = 0;$("#record").text(localStorage["Key"]);}
function finish() {var num = true;for (var i = 0; i < cells; i++) { if ($('#q' + i ).attr('src') == "Images/choose.png")num = false;}return num;}
function check(id) {path=imgSrc[count[id]];var closed = $('#q' + id).attr('src') == "Images/choose.png";
if ((firstOpenImage == null || secondOpenImage == null)&&closed){if (firstOpenImage == null) {firstOpenImage = path;firstOpenId = id;
$('#q' + firstOpenId).attr('src', firstOpenImage);} else {secondOpenImage = path;secondOpenId = id;$('#q' + secondOpenId).attr('src', secondOpenImage);
setTimeout(function(){if(firstOpenImage != secondOpenImage){$('#q' + firstOpenId).attr('src', "Images/choose.png");$('#q' + secondOpenId).attr('src', "Images/choose.png");
result -= 50;} else {result += 50;}$("#out").text(result);clear();finish();if (finish()){if(result>localStorage["Key"]){localStorage["Key"] = result;
$("#record").text(localStorage["Key"]);}alert('Your result: ' + result); } }, 350); }}} $(document).ready(function (){$('td').click(function(){check(+($(this).attr('id')));});});