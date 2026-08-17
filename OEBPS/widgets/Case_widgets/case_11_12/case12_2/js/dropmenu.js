function setActiveOption($dropdown, $option)
{
    $dropdown.find('.option.active').removeClass('active');
    if ($option && $option.length)
    {
        $option.addClass('active');
        $dropdown.attr('aria-activedescendant', $option.attr('id'));
        var list = $dropdown.find('.list')[0];
        if (list && $option[0] && typeof $option[0].scrollIntoView === 'function')
        {
            $option[0].scrollIntoView(false);
        }
    }
    else
    {
        $dropdown.removeAttr('aria-activedescendant');
    }
}

function openDropdown($dropdown)
{
    $('.dropdown').not($dropdown).each(function()
    {
        closeDropdown($(this));
    });
    $dropdown.addClass('open');
    $dropdown.attr('aria-expanded', 'true');
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
    $dropdown.attr('aria-expanded', 'false');
    $dropdown.find('.option.active').removeClass('active');
    $dropdown.removeAttr('aria-activedescendant');
}

function create_custom_dropdowns()
{
    $('select').each(function(i, select)
    {
        if (!$(this).next().hasClass('dropdown'))
        {
            var listboxId = 'dropdown-listbox-' + i;
            var comboboxId = 'dropdown-combobox-' + i;
            var labelledBy = $('#referenceSelectLabel').attr('id');
            var labelledByAttr = labelledBy ? ' aria-labelledby="' + labelledBy + '"' : '';
            $(this).after('<div id="' + comboboxId + '" class="dropdown ' + ($(this).attr('class') || '') + '" tabindex="0" role="combobox" aria-autocomplete="none" aria-expanded="false" aria-haspopup="listbox" aria-controls="' + listboxId + '"' + labelledByAttr + '><span class="current"></span><div class="list"><ul id="' + listboxId + '" role="listbox"></ul></div></div>');

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
// Open/close
$(document).on('click', '.dropdown', function(event)
{
    if ($(event.target).closest('.option').length)
    {
        return;
    }
    if ($(this).hasClass('open'))
    {
        closeDropdown($(this));
    }
    else
    {
        openDropdown($(this));
    }
    $(this).focus();
});
// Close when clicking outside
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
// Option click
$(document).on('click', '.dropdown .option', function(event)
{
    event.stopPropagation();
    var $dropdown = $(this).closest('.dropdown');
    $dropdown.find('.option').removeClass('selected').attr('aria-selected', 'false');
    $(this).addClass('selected').attr('aria-selected', 'true');
    var text = $(this).data('display-text') || $(this).text();
    $dropdown.find('.current').text(text);
    $dropdown.prev('select').val($(this).data('value')).trigger('change');
    closeDropdown($dropdown);
    $dropdown.focus();
});
// Keyboard events
$(document).on('keydown', '.dropdown', function(event)
{
    var $dropdown = $(this);
    var $options = $dropdown.find('.list [role="listbox"] > .option');
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
        $dropdown.focus();
        return false;
    }
    else if (key == 9 && isOpen)
    {
        closeDropdown($dropdown);
    }
});
