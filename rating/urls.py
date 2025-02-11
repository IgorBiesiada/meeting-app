from django.urls import path
from rating.views import RatingAddView

app_name = 'rating'

urlpatterns = [
    path('<int:pk>/rate/', RatingAddView.as_view(), name='rating')
]
