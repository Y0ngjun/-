// ingredients.json 불러오기
fetch('ingredients.json')
    .then(response => response.json())
    .then(data => {
        const ingredientsList = document.getElementById('ingredients-list');
        
        data.forEach(ingredient => {
            // 버튼 생성
            const btn = document.createElement('button');
            btn.classList.add('ingredient-btn'); // 버튼에 클래스를 추가

            // 이미지 생성
            const img = document.createElement('img');
            img.src = ingredient.image;
            img.alt = ingredient.name;
            img.classList.add('ingredient-img'); // 이미지에 클래스 추가

            // 텍스트 생성
            const name = document.createElement('span');
            name.textContent = ingredient.name;  // 식재료 이름

            // 버튼 안에 이미지와 이름을 함께 넣기
            btn.appendChild(img);
            btn.appendChild(name);

            // 버튼 클릭 시 선택된 상태 토글
            btn.addEventListener('click', () => {
                btn.classList.toggle('selected');
                updateFoodList(); // 선택된 식재료에 맞는 음식 업데이트
            });

            ingredientsList.appendChild(btn);  // 버튼을 ingredientsList에 추가
        });
    });

// foods.json 파일에서 메뉴 데이터를 가져옴
let foods = [];

fetch('foods.json')  // foods.json 파일을 가져옵니다
    .then(response => response.json())  // JSON 데이터를 파싱
    .then(data => {
        foods = data;  // 데이터를 전역 변수에 저장
        displayFoods(foods); // 처음에는 모든 음식 표시
    })
    .catch(error => console.error('Error loading menu:', error));

// 음식 데이터를 화면에 표시하는 함수
function displayFoods(foodData) {
    const menuList = document.getElementById('foods-list');
    menuList.innerHTML = ''; // 기존 음식 목록을 초기화

    // 음식 데이터 배열을 순회하며 화면에 추가
    foodData.forEach(food => {
        const foodDiv = document.createElement('div');
        foodDiv.classList.add('food');  // 음식 스타일 적용

        // 음식 이름을 표시할 요소 생성
        const name = document.createElement('p');
        name.textContent = food.name;  // 음식 이름 설정
        foodDiv.appendChild(name); // 음식 이름을 div에 추가

        // 음식 클릭 이벤트 추가
        foodDiv.addEventListener('click', () => {
            // food.html로 이동하며 음식 이름을 URL 파라미터로 전달
            window.location.href = `food.html?name=${encodeURIComponent(food.name)}`;
        });

        menuList.appendChild(foodDiv); // 음식 div를 메뉴 목록에 추가
    });
}

// 선택된 식재료에 맞는 음식만 표시하는 함수
function updateFoodList() {
    const selectedIngredients = Array.from(document.querySelectorAll('.ingredient-btn.selected')).map(btn => btn.textContent.toLowerCase());

    if (selectedIngredients.length === 0) {
        // 아무 식재료도 선택되지 않으면 모든 음식을 표시
        displayFoods(foods);
    } else {
        // 선택된 식재료를 포함한 음식만 표시
        const filteredFoods = foods.filter(food => {
            return selectedIngredients.every(ingredient => {
                return food.ingredients.some(foodIngredient => foodIngredient.toLowerCase() === ingredient);
            });
        });
        displayFoods(filteredFoods);
    }
}

// 검색 버튼을 눌렀을 때 실행되는 함수
document.getElementById('search-btn').addEventListener('click', function() {
    const searchQuery = document.getElementById('food-search').value.toLowerCase(); // 입력값을 소문자로 변환

    // 검색어가 비어있으면 모든 음식을 표시
    if (searchQuery === '') {
        updateFoodList(); // 모든 식재료를 표시
    } else {
        // 검색어로 음식을 필터링
        const filteredFoods = foods.filter(food => food.name.toLowerCase().includes(searchQuery));
        displayFoods(filteredFoods); // 필터링된 음식만 표시
    }
});

// 검색 입력창에서 Enter 키를 누르면 검색되는 기능 추가
document.getElementById('food-search').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        const searchQuery = document.getElementById('food-search').value.toLowerCase();
        if (searchQuery === '') {
            updateFoodList();
        } else {
            const filteredFoods = foods.filter(food => food.name.toLowerCase().includes(searchQuery));
            displayFoods(filteredFoods);
        }
    }
});


// 상세 페이지 관련 코드
window.addEventListener('DOMContentLoaded', () => {
    // 1. URL에서 음식 이름(name 파라미터)을 가져옵니다.
    const urlParams = new URLSearchParams(window.location.search);
    const foodName = urlParams.get('name'); // URL 파라미터에서 `name` 값 가져오기
    console.log(foodName);
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
        if (food.ingredients && food.ingredients.length > 0) {
            food.ingredients.forEach(ingredient => {
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
        instructionsElement.textContent =
            food.instructions || '요리 방법 정보가 없습니다.';
    }

    // 요리 영상
    const foodVideoElement = document.querySelector('.food-video video');
    if (foodVideoElement) {
        const videoSourceElement = foodVideoElement.querySelector('source');
        if (videoSourceElement) {
            videoSourceElement.src = food.video || 'default-video.mp4'; // 기본 비디오 설정
            foodVideoElement.load(); // 비디오를 다시 로드하여 갱신
        }
    }
}


