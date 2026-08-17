(function(app)
{
    var aSlidesArray = new Array();
    var nSlideCounter = 0;
    var nLastLoadedSlide = 0;
    var nCount = 0;
    var footerLi = "";
    var divArr = new Array();
    // var audioElement = document.createElement('audio');
    $(document).ready(function()
    {
        $(window).load(function()
        {
            $(".loader").delay(800).fadeOut("slow");
            $('.loadDiv').delay(800).fadeOut(300);
        });
        init();
        //$(".topContent").hide();
        $(".footer").hide();
        $(".beginBtn").bind("click", fnBegin);
        $(".imagePopup").bind('click', showImagePopup);
        $(".closeimgpopup").bind('click', hideImagePopup);
        $('.midDiv').each(function()
        {
            divArr.push(this);
        })
        // $('.midDiv').attr("tabindex","-1");
        // $('.Cont_Ans').attr("tabindex","-1");
        $('#pageContainer').removeAttr("aria-live");
        $('#naviLeft').attr("aria-label","Previous");
        $('#naviRight').attr("aria-label","Next");
        $(".navigation").bind("click", fnHandelNavigationEvents);
        $("#naviList").on("keydown", ".navigation", handleSlideControlKeys);
        $("#naviLeft").bind("click keyup", fnBack);
        $("#naviRight").bind("click keyup", fnNext);
        $("#menuBtn").bind("click keyup", menuBtnFn);
        $(document).on("keydown", handleHamburgerMenuKeys);
        $("#tableBtn").bind("click keyup", tableBtnFn);
        $('.item').bind("click keyup", fnClickRadioBox);
        // working
        // $('.rb').bind("click keyup",fnClickRadioBox);
        $('.menuList li').bind("click keyup", fnHandelNavMenu);
        $('.midText').prop('scrollHeight', "427");
        /* setTimeout(function()
        {
            $(".nano").nanoScroller();
            $(".nano-pane").show();
        }, 100) */
    });

    function showImagePopup(ev)
    {
        if ($(this).attr('data-id') == "popupimg2")
        {
            $(this).parent().parent().parent().css("height", "300px");
        }
        $('#' + $(this).attr('data-id')).show();
    }

    function hideImagePopup(ev)
    {
        if ($(this).parent().attr("id") == "popupimg2")
        {
            $(this).parent().parent().parent().css("height", "auto");
        }
        $(this).parent().hide();
    }

    function fnClickRadioBox(ev)
    {
        if (ev.type == "keyup" && ev.keyCode != 13)
        {
            return true;
        }
        var currId = $(this).children().attr('data-id');
        var parentId = $(this).parents('.midDiv').attr('id');
        var currentCheckbox = $(this).find(".rb");
        $(".rb:visible").each(function(index)
        {
            loopCheckbox = $(this);
            if ($(currentCheckbox).parent().text() != $(loopCheckbox).parent().text())
            {
                // $('#' + parentId + ' .graph_'+(index+1)).css('display','none');
                if ($(this).attr('data-id') != currId)
                {
                    $(this).parents().removeClass('selectedRadioBtn');
                    $(this).removeClass("clicked");
                }
            }
        });

        if ($(this).find(".rb").hasClass("clicked"))
        {
            $(this).find(".rb").removeClass("clicked");
            $(this).removeClass('selectedRadioBtn');
            id = $(this).children().attr('data-id');
            indexId = id.substr(id.indexOf("_") + 1);
            $('.imgBlock').hide();
            $('.imageShow' + indexId).css('display', 'none');
        }
        else
        {
            $(this).find(".rb").addClass("clicked");
            $(this).addClass('selectedRadioBtn');
            id = $(this).children().attr('data-id');
            indexId = id.substr(id.indexOf("_") + 1);
            $('.imgBlock').hide();
            $('.imageShow' + indexId).css('display', 'block');
        }
    }

    function resetCheckboxes()
    {
        $(".rb").each(function(index)
        {
            $(this).parent().removeClass('selectedRadioBtn');
            $(this).removeClass("clicked");
        });
        $(".graphContainer").each(function(index)
        {
            var firstDiv = $(this).find("img:first");
            $(this).find('img').each(function(index)
            {
                if ($(this).attr("class") !== $(firstDiv).attr("class"))
                {
                    $(this).hide();
                }
                else
                {
                    $(this).show();
                }
            });
        });
    }

    var currScreenVisible = null;


    function setReferenceExpanded(isExpanded)
    {
        $('#tableBtn').attr('aria-expanded', isExpanded ? 'true' : 'false');
        $('#referencePanel').attr('aria-hidden', isExpanded ? 'false' : 'true');
        $('#widgetStatus').text(isExpanded ? 'Reference expanded' : 'Reference collapsed');
        if (!isExpanded && typeof clearReferenceTableScrollTabStops === 'function')
        {
            clearReferenceTableScrollTabStops();
        }
    }

    function setMenuExpanded(isExpanded)
    {
        $('#menuBtn').attr('aria-expanded', isExpanded ? 'true' : 'false');
        $('#menuPanel').attr('aria-hidden', isExpanded ? 'false' : 'true');
        $('#widgetStatus').text(isExpanded ? 'Menu expanded' : 'Menu collapsed');
    }

    function isHamburgerMenuOpen()
    {
        return $('.menupatch').css('display') == 'block';
    }

    function getHamburgerFocusables()
    {
        return $('#menuBtn, #menuPanel .menuList li[tabindex]').filter(function()
        {
            return $(this).is(':visible') && $(this).attr('tabindex') !== '-1';
        });
    }

    function updateSlideControls(activeIndex)
    {
        activeIndex = Number(activeIndex);
        $('.navigation').each(function()
        {
            var idNum = Number(String($(this).attr('id') || '').replace('navigate', ''));
            var isActive = idNum === activeIndex;
            $(this).toggleClass('currentSlide', isActive);
            $(this).attr('aria-current', isActive ? 'true' : 'false');
            $(this).attr('tabindex', isActive ? '0' : '-1');
        });
    }

    var keepSlideControlFocus = false;

    function handleSlideControlKeys(ev)
    {
        var key = ev.keyCode || ev.which;
        var $dots = $('.navigation');
        var index = $dots.index(this);
        var targetIndex = -1;
        if (key === 37 || key === 38)
        {
            targetIndex = index <= 0 ? $dots.length - 1 : index - 1;
        }
        else if (key === 39 || key === 40)
        {
            targetIndex = index >= $dots.length - 1 ? 0 : index + 1;
        }
        else if (key === 36)
        {
            targetIndex = 0;
        }
        else if (key === 35)
        {
            targetIndex = $dots.length - 1;
        }
        else if (key === 13 || key === 32)
        {
            ev.preventDefault();
            keepSlideControlFocus = false;
            fnHandelNavigationEvents.call(this, { type: 'click' });
            return;
        }
        else
        {
            return;
        }
        ev.preventDefault();
        keepSlideControlFocus = true;
        fnHandelNavigationEvents.call($dots.eq(targetIndex)[0], { type: 'click' });
        $dots.eq(targetIndex).focus();
    }
    function focusSlideContent(slideIndex)
    {
        var $slide = $("#midDiv" + slideIndex);
        var $target = $('#menuBtn');
        if ($slide.length)
        {
            var $heading = $slide.find('h1, h2, h3, h4, h5, h6').first();
            $target = $heading.length ? $heading : $slide;
            if ($target.attr('tabindex') == null)
            {
                $target.attr('tabindex', '-1');
            }
        }
        var moveFocus = function()
        {
            if ($target && $target.length)
            {
                $target.focus();
            }
            if (!$target.length || document.activeElement !== $target.get(0))
            {
                $('#menuBtn').focus();
            }
        };
        moveFocus();
        window.setTimeout(moveFocus, 0);
        window.setTimeout(moveFocus, 350);
    }

    function closeHamburgerMenu(restoreFocus)
    {
        if (!isHamburgerMenuOpen())
        {
            return;
        }
        setMenuExpanded(false);
        $('.menupatch').slideUp();
        $('#menuBtn').removeClass('menuBtnSelected');
        $('#tableBtn').attr('tabindex', '0');
        if (currScreenVisible != null)
        {
            $(currScreenVisible).show();
        }
        currScreenVisible = null;
        $("#naviList").show();
        $("#naviLeft").show();
        $("#naviRight").show();
        updateSlideControls(nSlideCounter);
        if (restoreFocus)
        {
            window.setTimeout(function()
            {
                $('#menuBtn').focus();
            }, 0);
        }
    }

    function handleHamburgerMenuKeys(ev)
    {
        if (!isHamburgerMenuOpen())
        {
            return;
        }
        var isEscape = ev.key === 'Escape' || ev.key === 'Esc' || ev.keyCode === 27;
        if (isEscape)
        {
            ev.preventDefault();
            ev.stopPropagation();
            closeHamburgerMenu(true);
            return;
        }
        if (ev.key === 'Tab' || ev.keyCode === 9)
        {
            var $focusable = getHamburgerFocusables();
            if (!$focusable.length)
            {
                return;
            }
            var first = $focusable.get(0);
            var last = $focusable.get($focusable.length - 1);
            var active = document.activeElement;
            if (ev.shiftKey)
            {
                if (active === first || $focusable.index(active) === -1)
                {
                    ev.preventDefault();
                    last.focus();
                }
            }
            else if (active === last || $focusable.index(active) === -1)
            {
                ev.preventDefault();
                first.focus();
            }
        }
    }
    function menuBtnFn(ev, nSlideCounter)
    {
        if (ev.type == "keyup" && ev.keyCode != 13)
        {
            navigateMenuItems(ev);
            return true;
        }
        resetCheckboxes();
        /* $('.navigation').each(function()
        {
            $(this).removeClass('currentSlide');
        }); */
        if ($('.tablepatch').css('display') == 'block')
        {
            resetScrrenObjectsVisibility();
            $('.tablepatch').hide();
            setReferenceExpanded(false);
        }
        $('#tableBtn').removeClass('tableBtnSelected');
        if (isHamburgerMenuOpen())
        {
            closeHamburgerMenu(false);
        }
        else
        {
            $('.midDiv').each(function()
            {
                if ($(this).is(':visible'))
                {
                    currScreenVisible = $(this);
                    return;
                }
            });
            var currScreenNum = $(currScreenVisible).attr('id').match(/\d+/)[0];
            $('#menu' + currScreenNum).addClass("selectedMenu");
            //currScreenVisible = $('.midDiv:visible');
            setMenuExpanded(true);
            $('.menupatch').css("z-index", "13");
            $('#menuBtn').addClass('menuBtnSelected');
            $('#tableBtn').removeAttr('tabindex');
            $('.menupatch').slideDown(
            {
                complete: function()
                {
                    $(currScreenVisible).hide();
                    $("#naviList").hide();
                    $("#naviLeft").hide();
                    $("#naviRight").hide();
                    $('#menu0').focus();
                }
            });
        }
    }

    function resetScrrenObjectsVisibility()
    {
        if (currScreenVisible != null)
            $(currScreenVisible).show();
        if (currScreenVisible1 != null)
            $(currScreenVisible1).show();
        $("#naviList").show();
        $("#naviLeft").show();
        $("#naviRight").show();
        updateSlideControls(nSlideCounter);
    }
    var currScreenVisible1 = null;

    function tableBtnFn(ev)
    {
        if (ev.type == "keyup" && ev.keyCode != 13)
        {
            return true;
        }
        $('.navigation').each(function()
        {
            $(this).removeClass('currentSlide');
        });
        if ($('.menupatch').css('display') == 'block')
        {
            resetScrrenObjectsVisibility();
            $('.menupatch').hide();
            setMenuExpanded(false);
            $('#menuBtn').removeClass('menuBtnSelected');
        }
        $('#tableBtn').removeClass('tableBtnSelected');
        if ($('.tablepatch').css('display') != 'none')
        {
            setReferenceExpanded(false);
            $('.tablepatch').slideUp();
            $('#tableBtn').removeClass('tableBtnSelected');
            if (currScreenVisible1 != null)
                $(currScreenVisible1).show();
            currScreenVisible1 = null;
            $("#naviList").show();
            $("#naviLeft").show();
            $("#naviRight").show();
            updateSlideControls(nSlideCounter);
        }
        else
        {
            $('.midDiv').each(function()
            {
                if ($(this).is(':visible'))
                {
                    currScreenVisible1 = $(this);
                    return;
                }
            });
            var currScreenNum = $(currScreenVisible1).attr('id').match(/\d+/)[0];
            $('#menu' + currScreenNum).addClass("selectedMenu");
            setReferenceExpanded(true);
            $('.tablepatch').css("z-index", "13");
            $('#tableBtn').addClass('tableBtnSelected');
            $('.tablepatch').slideDown(
            {
                complete: function()
                {
                    $(currScreenVisible1).hide();
                    $("#naviList").hide();
                    $("#naviLeft").hide();
                    $("#naviRight").hide();
                    if (typeof syncReferenceTableScrollAccess === 'function')
                    {
                        syncReferenceTableScrollAccess(null, true);
                    }
                }
            });
        }
        if ($('.menupatch').css('display') == 'block')
        {
            setMenuExpanded(false);
            $('#menuBtn').removeClass('menuBtnSelected');
        }
    }

    function init()
    {
        createDropDownLists();
        createAnchorLink();
        createHotSpots();
        createThumbnails();
        $("#pageContainer > div").each(function()
        {
            $(this).css('display', 'none')
            aSlidesArray.push($(this))
            nCount++;
        });
        footerLi += '<ul>';
        for (var i = 0; i < nCount; i++)
        {
            var isFirst = (i === 0);
            footerLi += '<li><span id="navigate' + i + '" class="navigation" role="button" tabindex="' + (isFirst ? '0' : '-1') + '" aria-label="Slide ' + (i + 1) + ' of ' + nCount + '" aria-current="' + (isFirst ? 'true' : 'false') + '"></span></li>';
        }
        footerLi += '</ul>';
        $("#naviList").append(footerLi);
        $("#navigate0").css(
        {
            //background: "#015453 no-repeat"
        });
        updateSlideControls(0);
        aSlidesArray[nSlideCounter].css(
        {
            'display': 'block',
            'z-index': '2'
        });
        fnCheckNextBack(nSlideCounter)
    }

    function createHotSpots()
    {
        $(".hs").each(function(index)
        {
            $(this).bind("click keyup tap", onHsSelect);
        });
    }

    function createThumbnails()
    {
        $(".imageThumbHolder .thumbnail").each(function(index)
        {
            $(this).bind("click keyup", onThumbnailSelect);
        });
    }
    
    function createAnchorLink()
    {
        $(".al").each(function(index)
        {
            $(this).bind("click tap", onAlSelect);
        });
    }

    function onAlSelect(e)
    {
        window.open($(this).attr("data-url"),"_blank");
    }

    function onHsSelect(e)
    {

        if (e.type == "keyup" && e.keyCode != 13)
            {
            return true;
            }

        addPolite();
        var mainDiv = $(e.target).closest(".midDiv");
        mainDiv.find('.containerImg').hide();
        mainDiv.find(".dropdownList li").removeClass("selected").attr("aria-selected", "false");        
        var listItemId = $(e.target).attr("data-id");
        var dropDownId = $(e.target).attr("data-dropdownid");
        mainDiv.find('.imageBoxHolder').hide();
        mainDiv.find('.imageThumbHolder .thumbnail').removeClass("thumbnail_active");       
        $(mainDiv.find('.imageThumbHolder .thumbnail')[dropDownId-1]).addClass("thumbnail_active");
        var mainHsDiv = mainDiv.find('.hs_set' + dropDownId);
        mainHsDiv.css("display","flex");
        mainHsDiv.find('.imageShow' + listItemId).show();
        $(mainHsDiv.find(".dropdownList li")[listItemId]).addClass("selected").attr("aria-selected", "true");
        mainHsDiv.find(".dropdownList").find('.current').text($(mainHsDiv.find(".dropdownList li")[listItemId]).text());      
        setTimeout(function(){
            ActivityMain.setHabitatContainerSize();
        },500);
    }

    function onThumbnailSelect(e)
    {
        if (e.type == "keyup" && e.keyCode != 13)
        {
            return true;
        }
        addPolite();
        var mainDiv = $(e.currentTarget).closest(".midDiv");
        mainDiv.find('.containerImg').hide();
        mainDiv.find(".dropdownList li").removeClass("selected").attr("aria-selected", "false");        
        var listItemId = $(e.currentTarget).attr("data-id");
        var dropDownId = $(e.currentTarget).attr("data-dropdownid");
        mainDiv.find('.imageBoxHolder').hide();
        mainDiv.find('.imageThumbHolder .thumbnail').removeClass("thumbnail_active");       
        $(e.currentTarget).addClass("thumbnail_active");
        var mainHsDiv = mainDiv.find('.hs_set' + dropDownId);
        mainHsDiv.css("display","flex");
        mainHsDiv.find('.imageShow' + listItemId).show();
        $(mainHsDiv.find(".dropdownList li")[listItemId]).addClass("selected").attr("aria-selected", "true");
        mainHsDiv.find(".dropdownList").find('.current').text($(mainHsDiv.find(".dropdownList li")[listItemId]).text());      
        setTimeout(function(){
            ActivityMain.setHabitatContainerSize();
        },500);  
    }

        function createDropDownLists()
    {
        $(".dropdownListBox").each(function(index)
        {
            var $box = $(this);
            var listboxId = "image-listbox-" + index;
            $box.append('<span class="current">' + $($box.find("li")[0]).text() + '</span>');
            $box.append('<div class="list"><ul id="' + listboxId + '" role="listbox" class="hidden"></ul></div>');
            $($box.find("li")[0]).addClass("selected");
            $box.find("li").each(function(liIndex)
            {
                $(this).addClass("option");
                $(this).attr("data-value", $(this).text());
                $(this).attr("data-id", liIndex);
                $(this).attr("role", "option");
                $(this).attr("id", "image-option-" + index + "-" + liIndex);
                $(this).attr("aria-selected", liIndex === 0 ? "true" : "false");
                $(this).removeAttr("tabindex");
                $(this).appendTo($box.find(".list ul"));
                $(this).bind("click tap", onListSelect);
            });
            $box.attr({
                "tabindex": "0",
                "role": "combobox",
                "aria-autocomplete": "none",
                "aria-expanded": "false",
                "aria-haspopup": "listbox",
                "aria-controls": listboxId,
                "aria-label": "Select image view"
            });
            $box.removeClass("dropdownListBox").addClass("dropdownList dropdown");
        });
    }



    function onListSelect(e)
    {
        addPolite();
        var mainDiv = $(e.target).closest(".imageBoxHolder");
        mainDiv.find('.containerImg').hide();
        listItemId = $(e.target).attr("data-id");
        mainDiv.find('.imageShow' + listItemId).show();
        setTimeout(function(){            
            ActivityMain.setHabitatContainerSize();
        },500);        
    }

    function fnCheckNextBack(nSlideCounter)
    {
        
        $('.navigation').removeClass('currentSlide');
        $('.menuList li').removeClass('selectedMenu');
        /* $('.midDiv').focus();
        console.log("$('.midDiv').focus();"); */
        updateSlideControls(nSlideCounter);
        // hide answer div
        $('.imageBoxHolder').hide();
        $('.imageThumbHolder').hide();

        var mainDiv = $("#midDiv"+ nSlideCounter);
        //console.log(!mainDiv.find(".imageBoxHolder").hasClass("imageBoxHolder2"))
        if(!mainDiv.find(".imageBoxHolder").hasClass("imageBoxHolder2")){
            mainDiv.find(".hs_set1").css("display","flex");
            mainDiv.find(".imageThumbHolder").css("display","flex");
           
        }  
        mainDiv.find(".imageThumbHolder .thumbnail").removeClass("thumbnail_active");       
        $(mainDiv.find(".imageThumbHolder .thumbnail")[0]).addClass("thumbnail_active");      
        mainDiv.find(".dropdownList li").removeClass("selected").attr("aria-selected", "false");       
        $(mainDiv.find(".dropdownList li")[0]).addClass("selected").attr("aria-selected", "true");
        mainDiv.find(".dropdownList").find('.current').text($(mainDiv.find(".dropdownList li")[0]).text());   

        $('.AnswerDiv').text('Show Answer');
        $('.AnswerDiv').attr('aria-expanded','false');
        $('.AnswerDiv').removeAttr('aria-pressed');
        $('.textArea').attr('aria-hidden', 'true').hide();
        if (nSlideCounter < 0)
        {
            $(".topContent").hide();
            $(".footer").hide();
            $(".beginBtn").bind("click", fnBegin);   
        }
        else if (nSlideCounter == 0)
        {
            DisableLeftArrow();
            EnableRightArrow();
            //$('#naviRight').focus();
        }
        else if (nSlideCounter == aSlidesArray.length - 1)
        {
            EnableLeftArrow();
            DisableRightArrow();
            //$('#naviLeft').focus();
        }
        else
        {
            EnableLeftArrow();
            EnableRightArrow();
        }
        ActivityMain.setHabitatContainerSize();        
    }

    function fnBack(ev)
    {
        if (ev.type == "keyup" && ev.keyCode != 13)
        {
            return true;
        }
        if ($(this).hasClass('leftArrowDisable'))
        {
            return false;
        }
        /* setTimeout(function()
        {
            $(".nano").nanoScroller();
            $(".nano-pane").show();
        }, 100) */
        removePolite();
        resetCheckboxes();
        $('.sliderdot').css('left', '0');
        $('.cont,.pause').removeClass("pause").addClass("cont").addClass("play");
        if (nSlideCounter > 0)
        {
            nSlideCounter--;
            $(".midDiv").hide();
            $("#midDiv" + nSlideCounter).show("slide",
            {
                direction: "left"
                
            }, 300, callback);
            /* $(".navigation").css(
            {
                background: "#fff no-repeat"
            }); */
            /* $("#navigate" + nSlideCounter).css(
            {
                background: "#015453 no-repeat"
            }); */
        }
        else
        {
            $(".topContent").hide();
            $(".footer").hide();
            $(".beginPage").show();
            $(".beginBtn").bind("click", fnBegin);
        }
        fnCheckNextBack(nSlideCounter);
    }
    
    function fnNext(ev)
    {
        if (ev.type == "keyup" && ev.keyCode != 13)
        {
            return true;
        }
        removePolite();
        resetCheckboxes();
        var indexD = 1;
        $('.midText').prop('scrollHeight', "427");
        /*setTimeout(function()
         {
            $(".nano").nanoScroller();
            $(".nano-pane").show();
        }, 100) */
        $('.sliderdot').css('left', '0');
        $('.cont,.pause').removeClass("pause").addClass("cont").addClass("play");
        if (nSlideCounter < (nCount - 1))
        {
            nSlideCounter++;
            EnableRightArrow();
            $(".midDiv").hide();
            $("#midDiv" + nSlideCounter).css("visibility", "visible")
            $("#midDiv" + nSlideCounter).show("slide",
            {
                direction: "right"
            }, 300, callback);
            /* $(".navigation").css(
            {
                background: "#fff no-repeat"
            }); */
            /* $("#navigate" + nSlideCounter).css(
            {
                background: "#015453 no-repeat"
            }); */
        }
        else
        {
            DisableRightArrow();
        }
        fnCheckNextBack(nSlideCounter);
    }
    
    function callback() {
        if (keepSlideControlFocus)
        {
            keepSlideControlFocus = false;
            $('#navigate' + nSlideCounter).focus();
        }
        else
        {
            focusSlideContent(nSlideCounter);
        }
        ActivityMain.setHabitatContainerSize();
    };
    function fnAddScrollMain()
    {
        var myScroll = new IScroll('.midText',
        {
            scrollbars: true,
            mouseWheel: true,
            interactiveScrollbars: true,
            shrinkScrollbars: 'scale',
            fadeScrollbars: true,
            click: true
        });
    }

    function navigateMenuItems(event){
        var $items = $('.menuList li');
        var $focused = $($(".menuList li:focus")[0] || $(".menuList .selectedMenu")[0]);
        var index = $items.index($focused);

        if (event.keyCode == 40)
        {
            event.preventDefault();
            $items.eq((index + 1) % $items.length).focus();
        }
        else if (event.keyCode == 38)
        {
            event.preventDefault();
            $items.eq((index - 1 + $items.length) % $items.length).focus();
        }
    }

    function fnHandelNavMenu(ev)
    {
        if (ev.type == "keyup" && ev.keyCode != 13)
        {
            
            navigateMenuItems(ev)
            return true;
        }
        setTimeout(function()
        {
            $(".nano").nanoScroller({ tabIndex: -1 });
            $(".nano-pane").show();
            if ($('#tableBtn').attr('aria-expanded') === 'true' && typeof syncReferenceTableScrollAccess === 'function')
            {
                syncReferenceTableScrollAccess(null, false);
            }
            else if (typeof clearReferenceTableScrollTabStops === 'function')
            {
                clearReferenceTableScrollTabStops();
            }
        }, 100);

        $('.navigation').removeClass('currentSlide');
        var navigateId = $(this).attr("id");
        var navIdNo = navigateId.match(/\d+/)[0];
        //$('#navigate' + navIdNo).css('background', '#015453');
        updateSlideControls(navIdNo);
        $("#midDiv" + navIdNo).css("visibility", "visible");
        nSlideCounter = navIdNo;
        $(".midDiv").hide();
        $("#midDiv" + navIdNo).show("slide",
        {
            direction: "right"
        }, 300, callback);
        if (nSlideCounter == 0)
        {
            DisableLeftArrow();
            EnableRightArrow();
        }
        else if (nSlideCounter == nCount - 1)
        {
            DisableRightArrow();
            EnableLeftArrow();
        }
        else
        {
            EnableLeftArrow();
            EnableRightArrow();
        }
        $('.menuList li').each(function(index)
        {
            $(this).removeClass('selectedMenu');
        });
        $(this).addClass('selectedMenu');
        currScreenVisible = null;
        focusSlideContent(nSlideCounter);
        menuBtnFn(ev, nSlideCounter);

        fnCheckNextBack(nSlideCounter);
        /* var mainDiv = $("#midDiv"+ nSlideCounter);
        mainDiv.find(".dropdownList li").removeClass("selected").attr("aria-selected", "false");       
        $(mainDiv.find(".dropdownList li")[0]).addClass("selected").attr("aria-selected", "true");
        mainDiv.find(".dropdownList").find('.current').text($(mainDiv.find(".dropdownList li")[0]).text()); */
        ActivityMain.setHabitatContainerSize();
    }

    function fnHandelNavigationEvents(ev)
    {
        if (ev.type == "keyup" && ev.keyCode != 13)
        {
            return true;
        }
        /* setTimeout(function()
        {
            $(".nano").nanoScroller();
            $(".nano-pane").show();
        }, 100) */
        resetCheckboxes();
        /* $(".navigation").css(
        {
            background: "#fff no-repeat"
        }); */
        var navigateId = $(this).attr("id");
        var navIdNo = navigateId.match(/\d+/)[0];
        //$('#navigate' + navIdNo).css('background', '#015453');
        $("#midDiv" + navIdNo).css("visibility", "visible");
        nSlideCounter = navIdNo;
        /* $("#" + navigateId).css(
        {
            //background: "#015453 no-repeat"
        }); */
        $(".midDiv").hide();
        $("#midDiv" + navIdNo).show("slide",
        {
            direction: "right"
        }, 300, callback);

        if (nSlideCounter == 0)
        {
            DisableLeftArrow();
            EnableRightArrow();
        }
        else if (nSlideCounter == nCount - 1)
        {
            DisableRightArrow();
            EnableLeftArrow();
        }
        else
        {
            EnableLeftArrow();
            EnableRightArrow();
        }
        fnCheckNextBack(nSlideCounter);
    }

    function EnableLeftArrow()
    {
        $("#naviLeft").removeClass("leftArrowDisable").addClass("leftArrowEnable").css(
        {
            "pointer-event": "auto",
            "cursor": "pointer"
        }).removeAttr('disabled').attr('tabindex','0').removeAttr('aria-hidden');
        $('#naviLeft').show();
    }

    function DisableLeftArrow()
    {
        $("#naviLeft").removeClass("leftArrowEnable").addClass("leftArrowDisable").css(
        {
            "pointer-event": "none",
            "cursor": "default"
        }).attr('disabled','disabled').attr('tabindex','-1').attr('aria-hidden','true');
        $('#naviLeft').hide();
    }

    function EnableRightArrow()
    {
        $("#naviRight").removeClass("rightArrowDisable").addClass("rightArrowEnable").css(
        {
            "pointer-event": "auto",
            "cursor": "pointer"
        }).removeAttr('disabled').attr('tabindex','0').removeAttr('aria-hidden');
        $('#naviRight').show();
    }

    function DisableRightArrow()
    {
        $("#naviRight").removeClass("rightArrowEnable").addClass("rightArrowDisable").css(
        {
            "pointer-event": "none",
            "cursor": "default"
        }).attr('disabled','disabled').attr('tabindex','-1').attr('aria-hidden','true');
        $('#naviRight').hide();
    }

    function fnBegin()
    {
        $(".beginPage").hide();
        $(".topContent").show();
        $(".footer").show();
    }

    ActivityMain.setHabitatContainerSize = function(){
        var midConatinerHeight = $("#midConatiner").outerHeight();
        console.log("setHabitatContainerSize> ",midConatinerHeight);
        s9.view.size({"height": midConatinerHeight+10});
    }
    function removePolite(){
        $(".graphContainer").removeAttr("aria-live");
    }

    function addPolite(){
        $(".graphContainer").attr("aria-live","polite");
    }

})(ActivityMain = ActivityMain ||
{})
var ActivityMain