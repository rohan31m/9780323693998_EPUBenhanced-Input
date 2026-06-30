var imgPreloadArray = new Array(
	"images/arrow.png",
	"images/bottom_patch.png",
	"images/check_btn.png",	
	"images/checkbox.png",
	"images/closeicon.png",
	"images/dot.png",
	"images/gray_dot.png",
	"images/loading.gif",
	"images/menu_btn.png",
	"images/next_btn.png",
	"images/next_btn.png",
	"images/placeholder.png",
	"images/placeholder.jpg",
	"images/prev_btn.png",
	"images/table_btn.png",
	"images/top_patch.png",	
	
	"images/q4/on013-ca005f001-9780323640251.png",
	"images/q6/on013-ca005f002-9780323640251.png",
	"images/q7/on013-ca005f003-9780323640251.png",
	"images/q7/on013-ca005f003-9780323640251-a.png",
	"images/q7/on013-ca005f003-9780323640251-b.png",
	"images/q7/on013-ca005f003-9780323640251-c.png",
	"images/q7/on013-ca005f003-9780323640251-d.png",
	"images/q7/on013-ca005f004-9780323640251.png",
	"images/q7/on013-ca005f004-9780323640251-a.png",
	"images/q9/on013-ca005f005-9780323640251.png",
	"images/q9/on013-ca005f005-9780323640251-a.png",
	"images/q9/on013-ca005f005-9780323640251-b.png",
	"images/q9/on013-ca005f005-9780323640251-c.png",
	"images/q9/on013-ca005f005-9780323640251-d-new.png"
	);
var imagePreCount = 0;
for(var pId = 0; pId < imgPreloadArray.length; pId++)
{
	var img = new Image();
	img.onload = imagePreloaded;
	img.src = imgPreloadArray[pId];
}
function imagePreloaded()
{
	imagePreCount++;
}