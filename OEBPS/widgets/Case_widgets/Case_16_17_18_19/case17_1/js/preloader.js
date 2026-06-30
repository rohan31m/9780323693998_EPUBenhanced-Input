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
	

	"images/q2/on017-ca001f001-9780323640251.png",
	"images/q2/on017-ca001f001-9780323640251-a.png",
	"images/q2/on017-ca001f001-9780323640251-b.png",

	"images/q4/on017-ca001f002-9780323640251.png",
	"images/q4/on017-ca001f002-9780323640251-a.png",
	"images/q4/on017-ca001f002-9780323640251-b.png",
	"images/q4/on017-ca001f002-9780323640251-c.png",
	"images/q5/on017-ca001f003-9780323640251.png",
	
	"images/q8/17-1-9-new.png",
	"images/q8/on017-ca001f004-9780323640251.png",
	"images/q8/on017-ca001f004-9780323640251-a.png",
	"images/q8/on017-ca001f004-9780323640251-b.png",
	"images/q8/on017-ca001f004-9780323640251-c.png",
	"images/q8/on017-ca001f005-9780323640251.png",
	"images/q8/on017-ca001f005-9780323640251-a.png",
	"images/q8/on017-ca001f005-9780323640251-b.png",
	"images/q8/on017-ca001f005-9780323640251-c.png",
	"images/q8/on017-ca001f005-9780323640251-d.png"
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