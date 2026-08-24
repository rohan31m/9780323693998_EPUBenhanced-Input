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
    $('.tablepatch .nano-content').each(function()
    {
        $(this).removeAttr('tabindex').removeAttr('role').removeAttr('aria-label').removeAttr('aria-labelledby');
    });
    $('.tablepatch .nano').removeClass('is-scrollable is-not-scrollable');
    $('.tablepatch .nano-pane').hide();
}

function focusReferenceTableHeading(dataId)
{
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
    if ($content.closest('.nano').hasClass('is-not-scrollable'))
    {
        $content.attr('tabindex', '-1');
        $content.focus();
        return;
    }
    if ($heading.length)
    {
        $heading.focus();
    }
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
    var $table = $content.find('table.testsList').first();
    if (!$container.length || !$content.length)
    {
        return;
    }

    var tableHeight = $table.length ? $table.outerHeight() : 0;
    var needsScroll = $container.is(':visible') && $container.height() > 0 && tableHeight > $container.height();
    var headingText = $.trim($('#referenceTableHeading' + dataId).text()) || 'Reference table';
    var headingId = 'referenceTableHeading' + dataId;
    if (needsScroll)
    {
        $container.addClass('is-scrollable');
        $container.nanoScroller({ tabIndex: -1 });
        $container.children('.nano-pane').show();
        $content.attr({
            'tabindex': '0',
            'role': 'region',
            'aria-label': headingText + ', scrollable'
        });
    }
    else
    {
        $container.addClass('is-not-scrollable');
        $content.attr({
            'tabindex': '-1',
            'role': 'region',
            'aria-labelledby': $('#' + headingId).length ? headingId : 'referenceTableTitle'
        });
    }

    if (moveFocus)
    {
        focusReferenceTableHeading(dataId);
    }
}

var referenceTableData = [];

function showReferenceTableByIndex(index)
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
    syncReferenceTableScrollAccess('0', false);
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
    html += '</tr></thead><tbody>';

    var lastTestId = '';
    var sectionId = prefix + '-sec-0';
    var i;
    for (i = 0; i < rows.length; i++)
    {
        var row = rows[i];
        var first = row.col_first == null ? '' : String(row.col_first);
        var second = row.col_second == null ? '' : String(row.col_second);
        var third = row.col_third == null ? '' : String(row.col_third);

        if (refIsSectionRow(row))
        {
            sectionId = prefix + '-sec-' + i;
            lastTestId = '';
            var sectionClass = (i === 0) ? 'titleTest' : 'sectionHead';
            var headingId = (i === 0) ? ('referenceTableHeading' + tableIndex) : sectionId;
            html += '<tr class="' + sectionClass + '">';
            html += '<th colspan="3" scope="colgroup" id="' + headingId + '">' + first + '</th>';
            html += '</tr>';
            continue;
        }

        html += '<tr class="emptyLine">';
        if (!refEmpty(first))
        {
            lastTestId = prefix + '-row-' + i;
            html += '<th scope="row" id="' + lastTestId + '" headers="' + colTest + ' ' + sectionId + '">' + refCellHtml(first) + '</th>';
        }
        else
        {
            html += '<td headers="' + colTest + ' ' + sectionId + (lastTestId ? (' ' + lastTestId) : '') + '">' + refCellHtml(first) + '</td>';
        }
        html += '<td headers="' + colComp + ' ' + sectionId + (lastTestId ? (' ' + lastTestId) : '') + '">' + refCellHtml(second) + '</td>';
        html += '<td headers="' + colRange + ' ' + sectionId + (lastTestId ? (' ' + lastTestId) : '') + '">' + refCellHtml(third) + '</td>';
        html += '</tr>';
    }

    html += '</tbody></table>';
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
    showReferenceTableByIndex(0);
    create_custom_dropdowns();
    $('#dropdown_1').attr({'aria-hidden': 'true', 'tabindex': '-1'}).hide();
    $('.tablepatch .list li').each(function(index)
    {
        $(this).attr('data-id', index);
    });
    $('#dropdown_1').on('change', function()
    {
        showReferenceTableByIndex(this.selectedIndex);
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
    $('#addTable5  .nano-pane').css("display", "none !important");
    // $("#addTable2").append(tableRows);
    for (var i = 0; i <= 8; i++)
    {
        $('#referenceTableHeading' + i).attr('tabindex', '-1');
    }
});