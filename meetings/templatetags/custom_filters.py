from django import template #django zuywał tego do tworzenia własnych filtrów

register = template.Library()   #tworzymy obiekt register

@register.filter    #Informuje Django, że dict_get to filtr dostępny w szablonach.
def dict_get(dictionary, key):      #funkcja, która pobiera wartość z podanego słownika. Jeśli klucz nie istnieje, zwraca False
    #Pobiera wartość ze słownika
    return dictionary.get(key, False)
