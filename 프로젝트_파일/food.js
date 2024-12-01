// 상세 페이지 관련 코드
window.addEventListener('DOMContentLoaded', () => {
    // 1. URL에서 음식 이름(name 파라미터)을 가져옵니다.
    const urlParams = new URLSearchParams(window.location.search);
    const foodName = urlParams.get('name'); // URL 파라미터에서 `name` 값 가져오기
    console.log(foodName);
    document.title=foodName+" 레시피";
    // 2. 음식 이름 확인
    if (!foodName) {
        alert('음식 이름이 URL에 제공되지 않았습니다.');
        return;
    }

    // 3. foods.json 파일에서 데이터 로드
    fetch('foods.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('foods.json 파일을 불러올 수 없습니다.');
            }
            return response.json(); // JSON 데이터를 파싱
        })
        .then(data => {
            // 4. JSON 데이터에서 음식 이름과 일치하는 데이터를 찾음
            const food = data.find(item => item.name === foodName);

            if (!food) {
                alert('해당 음식을 찾을 수 없습니다.');
                return;
            }

            // 5. 음식 데이터를 화면에 표시
            displayFoodDetails(food);
        })
        .catch(error => {
            console.error('foods.json 데이터를 불러오는 중 오류:', error);
            alert('음식 데이터를 불러오는 중 문제가 발생했습니다.');
        });
});

// 6. 음식 데이터를 화면에 표시하는 함수
function displayFoodDetails(food) {
    // 음식 이름
    const foodNameElement = document.querySelector('.food-name h2');
    if (foodNameElement) foodNameElement.textContent = food.name;

    // 음식 사진
    const foodImageElement = document.querySelector('.food-image img');
    if (foodImageElement) {
        foodImageElement.src = food.image || 'default-image.jpg'; // 기본 이미지 설정
        foodImageElement.alt = food.name || '음식 이미지';
    }

    // 음식 재료
    const ingredientsList = document.querySelector('.food-ingredients ul');
    if (ingredientsList) {
        ingredientsList.innerHTML = ''; // 기존 내용을 초기화
        if (food.recipeingredients && food.recipeingredients.length > 0) {
            food.recipeingredients.forEach(ingredient => {
                const li = document.createElement('li');
                li.textContent = ingredient;
                ingredientsList.appendChild(li);
            });
        } else {
            ingredientsList.innerHTML = '<li>재료 정보가 없습니다.</li>';
        }
    }

    // 요리 방법
    const instructionsElement = document.querySelector('.food-instructions p');
    if (instructionsElement) {
        instructionsElement.innerHTML =
            food.instructions || '요리 방법 정보가 없습니다.';
    }

    // 요리 영상
    const foodVideoElement = document.querySelector('.food-video iframe');
    if (foodVideoElement) {
        // food 객체의 video 속성을 사용하여 YouTube embed URL 설정
        const videoUrl = food.video || 'https://www.youtube.com/embed/defaultVideoId'; // 기본 비디오 설정
        foodVideoElement.src = videoUrl; // iframe의 src를 업데이트
    }

}