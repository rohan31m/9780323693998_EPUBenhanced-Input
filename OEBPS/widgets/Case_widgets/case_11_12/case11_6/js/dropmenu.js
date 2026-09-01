function create_custom_dropdowns()
{
    $('select').each(function(i, select)
    {
        if (!$(this).next().hasClass('dropdown'))
        {
            $(this).after('<div class="dropdown ' + ($(this).attr('class') || '') + '" tabindex="0" aria-expanded="false" aria-haspopup="true"><span class="current"></span><div class="list"><ul role="listbox"></ul></div></div>');

            var dropdown = $(this).next();
            var options = $(select).find('option');
            var selected = $(this).find('option:selected');
            dropdown.find('.current').html(selected.data('display-text') || selected.text());
            options.each(function(j, o)
            {
                var display = $(o).data('display-text') || '';
                dropdown.find('ul').append('<li class="option ' + ($(o).is(':selected') ? 'selected' : '') + '" tabindex="0" role="option" data-value="' + $(o).val() + '" data-display-text="' + display + '">' + $(o).text() + '</li>');
            });
        }
    });
}
// Event listeners
// Open/close
$(document).on('click', '.dropdown', function(event)
{
    $('.dropdown').not($(this)).removeClass('open');
    
    $(this).toggleClass('open');

    if ($(this).hasClass('open'))
    {
        $(this).attr('aria-expanded', "true");
        $(this).find('.option').attr('tabindex', "0");
        $(this).find('.selected').focus();
    }
    else
    {
        $(this).find('.option').removeAttr('tabindex');
        $(this).attr('aria-expanded', "false");
        $(this).focus();
    }
});
// Close when clicking outside
$(document).on('click', function(event)
{
    if ($(event.target).closest('.dropdown').length === 0)
    {
        $('.dropdown').removeClass('open');
        $('.dropdown .option').removeAttr('tabindex');
        $('.dropdown').attr('aria-expanded', "false");
    }
    event.stopPropagation();
});
// Option click
$(document).on('click', '.dropdown .option', function(event)
{
    $(this).closest('.list').find('.selected').removeClass('selected');
    $(this).addClass('selected');
    var text = $(this).data('display-text') || $(this).text();
    $(this).closest('.dropdown').find('.current').text(text);
    $(this).closest('.dropdown').prev('select').val($(this).data('value')).trigger('change');
});
// Keyboard events
$(document).on('keydown', '.dropdown', function(event)
{
    var focused_option = $($(this).find('.list .option:focus')[0] || $(this).find('.list .option.selected')[0]);
    
    // console.log("focused_option> ", focused_option)
    if (event.keyCode == 32 || event.keyCode == 13)
    {
      // Space or Enter
        if ($(this).hasClass('open'))
        {
            focused_option.trigger('click');
        }
        else
        {
            $(this).trigger('click');
        }
        return false;
        
    }
    else if (event.keyCode == 40)
    {
      // Down
      // console.log(focused_option)
        if (!$(this).hasClass('open'))
        {
            $(this).trigger('click');
        }
        else
        {
          // console.log("Next >>>",focused_option.next())
            focused_option.next().focus();
        }
        return false;
        
    }
    else if (event.keyCode == 38)
    {
      // Up
        if (!$(this).hasClass('open'))
        {
            $(this).trigger('click');
        }
        else
        {
            var focused_option = $($(this).find('.list .option:focus')[0] || $(this).find('.list .option.selected')[0]);
            focused_option.prev().focus();
        }
        return false;
        
    }
    else if (event.keyCode == 27)
    {
      // Esc
        if ($(this).hasClass('open'))
        {
            $(this).trigger('click');
        }
        return false;
        
    }
});