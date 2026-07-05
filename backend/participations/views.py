from django.shortcuts import get_object_or_404
from backend.meetings.models import Meeting
from backend.participations.models import Participation
from rest_framework import status
from rest_framework.views import APIView 
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
# Create your views here.

class MeetingParticipationView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, meeting_id, *args, **kwargs): 
        action = request.data.get('action')  
        meeting = get_object_or_404(Meeting, id=meeting_id)
        user = request.user  

        if meeting.created_by == user:
            return Response({"detail": "nie możesz dołączyć do własnego spotkania"}, status=status.HTTP_400_BAD_REQUEST)

        participation = Participation.objects.filter(meeting=meeting, participant=user).first()

        if action == 'join':
            if participation:  
                return Response({'detail': 'Już bierzesz udział w spotkaniu!'}, status=status.HTTP_400_BAD_REQUEST)
            elif meeting.number_of_seats > 0:  
                Participation.objects.create(meeting=meeting, participant=user)  
                meeting.number_of_seats -= 1  
                meeting.save()  
                return Response({"detail": "Dołączyłeś do spotkania"}, status=status.HTTP_200_OK)  
            else:
                return Response({"detail": "Brak miejsc"}, status=status.HTTP_400_BAD_REQUEST)

            

        elif action == 'leave' and participation:  
            participation.delete() 
            meeting.number_of_seats += 1  
            meeting.save() 
            return Response({"detail": "Opuszczono spotkanie. Zwolniło się miejsce!"}, status=status.HTTP_200_OK)

        return Response({"status": "Nieprawidłowa akcja"}, status=status.HTTP_400_BAD_REQUEST)  