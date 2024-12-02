// 전역 변수 선언
let foods = [];

// foods.json 데이터 불러오기
fetch('foods.json')
    .then(response => response.json())
    .then(data => {
        foods = data;
        displayFoods(foods); // 초기 화면에 모든 음식 표시
    })
    .catch(error => console.error('Error loading foods:', error));

// foods 데이터를 화면에 표시하는 함수
function displayFoods(foodData) {
    const foodsList = document.getElementById('foods-list');
    foodsList.innerHTML = ''; // 기존 목록 초기화

    foodData.forEach(food => {
        // 음식 카드 생성
        const foodCard = document.createElement('div');
        foodCard.className = 'food-card'; // 음식 카드 클래스 추가

        // 이미지 추가
        const foodImage = document.createElement('img');
        foodImage.src = food.image || 'images/default-image.jpg'; // 기본 이미지
        foodImage.alt = food.name; // 대체 텍스트 설정

        // 투명 검은색 박스
        const blackBoxOverlay = document.createElement('div');
        blackBoxOverlay.className = 'black-box-overlay'; // 음식 이름 오버레이 클래스

        // 음식 이름을 겹쳐 표시할 텍스트 추가
        const foodNameOverlay = document.createElement('div');
        foodNameOverlay.className = 'food-name-overlay'; // 음식 이름 오버레이 클래스
        foodNameOverlay.textContent = food.name; // 음식 이름 설정

        // 음식 카드에 이미지와 이름 오버레이 추가
        foodCard.appendChild(foodImage);
        foodCard.appendChild(blackBoxOverlay);
        foodCard.appendChild(foodNameOverlay);

        // 클릭 이벤트 추가
        foodCard.addEventListener('click', () => {
            window.location.href = `food.html?name=${encodeURIComponent(food.name)}`;
        });

        // foods-list 섹션에 음식 카드 추가
        foodsList.appendChild(foodCard);
    });
}



// ingredients.json 데이터 불러오기
fetch('ingredients.json')
    .then(response => response.json())
    .then(data => {
        const ingredientsList = document.getElementById('ingredients-list');
        data.forEach(ingredient => {
            const btn = document.createElement('button');
            btn.classList.add('ingredient-btn');

            const img = document.createElement('img');
            img.src = ingredient.image;
            img.alt = ingredient.name;
            img.classList.add('ingredient-img');

            const name = document.createElement('span');
            name.textContent = ingredient.name;

            btn.appendChild(img);
            btn.appendChild(name);

            btn.addEventListener('click', () => {
                btn.classList.toggle('selected');
                updateFoodList(); // 선택된 재료에 따라 음식 목록 업데이트
            });

            ingredientsList.appendChild(btn);
        });
    })
    .catch(error => console.error('Error loading ingredients:', error));

// 선택된 재료로 음식 목록 필터링
function updateFoodList() {
    const selectedIngredients = Array.from(document.querySelectorAll('.ingredient-btn.selected'))
        .map(btn => btn.textContent.toLowerCase());

    if (selectedIngredients.length === 0) {
        displayFoods(foods);
    } else {
        const filteredFoods = foods.filter(food =>
            selectedIngredients.every(ingredient =>
                food.ingredients.some(foodIngredient => foodIngredient.toLowerCase() === ingredient)
            )
        );
        displayFoods(filteredFoods);
    }
}

// 검색 기능
document.getElementById('search-btn').addEventListener('click', () => {
    const searchQuery = document.getElementById('food-search').value.toLowerCase();
    if (searchQuery === '') {
        updateFoodList();
    } else {
        const filteredFoods = foods.filter(food =>
            food.name.toLowerCase().includes(searchQuery)
        );
        displayFoods(filteredFoods);
    }
});

document.getElementById('food-search').addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        const searchQuery = document.getElementById('food-search').value.toLowerCase();
        if (searchQuery === '') {
            updateFoodList();
        } else {
            const filteredFoods = foods.filter(food =>
                food.name.toLowerCase().includes(searchQuery)
            );
            displayFoods(filteredFoods);
        }
    }
});