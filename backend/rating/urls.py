from django.urls import path
from backend.rating.views import RatingAddView

app_name = 'rating'

urlpatterns = [
    path('rating/<int:pk>/', RatingAddView.as_view(), name='rating')
]
