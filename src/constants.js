export const tMapAppKey = "l7xxeda087f684e040b4be4a52efad6830b8";
export const messages = {
	placeholder: {
		origin: "출발지를 입력하세요.",
		dest: "도착지를 입력하세요."
	},
	noOriginSpecified: "출발지를 입력해주세요.",
	noDestSpecified: "도착지를 입력해주세요.",
	originDestCannotBeSame: "출발지와 도착지는 같을 수 없어요.",
	noResults: "결과가 없습니다."
};

export const availablePlaces = [
	{
		name: "집현관",
		latitude: 37.5490841733111,
		longitude: 127.073615269234,
	},
	{
		name: "대양홀",
		latitude: 37.5486727561126,
		longitude: 127.074511116303,
	},
	{
		name: "모차르트홀",
		latitude: 37.5482765762202,
		longitude: 127.074098810471,
	},
	{
		name: "군자관",
		latitude: 37.5496354907605,
		longitude: 127.073765188647,
	},
	{
		name: "광개토관",
		latitude: 37.5503134324548,
		longitude: 127.073136656184,
	},
	{
		name: "이당관",
		latitude: 37.5506306452761,
		longitude: 127.073037380015,
	},
	{
		name: "진관홀",
		latitude: 37.5509260098055,
		longitude: 127.07330021451,
	},
	{
		name: "용덕관",
		latitude: 37.551344053001,
		longitude: 127.073332310711,
	},
	{
		name: "홍진구조실험센터",
		latitude: 37.5516468920655,
		longitude: 127.073165119395,
	},
	{
		name: "미래교육원 별관",
		latitude: 37.5532469116628,
		longitude: 127.073411130764,
	},
	{
		name: "영실관",
		latitude: 37.5523820105012,
		longitude: 127.073319747451,
	},
	{
		name: "충무관",
		latitude: 37.5523094929369,
		longitude: 127.074021321666,
	},
	{
		name: "율곡관",
		latitude: 37.5519166382013,
		longitude: 127.074052620172,
	},
	{
		name: "다산관",
		latitude: 37.5525688665224,
		longitude: 127.07420264856,
	},
	{
		name: "주차빌딩",
		latitude: 37.5526768950791,
		longitude: 127.07434761217,
	},
	{
		name: "동천관(학술정보원)",
		latitude: 37.5516641654657,
		longitude: 127.074360186282,
	},
	{
		name: "우정당",
		latitude: 37.5518837802258,
		longitude: 127.074722541899,
	},
	{
		name: "박물관",
		latitude: 37.55148249207771,
		longitude: 127.0752642128225,
	},
	{
		name: "애지헌",
		latitude: 37.5508391075883,
		longitude: 127.073951967676,
	},
	{
		name: "대양 AI 센터",
		latitude: 37.5508561297125,
		longitude: 127.075528392327,
	},
	{
		name: "세종관",
		latitude: 37.5499629449819,
		longitude: 127.074575773049,
	},
	{
		name: "학생회관",
		latitude: 37.5495986004586,
		longitude: 127.075114073017,
	},
	{
		name: "새날관",
		latitude: 37.5534167639541,
		longitude: 127.072659846815,
	},
	{
		name: "무방관",
		latitude: 37.553744570665,
		longitude: 127.072913667574,
	},
];

export const transformCoordinatesArrayForTMap = (arrayOfPathObject) => {
	const coordinatesArray = [];
  
	arrayOfPathObject?.forEach((pathObject, index) => {
	  const pathData = pathObject.geometry.coordinates;
  
	  if (Array.isArray(pathData[0])) {
		pathData.forEach((coord, index) => {
		  const lastIndex = coordinatesArray.length - 1;
		  const longitude = coord[0];
		  const latitude = coord[1];
		  if (!coordinatesArray.length) {
			coordinatesArray.push({ 'latitude': latitude, 'longitude': longitude });
		  } else if (coordinatesArray[lastIndex].latitude !== latitude || coordinatesArray[lastIndex].longitude !== longitude) {
			coordinatesArray.push({ 'latitude': latitude, 'longitude': longitude });
		  }
		});
	  } else {
		const lastIndex = coordinatesArray.length - 1;
		const longitude = pathData[0];
		const latitude = pathData[1];
  
		if (!coordinatesArray.length) {
		  coordinatesArray.push({ 'latitude': latitude, 'longitude': longitude });
		} else if (coordinatesArray[lastIndex].latitude !== latitude || coordinatesArray[lastIndex].longitude !== longitude) {
		  coordinatesArray.push({ 'latitude': latitude, 'longitude': longitude });
		}
	  }
	});
  
	return coordinatesArray;
};