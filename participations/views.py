from django.shortcuts import get_object_or_404, redirect
from django.views.generic import View
from django.contrib import messages
from django.urls import reverse, reverse_lazy
from meetings.models import Meeting
from participations.models import Participation
from django.contrib.auth.mixins import LoginRequiredMixin

# Create your views here.

class MeetingParticipationView(LoginRequiredMixin, View):
    def post(self, request, *args, **kwargs):
        # Pobranie wartości z formularza
        meeting_id = request.POST.get('meeting_id')  # ID spotkania
        action = request.POST.get('action')  # Czy użytkownik chce "join" czy "leave"

        # Pobranie spotkania z bazy danych na podstawie podanego ID
        meeting = get_object_or_404(Meeting, id=meeting_id)
        user = request.user  # Pobranie aktualnie zalogowanego użytkownika

        # Sprawdzenie, czy użytkownik jest zalogowany (dodatkowe zabezpieczenie)
        if not user.is_authenticated:
            messages.error(request, 'Musisz być zalogowany, aby dołączyć do spotkania.')
            return redirect('landing_page')  # Przekierowanie na stronę główną

        # Sprawdzenie, czy użytkownik nie próbuje dołączyć do własnego spotkania
        if meeting.created_by == user:
            messages.error(request, 'Nie możesz dołączyć do własnego spotkania.')
            return redirect(reverse_lazy('meetings'))  # Przekierowanie na listę spotkań

        # Sprawdzenie, czy użytkownik już bierze udział w spotkaniu
        participation = Participation.objects.filter(meeting=meeting, participant=user).first()

        # Obsługa dołączania do spotkania
        if action == 'join':
            if participation:  # Sprawdza, czy użytkownik już bierze udział
                messages.warning(request, 'Już bierzesz udział w spotkaniu!')
            elif meeting.number_of_seats > 0:  # Sprawdza, czy są wolne miejsca
                Participation.objects.create(meeting=meeting, participant=user)  # Tworzy nową partycypację
                meeting.number_of_seats -= 1  # Zmniejsza liczbę dostępnych miejsc
                meeting.save()  # Zapisuje zmiany w bazie
                messages.success(request, 'Dołączyłeś do spotkania!')  # Wyświetla komunikat o sukcesie
            else:
                messages.error(request, 'Brak miejsc, nie możesz dołączyć.')  # Jeśli brak miejsc, wyświetla błąd

            return redirect('meeting_detail', pk=meeting.id)  # Przekierowanie na stronę szczegółów spotkania

        # Obsługa opuszczania spotkania
        elif action == 'leave' and participation:  # Sprawdza, czy użytkownik faktycznie jest zapisany
            participation.delete()  # Usuwa partycypację z bazy danych
            meeting.number_of_seats += 1  # Zwiększa liczbę dostępnych miejsc
            meeting.save()  # Zapisuje zmiany
            messages.success(request, 'Opuszczono spotkanie. Zwolniło się miejsce!')  # Wyświetla komunikat

        return redirect('meeting_detail', pk=meeting.id)  # Przekierowanie na stronę szczegółów spotkania
