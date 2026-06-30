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
	
	"images/q1/on018-ca006f001-9780323640251.png",
	"images/q1/on018-ca006f001-9780323640251-a.png",
	"images/q1/on018-ca006f002-9780323640251.png",
	"images/q1/on018-ca006f002-9780323640251-a.png",
	"images/q1/on018-ca006f002-9780323640251-b.png",
	"images/q1/on018-ca006f003-9780323640251.png",
	"images/q1/on018-ca006f003-9780323640251-a.png",
	"images/q2/on018-ca006f004-9780323640251.png",
	"images/q2/on018-ca006f004-9780323640251-a.png",
	"images/q2/on018-ca006f004-9780323640251-b.png",
	"images/q2/on018-ca006f005-9780323640251.png",
	"images/q2/on018-ca006f005-9780323640251-a.png",
	"images/q2/on018-ca006f005-9780323640251-b.png",
	"images/q2/on018-ca006f006-9780323640251.png",
	"images/q2/on018-ca006f006-9780323640251-a.png",
	"images/q5/on018-ca006f007-9780323640251.png",
	"images/q5/on018-ca006f007-9780323640251-a.png",
	"images/q5/on018-ca006f007-9780323640251-b.png",
	"images/q6/on018-ca006f008-9780323640251.png",
	"images/q6/on018-ca006f008-9780323640251-a.png",
	"images/q6/on018-ca006f008-9780323640251-b.png",
	"images/q6/on018-ca006f008-9780323640251-c.png",
	"images/q6/on018-ca006f008-9780323640251-d.png",
	"images/q7/on018-ca006f009-9780323640251.png",
	"images/q8/on018-ca006f010-9780323640251.png",
	"images/q8/on018-ca006f001-9780323640251-a.png",
	"images/q8/on018-ca006f010-9780323640251-b.png",
	"images/q9/on018-ca006f012-9780323640251.png",
	"images/q9/on018-ca006f013-9780323640251.png",
	"images/q9/on018-ca006f013-9780323640251-a.png",
	"images/q9/on018-ca006f013-9780323640251-b.png",
	"images/q9/on018-ca006f013-9780323640251-c.png",
	"images/q10/on018-ca006f014-9780323640251.png",
	"images/q10/on018-ca006f014-9780323640251-a.png",
	"images/q10/on018-ca006f014-9780323640251-b.png",
	"images/q10/on018-ca006f014-9780323640251-c.png",
	"images/q10/on018-ca006f014-9780323640251-d.png",
	"images/q10/on018-ca006f014-9780323640251-e.png",
	"images/q10/on018-ca006f014-9780323640251-f.png",
	"images/q11/on018-ca006f016-9780323640251.png",
	"images/q11/on018-ca006f016-9780323640251-a.png",
	"images/q11/on018-ca006f017-9780323640251.png",
	"images/q11/on018-ca006f017-9780323640251-a.png",
	"images/q11/on018-ca006f017-9780323640251-b.png",
	"images/q11/on018-ca006f017-9780323640251-c.png",
	"images/q11/on018-ca006f018-9780323640251.png",
	"images/q11/on018-ca006f018-9780323640251-a.png",
	"images/q11/on018-ca006f018-9780323640251-b.png"
	
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