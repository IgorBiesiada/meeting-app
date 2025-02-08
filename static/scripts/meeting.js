document.addEventListener("DOMContentLoaded", function (){      //czeka az sie załaduje kod wykona sie dopiero po pełnym załadowaniu DOM czyli strony html
    const regionField = document.getElementById('id_meeting_region');
    const subregionField = document.getElementById('id_meeting_subregion');     //pobieranie pola formularza
    const cityField = document.getElementById('id_meeting_city');

    regionField.addEventListener('change', function () {        //Nasłuchujemy zmiany w polu regionu
        fetch(`/get_subregions/?region_id=${regionField.value}`)    //wysyłamy zapytanie do get_subregions z region id jako parametr. Zwracana lista w formacie JSON
            .then(response => response.json())      //Konwertowanie odpowiedzi na JSNO
            .then(data => {
                subregionField.innerHTML = '<option value="">Wybierz powiat</option>'
                data.forEach(subregion => {                             //czyszczenie listy subregionów i dodajemy nową zawartość
                    subregionField.innerHTML += `<option value="${subregion.id}">${subregion.name}</option>`;
                });
            });
    });

    regionField.addEventListener("change", function() {
        fetch(`/get_cities/?region_id=${regionField.value}`)
            .then(response => response.json())
            .then(data => {
                cityField.innerHTML = '<option value="">Wybierz miasto</option>';
                data.forEach(city => {
                    cityField.innerHTML += `<option value="${city.id}">${city.name}</option>`;
                });
            });
    });
});