<script>
	import KakaoMap from '../components/KakaoMap.svelte';
	import { availablePlaces } from "../constants";
</script>

<div class="content-wrapper">
	<div class="sidebar">
		<div class="sidebar-container">
			<div class="title">
				<p>세종대학교</p>
				<h3>캠퍼스맵</h3>
			</div>
			<div class="form-wrapper">
				<input class="origin" type="text" placeholder="출발지를 입력하세요" />
				<input class="dest" type="text" placeholder="도착지를 입력하세요" />
				<input class="search-btn" type="submit" value="길찾기" />
			</div>
		</div>
	</div>
	<KakaoMap />
</div>
<style lang="scss"></style>
