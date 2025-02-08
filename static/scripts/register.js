document.addEventListener('DOMContentLoaded', function (){          //czekanie na załadowanie strony
    const regionField = document.getElementById('id_region');
    const cityField = document.getElementById('id_city');   //pobieranie formularza

    regionField.addEventListener('change', function(){
        const regionId = this.value;    //pobieramy id wybranego regionu

        fetch(`/get_city/?region_id=${regionId}`)   //wysyłanie żądania do django
            .then(response => response.json())
            .then(data => {             //konwertowanie odpowiedź serwera na format JSON
                cityField.innerHTML = '<option value="">Wybierz Miasto</option>';

                if(data.length > 0){        //sprawdzamy czy są miasta
                    data.forEach(city => {
                        const option = document.createElement('option');
                        option.value = city.id;
                        option.textContent = city.name;     //tworzymy i dodajemy miasta do listy rozwijanej
                        cityField.appendChild(option);
                    });
                    } else {
                        cityField.innerHTML = '<option value="">Brak miast w tym regionie</option>';    //Obsługujemy przypadek, gdy nie ma miast
                    }

            })
            .catch(error => console.log('Error:', error))   //obsługa innych błędów
    });
});