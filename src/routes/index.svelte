<script>
	import axios from 'axios';
	import AutoComplete from 'simple-svelte-autocomplete';
	import { tMapAppKey, messages, availablePlaces, transformCoordinatesArrayForTMap } from "../constants";
	import { Icon, Search } from "svelte-hero-icons";
	import { onMount } from "svelte";
	let map, origin, dest, markers = [], bounds, promise = Promise.resolve([]), routePolyline, dryRun = true;

	onMount(() => {
		const container = document.querySelector('.map');
		const options = {
			center: new kakao.maps.LatLng(33.450701, 126.570667),
		};

		map = new kakao.maps.Map(container, options);
		// map.addOverlayMapTypeId(kakao.maps.MapTypeId.ROADVIEW);    
		map.setMaxLevel(3);
		// var mapTypeControl = new kakao.maps.MapTypeControl();
		// map.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);

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

	function fetchRoutes(origin, dest) {
		const options = {
			startX: origin.longitude,
			startY: origin.latitude,
			endX: dest.longitude,
			endY: dest.latitude,
			startName: origin.name,
			endName: dest.name,
		};
		return new Promise(async (resolve, reject) => {
			try {
				const response = await axios.post(`https://apis.openapi.sk.com/tmap/routes/pedestrian?version=1&appKey=${tMapAppKey}&searchOption=10`, options);
				const data = response.data.features;
				const coords = transformCoordinatesArrayForTMap(data);
				generateRoutes(coords);
				const distance = routePolyline.getLength();
				// v = 4km/h
				const duration = distance / 1.11111;
				resolve({ distance: distance, duration: duration });
			} catch (e) {
				console.log(e);
				reject(e);
			}
		});
	}

	async function handleSubmit() {
		if (!origin) return alert(messages.noOriginSpecified);
		if (!dest) return alert(messages.noDestSpecified);
		if (origin.name === dest.name) return alert(messages.originDestCannotBeSame);		
		dryRun = false;
		// remove existing polyline
		if (routePolyline) routePolyline.setMap(null);
		promise = fetchRoutes(origin, dest);
		generateMarkers();
	}

	function generateRoutes(coords) {
		const latLngPoints = [];
		const originPoint = new kakao.maps.LatLng(origin.latitude, origin.longitude);
		const destPoint = new kakao.maps.LatLng(dest.latitude, dest.longitude);
		latLngPoints.push(originPoint);
		coords.forEach((passPoint) => {
			const point = new kakao.maps.LatLng(passPoint.latitude, passPoint.longitude);
			latLngPoints.push(point);
		});
		latLngPoints.push(destPoint);

		routePolyline = new kakao.maps.Polyline({
			map: map,
			path: latLngPoints,
			endArrow: true,
			strokeWeight: 5,
			strokeColor: '#F10000',
			strokeOpacity: 0.8,
			strokeStyle: 'solid'
		});
	}

	function generateMarkers() {
		// map generating
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
			<div class="status-wrapper">
				{#await promise}
					{#if !dryRun}
						<p>잠시 기다려 주세요...</p>
					{:else}
						<p class="hidden">dummy</p>
					{/if}
				{:then result}
					{#if result.distance && result.duration}
						<p>
							<span>거리: {Math.round(result.distance)}m</span>
							<span>예상 소요시간: {Math.round(result.duration / 60)}분</span>
						</p>
					{:else}
						<p class="hidden">dummy</p>
					{/if}
				{:catch error}
					<p>{error.message}</p>
				{/await}
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
