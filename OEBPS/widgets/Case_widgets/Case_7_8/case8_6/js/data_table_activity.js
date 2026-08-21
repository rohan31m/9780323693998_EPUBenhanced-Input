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

function refValueCells(colSecond, colThird, headersComp, headersRange)
{
    var secondEmpty = refEmpty(colSecond);
    var thirdEmpty = refEmpty(colThird);
    if (secondEmpty && thirdEmpty)
    {
        return '<td colspan="2" headers="' + headersRange + '">&#160;</td>';
    }
    if (secondEmpty)
    {
        return '<td colspan="2" headers="' + headersRange + '">' + colThird + '</td>';
    }
    if (thirdEmpty)
    {
        return '<td colspan="2" headers="' + headersRange + '">' + colSecond + '</td>';
    }
    return '<td headers="' + headersComp + '">' + colSecond + '</td><td headers="' + headersRange + '">' + colThird + '</td>';
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

    var i = 0;
    var lastTestId = '';
    var sectionId = prefix + '-sec-0';

    while (i < rows.length)
    {
        var row = rows[i];

        if (refIsSectionRow(row))
        {
            sectionId = prefix + '-sec-' + i;
            lastTestId = '';
            var sectionClass = (i === 0) ? 'titleTest' : 'sectionHead';
            var headingId = (i === 0) ? ('referenceTableHeading' + tableIndex) : sectionId;
            html += '<tr class="' + sectionClass + '">';
            html += '<th colspan="3" scope="colgroup" id="' + headingId + '">' + refText(row.col_first) + '</th>';
            html += '</tr>';
            i += 1;
            continue;
        }

        if (refEmpty(row.col_first) && !refEmpty(row.col_second) && refEmpty(row.col_third))
        {
            html += '<tr class="groupHead">';
            html += '<th colspan="2" scope="colgroup" headers="' + sectionId + ' ' + lastTestId + '">' + refText(row.col_second) + '</th>';
            html += '</tr>';
            i += 1;
            continue;
        }

        if (!refEmpty(row.col_first))
        {
            var rowspan = 1;
            var k = i + 1;
            while (k < rows.length && refEmpty(rows[k].col_first) && !refIsSectionRow(rows[k]))
            {
                rowspan += 1;
                k += 1;
            }
            lastTestId = prefix + '-row-' + i;
            html += '<tr class="emptyLine">';
            html += '<th scope="row" id="' + lastTestId + '"' + (rowspan > 1 ? ' rowspan="' + rowspan + '"' : '') + ' headers="' + colTest + ' ' + sectionId + '">' + row.col_first + '</th>';
            html += refValueCells(row.col_second, row.col_third, colComp + ' ' + sectionId + ' ' + lastTestId, colRange + ' ' + sectionId + ' ' + lastTestId);
            html += '</tr>';
            i += 1;
            continue;
        }

        html += '<tr>';
        html += refValueCells(row.col_second, row.col_third, colComp + ' ' + sectionId + ' ' + lastTestId, colRange + ' ' + sectionId + ' ' + lastTestId);
        html += '</tr>';
        i += 1;
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
    tableRows1 = buildReferenceTable(tableData1, 0) + brLine;
    tableRows2 = buildReferenceTable(tableData2, 1) + brLine;
    tableRows3 = buildReferenceTable(tableData3, 2) + brLine;
    tableRows4 = buildReferenceTable(tableData4, 3) + brLine;
    tableRows5 = buildReferenceTable(tableData5, 4) + brLine;
    tableRows6 = buildReferenceTable(tableData6, 5) + brLine;
    tableRows7 = buildReferenceTable(tableData7, 6) + brLine;
    tableRows8 = buildReferenceTable(tableData8, 7) + brLine;
    tableRows9 = buildReferenceTable(tableData9, 8) + brLine;
    $('#tableDropdownID').append(dropdownSelect);
    $("#addTable0").append(tableRows1);
    $("#addTable1").append(tableRows2);
    $("#addTable2").append(tableRows3);
    $("#addTable3").append(tableRows4);
    $("#addTable4").append(tableRows5);
    $("#addTable5").append(tableRows6);
    $("#addTable6").append(tableRows7);
    $("#addTable7").append(tableRows8);
    $("#addTable8").append(tableRows9);
    // $("#addTable2").append(tableRows);
    create_custom_dropdowns();
    $('#dropdown_1').attr({'aria-hidden': 'true', 'tabindex': '-1'}).hide();
    var rowIndex = 0;
    $('.tablepatch .list li').each(function()
    {
        $(this).attr('data-id', rowIndex);
        rowIndex++;
    });
    // new change
    $(document).on('click keyup', '.dropdown .option', function(ev)
    {
        if (ev.type == "keyup" && ev.keyCode != 13)
        {
            return true;
        }
        var data_id = $(this).attr('data-id');
        $('.testContainer').hide();
        $('#testListId' + data_id).show();
        syncReferenceTableScrollAccess(data_id, true);
    });
    $('#addTable5  .nano-pane').css("display", "none !important");
    // $("#addTable2").append(tableRows);
    for (var i = 0; i <= 8; i++)
    {
        $('#referenceTableHeading' + i).attr('tabindex', '-1');
    }
});