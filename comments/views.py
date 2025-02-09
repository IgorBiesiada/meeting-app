from django.shortcuts import get_object_or_404
from django.urls import reverse_lazy
from django.views.generic import CreateView
from django.contrib.auth.mixins import LoginRequiredMixin
from comments.forms import CommentForm
from comments.models import Comment
from meetings.models import Meeting


# Create your views here.

class AddCommentView(LoginRequiredMixin, CreateView):
    model = Comment
    form_class = CommentForm
    template_name = 'add_comment.html'

#przypisanie autora i spotkania
    def form_valid(self, form):
        #odnosimy sie do obiektu który bedzie zapisany do bazy w tym wypadku jest to zalogowany użytkonik
        form.instance.author = self.request.user
        form.instance.meeting = get_object_or_404(Meeting, id=self.kwargs['meeting_id'])
        return super().form_valid(form)
#przekierowanie uzytkonika po zapisie danych
    def get_success_url(self):
        return reverse_lazy('meeting_detail', kwargs={'pk': self.kwargs['meeting_id']}) #bierzemy id spotkania i przekazujemy je do URL widoku
