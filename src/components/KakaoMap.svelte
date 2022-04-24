<script>
import { availablePlaces } from "../constants";
import { onMount } from "svelte";
	onMount(() => {
		let container = document.querySelector('.map');
		const options = {
			center: new kakao.maps.LatLng(33.450701, 126.570667),
			level: 3
		};

		const map = new kakao.maps.Map(container, options);

		const bounds = new kakao.maps.LatLngBounds();
		availablePlaces.forEach((place) => {
			const point = new kakao.maps.LatLng(place.latitude, place.longitude);
			const marker = new kakao.maps.Marker({ position: point });
			marker.setMap(map);
			bounds.extend(point);
		});
		
		map.setBounds(bounds);
	});
</script>

<!-- TODO: adjust size based on screen sizes -->
<div class="map" style="width: 100%; height: 100vh;"></div>