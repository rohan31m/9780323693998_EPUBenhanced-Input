function getVisibleReferenceTableId()
{
    var $visible = $('.tablepatch .testContainer:visible').first();
    if (!$visible.length)
    {
        $visible = $('#testListId0');
    }
    var id = $visible.attr('id') || 'testListId0';
    var match = String(id).match(/(\d+)$/);
    return match ? match[1] : '0';
}

function clearReferenceTableScrollTabStops()
{
    $('.tablepatch table.testsList').each(function()
    {
        $(this).removeAttr('tabindex').removeAttr('role').removeAttr('aria-label').removeAttr('aria-labelledby');
        this.style.top = '';
        this.style.position = '';
        this.removeAttribute('data-y');
    });
    $('.tablepatch .nano-content').removeAttr('tabindex').removeAttr('role').removeAttr('aria-label').removeAttr('aria-labelledby');
    $('.tablepatch .nano').removeClass('is-scrollable is-not-scrollable');
    $('.tablepatch .nano-pane').hide();
}

function getReferenceTableHeading(dataId)
{
    dataId = (dataId == null || dataId === '') ? '0' : String(dataId);
    var $content = $('#addTable' + dataId);
    var $heading = $('#referenceTableHeading' + dataId);
    if (!$heading.length)
    {
        $heading = $content.find('tr.titleTest').children('td, th').first();
        if ($heading.length)
        {
            $heading.attr('id', 'referenceTableHeading' + dataId);
        }
    }
    if ($heading.length)
    {
        $heading.attr('tabindex', '-1');
    }
    return $heading;
}

function applyReferenceTableTabStop(dataId, needsScroll)
{
    dataId = (dataId == null || dataId === '') ? '0' : String(dataId);
    var $content = $('#addTable' + dataId);
    var $table = $content.find('table.testsList').first();
    getReferenceTableHeading(dataId);
    $table.removeAttr('tabindex').removeAttr('role').removeAttr('aria-label').removeAttr('aria-labelledby');
    $content.removeAttr('aria-label').removeAttr('aria-labelledby').removeAttr('role');
    if (needsScroll)
    {
        $content.attr('tabindex', '0');
        if ($content[0])
        {
            $content[0].tabIndex = 0;
        }
    }
    else
    {
        $content.removeAttr('tabindex');
        if ($content[0])
        {
            $content[0].removeAttribute('tabIndex');
        }
    }
    return $content;
}

function focusReferenceTableRegion(dataId)
{
    dataId = (dataId == null || dataId === '') ? '0' : String(dataId);
    var $target = $('#addTable' + dataId);
    if ($target.length && $target.attr('tabindex') === '0')
    {
        $target.focus();
    }
}

function isReferenceTableKeyTarget(el)
{
    if (!el || !el.nodeType)
    {
        return false;
    }
    var $el = $(el);
    if ($el.closest('.tablepatch .dropdown').length)
    {
        return false;
    }
    return !!(el.id === 'addTable0' || $el.closest('#addTable0').length);
}

function scrollVisibleReferenceTable(delta)
{
    var $container = $('#testListId0');
    var el = document.getElementById('addTable0');
    if (!el)
    {
        return false;
    }
    var table = el.getElementsByTagName('table')[0];
    var nativeMax = el.scrollHeight - el.clientHeight;
    if (nativeMax > 1)
    {
        el.scrollTop = Math.max(0, Math.min(nativeMax, el.scrollTop + delta));
        if ($container[0] && $container[0].nanoscroller)
        {
            $container.nanoScroller();
        }
        return true;
    }
    if (!table)
    {
        return false;
    }
    var viewH = $container.height() || el.clientHeight || 342;
    var max = Math.max(0, table.offsetHeight - viewH + 24);
    if (max <= 0)
    {
        return false;
    }
    var current = parseInt(table.getAttribute('data-y') || '0', 10);
    current = Math.max(0, Math.min(max, current + delta));
    table.setAttribute('data-y', String(current));
    table.style.position = 'relative';
    table.style.top = (-current) + 'px';
    if ($container[0] && $container[0].nanoscroller)
    {
        $container.nanoScroller();
    }
    return true;
}

