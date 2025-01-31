from django.shortcuts import render, get_object_or_404, redirect
from django.views.generic import View
from django.contrib import messages
from django.urls import reverse
from meetings.models import Meeting
from participations.models import Participation


# Create your views here.

class MeetingParticipationView(View):
    def post(self, request, *args, **kwargs):
        meeting_id = request.POST.get('meeting_id')
        action = request.POST.get('action')
        meeting = get_object_or_404(Meeting, id=meeting_id)
        user = request.user

        if not user.is_authenticated:
            messages.error(request, 'Musisz być zalogowany, aby dołączyć do spotkania.')
            return redirect('meetings')

        participation = Participation.objects.filter(meeting=meeting, participant=user).first()

        if action == 'join':
            if participation:
                messages.warning(request, 'Już bierzesz udział w spotkaniu!')
            else:
                if meeting.price > 0:
                    return redirect(reverse('payment', kwargs={'meeting_id': meeting.id}))
                self.add_participant(meeting, user)

        elif action == 'leave' and participation:
            self.remove_participant(meeting, participation)

        return redirect('meeting_detail', pk=meeting.id)

    def add_participant(self, meeting, user):
        if meeting.number_of_seats > 0:
            Participation.objects.create(meeting=meeting, participant=user, is_waiting=False)
            meeting.number_of_seats -= 1
            meeting.save()
            messages.success(self.request, 'Dołączyłeś do spotkania!')
        else:
            Participation.objects.create(meeting=meeting, participant=user, is_waiting=True)
            meeting.waiting_people += 1
            meeting.save()
            messages.success(self.request, 'Nie było miejsc, jesteś na liście oczekujących.')

    def remove_participant(self, meeting, participation):
        if participation.is_waiting:
            meeting.waiting_people -= 1
        else:
            meeting.number_of_seats += 1
        meeting.save()
        participation.delete()
        messages.success(self.request, 'Zrezygnowałeś z udziału.')