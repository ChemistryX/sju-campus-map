<script>
	import AutoComplete from 'simple-svelte-autocomplete';
	import { messages, availablePlaces } from "../constants";
	import { Icon, Search } from "svelte-hero-icons";
	import { onMount } from "svelte";
	let map, origin, dest, markers = [], bounds;

	onMount(() => {
		const container = document.querySelector('.map');
		const options = {
			center: new kakao.maps.LatLng(33.450701, 126.570667),
			// level: 3
		};

		map = new kakao.maps.Map(container, options);
		map.addOverlayMapTypeId(kakao.maps.MapTypeId.ROADVIEW);    

		bounds = new kakao.maps.LatLngBounds();
		availablePlaces.forEach((place) => {
			const point = new kakao.maps.LatLng(place.latitude, place.longitude);
			const marker = new kakao.maps.Marker({
				map: map,
				position: point,
				title: place.name,
			});
			markers.push(marker);

			const overlay = new kakao.maps.CustomOverlay({
				content: marker.getTitle(),
				map: map,
				position: marker.getPosition(),
			});

			// remove overlay by default
			overlay.setMap(null);

			kakao.maps.event.addListener(marker, 'mouseover', () => overlay.setMap(map));
			kakao.maps.event.addListener(marker, 'mouseout', () => overlay.setMap(null));

			bounds.extend(point);
		});
		
		map.setBounds(bounds);
	});

	function handleSubmit() {
		if (!origin) return alert(messages.noOriginSpecified);
		if (!dest) return alert(messages.noDestSpecified);
		if (origin.name === dest.name) return alert(messages.originDestCannotBeSame);
		markers.forEach((marker) => {
			marker.setMap(null);
		});
		markers = [];
		const originPoint = new kakao.maps.LatLng(origin.latitude, origin.longitude);
		const originMarker = new kakao.maps.Marker({
			map: map,
			position: originPoint,
			title: origin.name,
		});
		markers.push(originMarker);
		const destPoint = new kakao.maps.LatLng(dest.latitude, dest.longitude);
		const destMarker = new kakao.maps.Marker({
			map: map,
			position: destPoint,
			title: dest.name,
		});
		markers.push(destMarker);

		bounds = new kakao.maps.LatLngBounds();
		bounds.extend(originPoint);
		bounds.extend(destPoint);
		map.setBounds(bounds);
	}

	$: console.log(origin);
	$: console.log(dest);
</script>

<div class="content-wrapper">
	<div class="sidebar">
		<div class="sidebar-container">
			<div class="title">
				<p>세종대학교</p>
				<h3>캠퍼스맵</h3>
			</div>
			<div class="form-wrapper">
				<AutoComplete
				items={availablePlaces} bind:selectedItem={origin} 
				labelFieldName="name" placeholder={messages.placeholder.origin} 
				hideArrow="true" noResultsText={messages.noResults}
				/>
				<AutoComplete
					items={availablePlaces} bind:selectedItem={dest} 
					labelFieldName="name" placeholder={messages.placeholder.dest} 
					hideArrow="true" noResultsText={messages.noResults} 
				/>
				<button class="input search-btn" on:click={handleSubmit}>
					<Icon src={Search} size=18 />
					<span>길찾기</span>
				</button>
			</div>
		</div>
	</div>
	<!-- TODO: adjust size based on screen sizes -->
	<div class="map" style="width: 100%; height: 100vh;"></div>
</div>
<style lang="scss"></style>
