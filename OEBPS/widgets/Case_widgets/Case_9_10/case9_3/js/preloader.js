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
	
	"images/q2/on009-ca003f001-9780323640251.png",
	"images/q2/on009-ca003f001-9780323640251-a.png",
	"images/q2/on009-ca003f002-9780323640251.png",
	"images/q2/on009-ca003f002-9780323640251-a.png",
	"images/q2/on009-ca003f002-9780323640251-b.png",
	"images/q5/on009-ca003f003-9780323640251.png",
	"images/q5/on009-ca003f003-9780323640251-a.png",
	"images/q5/on009-ca003f003-9780323640251-b.png",
	"images/q5/on009-ca005f003-9780323640251.png",
	"images/q5/on009-ca005f003-9780323640251-a.png",
	"images/q5/on009-ca005f003-9780323640251-b.png",
	"images/q11/on009-ca003f004-9780323640251_3c.png",
	"images/q11/on009-ca005f004-9780323640251_3c.png",
	"images/q14/on009-ca003f005-9780323640251_3c.png",
	"images/q14/on009-ca003f005a-9780323640251-new.png",
	"images/q14/on009-ca003f005-9780323640251-b.png",
	"images/q14/on009-ca003f005b-9780323640251.png",
	"images/q23/on009-ca003f006-9780323640251_3c.png"
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