function syncReferenceTableScrollAccess(dataId, moveFocus)
{
    if (dataId == null || dataId === '')
    {
        dataId = getVisibleReferenceTableId();
    }
    clearReferenceTableScrollTabStops();

    var $container = $('#testListId' + dataId);
    var $content = $('#addTable' + dataId);
    if (!$container.length || !$content.length)
    {
        return;
    }

    window.setTimeout(function()
    {
        var $table = $content.find('table.testsList').first();
        var tableHeight = $table.length ? $table.outerHeight() : 0;
        var boxHeight = $container.height() || 342;
        var needsScroll = $container.is(':visible') && tableHeight > (boxHeight - 8);
        if (needsScroll)
        {
            $container.removeClass('is-not-scrollable').addClass('is-scrollable');
            $content.css({
                'overflow-y': 'auto',
                'overflow-x': 'hidden',
                '-webkit-overflow-scrolling': 'touch'
            });
            $content[0].scrollTop = 0;
            $container.nanoScroller();
            $container.children('.nano-pane').show();
        }
        else
        {
            $container.removeClass('is-scrollable').addClass('is-not-scrollable');
            $content.css({
                'overflow-y': '',
                'overflow-x': '',
                '-webkit-overflow-scrolling': ''
            });
            $container.children('.nano-pane').hide();
        }
        applyReferenceTableTabStop(dataId, needsScroll);
        if (moveFocus && needsScroll)
        {
            focusReferenceTableRegion(dataId);
        }
    }, 150);
}

var referenceTableData = [];

function showReferenceTableByIndex(index, moveFocus)
{
    index = parseInt(index, 10);
    if (isNaN(index) || index < 0 || !referenceTableData[index])
    {
        return;
    }
    var html = buildReferenceTable(referenceTableData[index], 0) + '<br/><br/><br/><div id="scroller"></div>';
    $('#addTable0').empty().append(html);
    $('.tablepatch .testContainer').not('#testListId0').hide();
    $('#testListId0').show();
    $('#referenceTableHeading0').attr('tabindex', '-1');
    syncReferenceTableScrollAccess('0', !!moveFocus);
}

function refText(html)
{
    return $.trim($('<div/>').html(html == null ? '' : String(html)).text());
}

function refEmpty(html)
{
    return refText(html) === '';
}

function refIsSectionRow(row)
{
    return !refEmpty(row.col_first) && refEmpty(row.col_second) && refEmpty(row.col_third);
}

function refCellHtml(html)
{
    if (html == null || String(html) === '')
    {
        return '&#160;';
    }
    return '<span>' + html + '</span>';
}

function buildReferenceTable(rows, tableIndex)
{
    var prefix = 'ref-t' + tableIndex;
    var colTest = prefix + '-test';
    var colComp = prefix + '-comp';
    var colRange = prefix + '-range';
    var sectionTitle = rows.length ? refText(rows[0].col_first) : 'Reference values';
    var html = '<table class="testsList">';
    html += '<caption class="visually-hidden">Normal Reference Range Table: ' + sectionTitle + '</caption>';
    html += '<thead><tr>';
    html += '<th scope="col" id="' + colTest + '">Test</th>';
    html += '<th scope="col" id="' + colComp + '">Component</th>';
    html += '<th scope="col" id="' + colRange + '">Reference range</th>';
    html += '</tr></thead>';

    var lastTestId = '';
    var tbodyOpen = false;
    var i;
    for (i = 0; i < rows.length; i++)
    {
        var row = rows[i];
        var first = row.col_first == null ? '' : String(row.col_first);
        var second = row.col_second == null ? '' : String(row.col_second);
        var third = row.col_third == null ? '' : String(row.col_third);

        if (refIsSectionRow(row))
        {
            if (tbodyOpen)
            {
                html += '</tbody>';
            }
            html += '<tbody>';
            tbodyOpen = true;
            lastTestId = '';
            var sectionClass = (i === 0) ? 'titleTest' : 'sectionHead';
            var headingId = (i === 0) ? ('referenceTableHeading' + tableIndex) : (prefix + '-sec-' + i);
            html += '<tr class="' + sectionClass + '">';
            html += '<th colspan="3" scope="rowgroup" id="' + headingId + '">' + first + '</th>';
            html += '</tr>';
            continue;
        }

        if (!tbodyOpen)
        {
            html += '<tbody>';
            tbodyOpen = true;
        }

        html += '<tr class="emptyLine">';
        if (!refEmpty(first))
        {
            lastTestId = prefix + '-row-' + i;
            html += '<th scope="row" id="' + lastTestId + '" headers="' + colTest + '">' + refCellHtml(first) + '</th>';
        }
        else
        {
            html += '<td headers="' + colTest + (lastTestId ? (' ' + lastTestId) : '') + '">' + refCellHtml(first) + '</td>';
        }
        html += '<td headers="' + colComp + (lastTestId ? (' ' + lastTestId) : '') + '">' + refCellHtml(second) + '</td>';
        html += '<td headers="' + colRange + (lastTestId ? (' ' + lastTestId) : '') + '">' + refCellHtml(third) + '</td>';
        html += '</tr>';
    }

    if (tbodyOpen)
    {
        html += '</tbody>';
    }
    html += '</table>';
    return html;
}

