from django.shortcuts import render
from django.urls import reverse_lazy
from django.views.generic import CreateView
from user_messages.forms import MessageForm
from user_messages.models import Message

# Create your views here.

class UserMessagesView(CreateView):
    model = Message
    form_class = MessageForm
    template_name = 'messages.html'
    success_url = reverse_lazy('home')

    def form_valid(self, form):
        form.instance.sender = self.request.user
        return super().form_valid(form)
