document.addEventListener('DOMContentLoaded', function (){
    const regionField = document.getElementById('id_region');
    const cityField = document.getElementById('id_city');

    regionField.addEventListener('change', function(){
        const regionId = this.value;

        fetch(`/get_city/?region_id=${regionId}`)
            .then(response => response.json())
            .then(data => {
                cityField.innerHTML = '<option value="">Wybierz Miasto</option>';

                if(data.length > 0){
                    data.forEach(city => {
                        const option = document.createElement('option');
                        option.value = city.id;
                        option.textContent = city.name;
                        cityField.appendChild(option);
                    });
                    } else {
                        cityField.innerHTML = '<option value="">Brak miast w tym regionie</option>';
                    }

            })
            .catch(error => console.log('Error:', error))
    });
});