$(document).ready(function()
{
    var tableRows1 = "";
    var tableRows2 = "";
    var tableRows3 = "";
    var tableRows4 = "";
    var tableRows5 = "";
    var tableRows6 = "";
    var tableRows7 = "";
    var tableRows8 = "";
    var tableRows9 = "";
    var quesRows = '';
    var quesList = '';
    var dropdownOptions = '';
    var dropdownSelect = '';
    var brLine = '<br/><br/><br/><div id="scroller"></div>'
    var quesList = testCasesdata[0].quesRow; // get dropdown list
    var tableData1 = testCasesdata[0].caseData1; // get case study
    var tableData2 = testCasesdata[0].caseData2; // get case study
    var tableData3 = testCasesdata[0].caseData3; // get case study
    var tableData4 = testCasesdata[0].caseData4; // get case study
    var tableData5 = testCasesdata[0].caseData5; // get case study
    var tableData6 = testCasesdata[0].caseData6; // get case study
    var tableData7 = testCasesdata[0].caseData7; // get case study
    var tableData8 = testCasesdata[0].caseData8; // get case study
    var tableData9 = testCasesdata[0].caseData9; // get case study
    // drop down
    dropdownSelect = '<select id="dropdown_1" class="dropdownList tabindex noIndx">'
    for (var j = 0; j < quesList[0].quesDropOptions.length; j++)
    {
        var disabledSel = "disabled";
        dropdownOptions += '<option class="tabindex" data-index="' + j + '"' + ' value="' + quesList[0].quesDropOptions[j] + '">' + quesList[0].quesDropOptions[j] + '</option>';
    }
    dropdownSelect = dropdownSelect + dropdownOptions;
    dropdownSelect = dropdownSelect + '</select>';
    // add DROPDOWN end-------------------------------------------------------------	
    referenceTableData = [tableData1, tableData2, tableData3, tableData4, tableData5, tableData6, tableData7, tableData8, tableData9];
    $('#tableDropdownID').append(dropdownSelect);
    showReferenceTableByIndex(0, false);
    create_custom_dropdowns();
    $('#dropdown_1').attr({'aria-hidden': 'true', 'tabindex': '-1'}).hide();
    $('.tablepatch .list li').each(function(index)
    {
        $(this).attr('data-id', index);
    });
    $('#dropdown_1').on('change', function()
    {
        showReferenceTableByIndex(this.selectedIndex, true);
    });
    $(document).on('mousedown', '.tablepatch .dropdown .option', function()
    {
        var data_id = $(this).attr('data-id');
        if (data_id == null || data_id === '')
        {
            data_id = $(this).index();
        }
        $('#dropdown_1').prop('selectedIndex', data_id).trigger('change');
    });
    document.addEventListener('keydown', function(ev)
    {
        if (!$('.tablepatch').is(':visible'))
        {
            return;
        }
        var code = ev.keyCode;
        var key = ev.key || '';
        var $active = $(document.activeElement);
        if ($active.is('#tableBtn'))
        {
            if (code === 40 || key === 'ArrowDown' || code === 39 || key === 'ArrowRight')
            {
                var $combo = $('.tablepatch [role="combobox"]').first();
                ev.preventDefault();
                if ($combo.length)
                {
                    $combo.focus();
                }
                else
                {
                    var $panel = $('#addTable0');
                    if ($panel.attr('tabindex') === '0')
                    {
                        $panel.focus();
                    }
                }
            }
            return;
        }
        if ($active.closest('.tablepatch .dropdown').length)
        {
            if ((code === 9 || key === 'Tab') && !ev.shiftKey)
            {
                var $panel = $('#addTable0');
                if ($panel.attr('tabindex') === '0')
                {
                    ev.preventDefault();
                    $panel.focus();
                }
            }
            return;
        }
        if (!isReferenceTableKeyTarget(document.activeElement))
        {
            return;
        }
        var $scroller = $('#addTable0');
        var page = ($scroller[0] && $scroller[0].clientHeight) ? $scroller[0].clientHeight - 24 : 120;
        if (code === 38 || key === 'ArrowUp')
        {
            ev.preventDefault();
            ev.stopPropagation();
            scrollVisibleReferenceTable(-40);
        }
        else if (code === 40 || key === 'ArrowDown')
        {
            ev.preventDefault();
            ev.stopPropagation();
            scrollVisibleReferenceTable(40);
        }
        else if (code === 33 || key === 'PageUp')
        {
            ev.preventDefault();
            scrollVisibleReferenceTable(-page);
        }
        else if (code === 34 || key === 'PageDown')
        {
            ev.preventDefault();
            scrollVisibleReferenceTable(page);
        }
        else if (code === 36 || key === 'Home')
        {
            ev.preventDefault();
            scrollVisibleReferenceTable(-99999);
        }
        else if (code === 35 || key === 'End')
        {
            ev.preventDefault();
            scrollVisibleReferenceTable(99999);
        }
    }, true);
    $('#addTable5  .nano-pane').css("display", "none !important");
    // $("#addTable2").append(tableRows);
    for (var i = 0; i <= 8; i++)
    {
        $('#referenceTableHeading' + i).attr('tabindex', '-1');
    }
});