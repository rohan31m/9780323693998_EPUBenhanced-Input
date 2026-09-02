function getDropdown($el)
{
    var $node = $($el);
    return $node.hasClass('dropdown') ? $node : $node.closest('.dropdown');
}

function getCombobox($dropdown)
{
    var $combo = $dropdown.find('[role="combobox"]').first();
    return $combo.length ? $combo : $dropdown;
}

function setActiveOption($dropdown, $option)
{
    var $combo = getCombobox($dropdown);
    $dropdown.find('.option.active').removeClass('active');
    if ($option && $option.length)
    {
        $option.addClass('active');
        $combo.attr('aria-activedescendant', $option.attr('id'));
        var list = $dropdown.find('.list')[0];
        if (list && $option[0] && typeof $option[0].scrollIntoView === 'function')
        {
            $option[0].scrollIntoView(false);
        }
    }
    else
    {
        $combo.removeAttr('aria-activedescendant');
    }
}

function openDropdown($dropdown)
{
    $('.dropdown').not($dropdown).each(function()
    {
        closeDropdown($(this));
    });
    $dropdown.addClass('open');
    getCombobox($dropdown).attr('aria-expanded', 'true');
    $dropdown.find('.list').attr('aria-hidden', 'false');
    var $active = $dropdown.find('.option.selected').first();
    if (!$active.length)
    {
        $active = $dropdown.find('.option').first();
    }
    setActiveOption($dropdown, $active);
}

function closeDropdown($dropdown)
{
    $dropdown.removeClass('open');
    var $combo = getCombobox($dropdown);
    $combo.attr('aria-expanded', 'false');
    $combo.removeAttr('aria-activedescendant');
    $dropdown.find('.list').attr('aria-hidden', 'true');
    $dropdown.find('.option.active').removeClass('active');
}

function create_custom_dropdowns()
{
    $('select').each(function(i, select)
    {
        if (!$(this).next().hasClass('dropdown'))
        {
            var listboxId = 'dropdown-listbox-' + i;
            var comboboxId = 'dropdown-combobox-' + i;
            var valueId = comboboxId + '-value';
            var labelledBy = $('#referenceSelectLabel').attr('id');
            var labelledByIds = labelledBy || valueId;
            $(this).after(
                '<div class="dropdown ' + ($(this).attr('class') || '') + '">' +
                    '<button type="button" id="' + comboboxId + '" class="combo-button" role="combobox" aria-autocomplete="none" aria-expanded="false" aria-haspopup="listbox" aria-controls="' + listboxId + '" aria-labelledby="' + labelledByIds + '">' +
                        '<span class="current" id="' + valueId + '"></span>' +
                    '</button>' +
                    '<div class="list" aria-hidden="true"><ul id="' + listboxId + '" role="listbox"></ul></div>' +
                '</div>'
            );

            var dropdown = $(this).next();
            var options = $(select).find('option');
            var selected = $(this).find('option:selected');
            dropdown.find('.current').html(selected.data('display-text') || selected.text());
            options.each(function(j, o)
            {
                var display = $(o).data('display-text') || '';
                var isSelected = $(o).is(':selected');
                dropdown.find('ul').append('<li id="dropdown-option-' + i + '-' + j + '" class="option' + (isSelected ? ' selected' : '') + '" role="option" aria-selected="' + (isSelected ? 'true' : 'false') + '" data-value="' + $(o).val() + '" data-display-text="' + display + '">' + $(o).text() + '</li>');
            });
            $(this).attr({
                'aria-hidden': 'true',
                'tabindex': '-1'
            }).hide();
        }
    });
}
// Event listeners
$(document).on('click', '.dropdown', function(event)
{
    if ($(event.target).closest('.option').length)
    {
        return;
    }
    var $dropdown = $(this);
    if ($dropdown.hasClass('open'))
    {
        closeDropdown($dropdown);
    }
    else
    {
        openDropdown($dropdown);
    }
    getCombobox($dropdown).focus();
});
$(document).on('click', function(event)
{
    if ($(event.target).closest('.dropdown').length === 0)
    {
        $('.dropdown').each(function()
        {
            closeDropdown($(this));
        });
    }
    event.stopPropagation();
});
$(document).on('click', '.dropdown .option', function(event)
{
    event.stopPropagation();
    var $dropdown = $(this).closest('.dropdown');
    $dropdown.find('.option').removeClass('selected').attr('aria-selected', 'false');
    $(this).addClass('selected').attr('aria-selected', 'true');
    var text = $(this).data('display-text') || $(this).text();
    $dropdown.find('.current').text(text);
    $dropdown.prev('select').prop('selectedIndex', $(this).index()).trigger('change');
    closeDropdown($dropdown);
    if ($dropdown.closest('.tablepatch').length === 0)
    {
        getCombobox($dropdown).focus();
    }
});
$(document).on('keydown', '[role="combobox"]', function(event)
{
    var $dropdown = getDropdown($(this));
    var $options = $dropdown.find('[role="listbox"] > .option');
    if (!$options.length)
    {
        $options = $dropdown.find('.option');
    }
    if (!$options.length)
    {
        return;
    }

    var $active = $dropdown.find('.option.active');
    if (!$active.length)
    {
        $active = $dropdown.find('.option.selected');
    }
    if (!$active.length)
    {
        $active = $options.first();
    }

    var key = event.keyCode;
    var isOpen = $dropdown.hasClass('open');

    if (key == 32 || key == 13)
    {
        event.preventDefault();
        if (isOpen)
        {
            $active.trigger('click');
        }
        else
        {
            openDropdown($dropdown);
        }
        return false;
    }
    else if (key == 40)
    {
        event.preventDefault();
        if (!isOpen)
        {
            openDropdown($dropdown);
        }
        else
        {
            var $next = $active.next('.option');
            if ($next.length)
            {
                setActiveOption($dropdown, $next);
            }
        }
        return false;
    }
    else if (key == 38)
    {
        event.preventDefault();
        if (!isOpen)
        {
            openDropdown($dropdown);
        }
        else
        {
            var $prev = $active.prev('.option');
            if ($prev.length)
            {
                setActiveOption($dropdown, $prev);
            }
        }
        return false;
    }
    else if (key == 36 && isOpen)
    {
        event.preventDefault();
        setActiveOption($dropdown, $options.first());
        return false;
    }
    else if (key == 35 && isOpen)
    {
        event.preventDefault();
        setActiveOption($dropdown, $options.last());
        return false;
    }
    else if (key == 27 && isOpen)
    {
        event.preventDefault();
        closeDropdown($dropdown);
        getCombobox($dropdown).focus();
        return false;
    }
    else if (key == 9 && isOpen)
    {
        closeDropdown($dropdown);
    }
});
