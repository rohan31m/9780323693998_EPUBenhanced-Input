(function(app)
{
    var aScroll = new Array();
    nSlideCounter = 0;
    nLastLoadedSlide = 0;
    var aSlidesArray = new Array();
    var id = '';
    var indexId
    var ContentArray = '';
    var pageFirstSection = '';

    function init()
    {
        $("#midDiv1").css('visibility', 'hidden')
        $(window).load(function()
        {
            $(".loader").delay(1000).fadeOut("slow");
            $('.loadDiv').delay(1000).fadeOut(300);
        });

        $(".AnswerDiv").attr("role","button");
        $(".AnswerDiv").attr("aria-pressed","false");
        $(".AnswerDiv").attr("tabindex","0");
        $(".AnswerDiv").bind("click keyup", AnswerDivFun);

        $(document).bind("keydown mousedown", enable_scorm);

        ContentArray = data[0].tableData;
        for (var index = 1; index <= ContentArray.length; index++)
        {
            if (index == 1)
            {
                pageFirstSection = '';
            }
            else
            {
                pageFirstSection = 'pageFirstSection';
            }
        }
        $("title").append(data[0].headTitle);
        //$("p").addClass("tabindex");
    }

    $(document).ready(function()
    {
        init();
    });

    function AnswerDivFun(e)
    {
        if (e.type == "keyup" && e.keyCode != 13)
        {
            return true;
        }
        removePolite();
        var imageBoxHolderId = $(e.target).attr("data-imageBoxHolderid");
        // console.log(imageBoxHolderId);
        if ($(this).parent().find('.textArea').is(':visible'))
        {
            $(this).parent().find('.textArea').slideUp("fast", function() {
                ActivityMain.setHabitatContainerSize();
            });
            $(this).text("Show answer");
            $(this).attr("aria-pressed","false");
            $('.imageBoxHolder' + imageBoxHolderId).hide();          
            $('.imageThumbHolder' + imageBoxHolderId).hide();          
        }
        else
        {
            $(this).text("Hide answer");
            $(this).attr("aria-pressed","true");
            $(this).parent().find('.textArea').slideDown("fast", function() {
                $(this).parent().find(".wrapper").show();
                var mainDiv = $(this).closest(".midDiv");                
                var mainHsDiv = mainDiv.find('.imageBoxHolder' + imageBoxHolderId + '.hs_set1');
                $('.imageThumbHolder' + imageBoxHolderId).show();
                mainDiv.find('.imageThumbHolder' + imageBoxHolderId + ' .thumbnail').removeClass("thumbnail_active");       
                $(mainDiv.find('.imageThumbHolder' + imageBoxHolderId + ' .thumbnail')[0]).addClass("thumbnail_active");
                mainHsDiv.show();
                mainHsDiv.find('.containerImg').hide();
                mainHsDiv.find(".dropdownList li").removeClass("selected");
                mainHsDiv.find('.imageShow0').show();
                $(mainHsDiv.find(".dropdownList li")[0]).addClass("selected");
                mainHsDiv.find(".dropdownList").find('.current').text($(mainHsDiv.find(".dropdownList li")[0]).text());   
                // $('.Cont_Ans').focus();           
                ActivityMain.setHabitatContainerSize();
            });
        }
        
    }

    function enable_scorm(event)
    {
        $(this).addClass("ontab");
        if (event.type == "mousedown")
        {
            $(".tabindex").blur();
            $(".tabindex").removeClass("ontab");
        }
        if (event.keyCode == 9)
        {
            $(".tabindex").addClass("ontab");
        }
    }

    function fnAddScroll(indexId)
    {
        var myScroll = new IScroll('#wrap' + indexId,
        {
            scrollbars: true,
            mouseWheel: true,
            interactiveScrollbars: true,
            shrinkScrollbars: 'scale',
            fadeScrollbars: true,
            click: true
        });
    }

    function fnAddScroll(indexId)
    {
        var myScroll = new IScroll('#wrap' + indexId,
        {
            scrollbars: true,
            mouseWheel: true,
            interactiveScrollbars: true,
            shrinkScrollbars: 'scale',
            fadeScrollbars: true,
            click: true
        });
    }
    function removePolite(){
        $(".graphContainer").removeAttr("aria-live");
    }
})(Player = Player ||
{})
var Player;