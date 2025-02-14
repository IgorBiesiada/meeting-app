from django.shortcuts import render
from django.urls import reverse_lazy
from django.views.generic import CreateView, ListView
from user_messages.forms import MessageForm
from user_messages.models import Message
from django.contrib.auth.mixins import LoginRequiredMixin
# Create your views here.

class UserMessagesView(LoginRequiredMixin, CreateView):
    model = Message
    form_class = MessageForm
    template_name = 'messages.html'
    success_url = reverse_lazy('home:home')

    def form_valid(self, form):
        form.instance.sender = self.request.user
        return super().form_valid(form)

class UserMessagesListView(LoginRequiredMixin ,ListView):
    model = Message
    template_name = 'user_messages.html'
    context_object_name = 'messages'

    def get_queryset(self):
        user = self.request.user
        return Message.objects.filter(receiver=user)
