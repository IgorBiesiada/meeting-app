from django.urls import path
from rating.views import RatingAddView

app_name = 'rating'

urlpatterns = [
    path('api/rating/<int:pk>/', RatingAddView.as_view(), name='rating')
]
