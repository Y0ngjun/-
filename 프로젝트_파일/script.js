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
            btn.setAttribute('data-title', ingredient.name); // 툴팁에 표시할 이름 추가

            const img = document.createElement('img');
            img.src = ingredient.image;
            img.alt = ingredient.name;
            img.classList.add('ingredient-img');

            const name = document.createElement('span');
            name.textContent = ingredient.name;

            btn.appendChild(img);
            

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
        .map(btn => btn.getAttribute('title').toLowerCase());

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

// "오늘의 메뉴" 버튼 클릭 시 팝업 띄우기
document.getElementById('today-menu').addEventListener('click', () => {
    showPopup();
});

// 팝업 외부 영역을 클릭했을 때 팝업 닫기
document.getElementById('menu-popup').addEventListener('click', (event) => {
    // 팝업 외부 영역(음영)을 클릭한 경우만 팝업을 닫도록 설정
    if (event.target === event.currentTarget) {
        hidePopup();
    }
});

// 팝업 닫기 버튼 클릭 시 팝업 닫기
document.getElementById('close-popup').addEventListener('click', () => {
    hidePopup();
});

// 팝업 보여주는 함수
function showPopup() {
    const popup = document.getElementById('menu-popup');
    const recommendedFoodsContainer = document.getElementById('recommended-foods');

    // 오늘 날짜를 기반으로 랜덤 추천 메뉴 선택
    const dailyMenu = getDailyMenu();
    
    // 추천 메뉴를 카드 형태로 추가
    recommendedFoodsContainer.innerHTML = ''; // 기존 추천 메뉴 초기화
    dailyMenu.forEach(food => {
        const foodCard = document.createElement('div');
        foodCard.classList.add('food-card');
        
        const foodImage = document.createElement('img');
        foodImage.src = food.image || 'images/default-image.jpg';
        foodImage.alt = food.name;

        const blackBoxOverlay = document.createElement('div');
        blackBoxOverlay.className = 'black-box-overlay'; // 음식 이름 오버레이 클래스
        
        const foodName = document.createElement('div');
        foodName.className = 'food-name-overlay'; // 음식 이름 오버레이 클래스

        foodName.textContent = food.name;
        
        foodCard.appendChild(foodImage);
        foodCard.appendChild(blackBoxOverlay);
        foodCard.appendChild(foodName);
        
        recommendedFoodsContainer.appendChild(foodCard);
    });

    popup.style.display = 'flex'; // 팝업을 보이도록 설정
}

// 팝업 숨기기
function hidePopup() {
    const popup = document.getElementById('menu-popup');
    popup.style.display = 'none';
}

// 날짜 기반으로 고유한 메뉴 랜덤화
function getDailyMenu() {
    // 날짜를 기반으로 랜덤 시드를 설정
    const today = new Date();
    const seed = today.toISOString().slice(0, 10); // YYYY-MM-DD 형식

    // seed 값을 기반으로 랜덤화
    const random = Math.abs(hashCode(seed)) % foods.length;
    
    // 3개의 메뉴 추천 (랜덤하게 선택)
    const dailyMenu = [];
    for (let i = 0; i < 3; i++) {
        dailyMenu.push(foods[(random + i) % foods.length]); // 연속적인 메뉴 추천
    }

    return dailyMenu;
}

// 문자열을 숫자로 변환하는 함수 (시드 값을 해시로 변환)
function hashCode(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const character = str.charCodeAt(i);
        hash = (hash << 5) - hash + character;
    }
    return hash;
}
