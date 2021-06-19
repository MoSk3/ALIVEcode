from django import template
from django.utils.safestring import SafeData
from django.utils.text import normalize_newlines
from django.template.defaultfilters import stringfilter
from django.utils.html import escape
from django.utils.html import mark_safe

register = template.Library()

@register.filter(name='to_url_valid')
def to_url_valid(text: str):
    text.replace(' ', '_')
    text.replace("'", '')
    #return Activity.objects.filter(section=section)

@register.filter(is_safe=True, needs_autoescape=True)
@stringfilter
def format_breakline(value, autoescape=True):
    """
    Convert all newlines in a piece of plain text to HTML line breaks
    (``<br>``).
    """
    autoescape = autoescape and not isinstance(value, SafeData)
    value = normalize_newlines(value)
    if autoescape:
        value = escape(value)
    return mark_safe(value.replace(r'\n', '<br>'))