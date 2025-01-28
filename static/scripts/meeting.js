document.addEventListener("DOMContentLoaded", function (){
    const regionField = document.getElementById('id_meeting_region');
    const subregionField = document.getElementById('id_meeting_subregion');
    const cityField = document.getElementById('id_meeting_city');

    regionField.addEventListener('change', function () {
        fetch(`/get_subregions/?region_id=${regionField.value}`)
            .then(response => response.json())
            .then(data => {
                subregionField.innerHTML = '<option value="">Wybierz powiat</option>'
                data.forEach(subregion => {
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