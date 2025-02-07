from django import forms
from untils import contains_bad_words, analyze_toxicity
from comments.models import Comment


class CommentForm(forms.ModelForm):
    class Meta:
        model = Comment
        fields = ['text']

    def clean_text(self):
        cleaned_text = self.cleaned_data.get('text')
        if contains_bad_words(cleaned_text):
            raise forms.ValidationError('Komentarz zawiera nieodpowiednie słowa.')

        if analyze_toxicity(cleaned_text):
            raise forms.ValidationError('Komentarz jest toksyczny lub nieodpowiedni.')

        return cleaned_text
