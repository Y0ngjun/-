// 전역 변수 선언
let foods = [];

// foods.json 데이터 불러오기
fetch('foods.json')
    .then(response => response.json())
    .then(data => {
        foods = data;

        // 로컬스토리지에서 사용자 추가 메뉴 가져오기
        const userMenus = JSON.parse(localStorage.getItem('menus')) || [];
        const allMenus = [...foods, ...userMenus];
        foods = allMenus;

        // 초기 화면에 모든 음식 표시
        displayFoods(foods);
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
        .map(btn => btn.getAttribute('data-title').toLowerCase());

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




// -----------------------------
// 팝업 제어 및 메뉴 추가 코드
// -----------------------------


// 팝업 보여주는 함수 (공통)
function showPopup(title, contentGenerator) {
    const popup = document.getElementById('menu-popup');
    const popupTitle = popup.querySelector('h2'); // 팝업 제목
    const recommendedFoodsContainer = document.getElementById('recommended-foods');

    // 제목 업데이트
    popupTitle.textContent = title;

    // 내용 업데이트 (카드 생성)
    recommendedFoodsContainer.innerHTML = ''; // 기존 메뉴 초기화
    contentGenerator(recommendedFoodsContainer);

    // 팝업 표시
    popup.style.display = 'flex';
}

// 팝업 외부 영역을 클릭했을 때 팝업 닫기
document.getElementById('menu-popup').addEventListener('click', (event) => {
    // 팝업 외부 영역(음영)을 클릭한 경우만 팝업을 닫도록 설정
    if (event.target === event.currentTarget) {
        document.getElementById('menu-popup').style.display='none';
    }
});

// 팝업 닫기 버튼 클릭 시 팝업 닫기
document.getElementById('close-popup').addEventListener('click', () => {
    document.getElementById('menu-popup').style.display='none';
});

// 음식 카드를 생성하여 컨테이너에 추가
function addFoodCard(container, food) {
    const foodCard = document.createElement('div');
    foodCard.classList.add('food-card');

    const foodImage = document.createElement('img');
    foodImage.src = food.image || 'images/default-image.jpg';
    foodImage.alt = food.name;

    const blackBoxOverlay = document.createElement('div');
    blackBoxOverlay.className = 'black-box-overlay';

    const foodNameOverlay = document.createElement('div');
    foodNameOverlay.className = 'food-name-overlay';
    foodNameOverlay.textContent = food.name;

    // 클릭 이벤트 추가
    foodCard.addEventListener('click', () => {
        window.location.href = `food.html?name=${encodeURIComponent(food.name)}`;
    });

    foodCard.appendChild(foodImage);
    foodCard.appendChild(blackBoxOverlay);
    foodCard.appendChild(foodNameOverlay);
    container.appendChild(foodCard);
}


// -----------------------------
// 오늘의 메뉴 관련 코드
// -----------------------------


// 날짜 기반으로 고유한 메뉴 랜덤화
function getDailyMenu() {
    const today = new Date();
    const seed = today.toISOString().slice(0, 10); // YYYY-MM-DD 형식
    const random = Math.abs(hashCode(seed)) % foods.length;

    // 3개의 메뉴 추천 (랜덤 선택)
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

// "오늘의 메뉴" 버튼 클릭 이벤트
document.getElementById('today-menu').addEventListener('click', () => {
    showPopup("오늘의 메뉴", (container) => {
        const dailyMenu = getDailyMenu();
        dailyMenu.forEach(food => addFoodCard(container, food));
    });
});


// -----------------------------
// 최근 본 메뉴 관련 코드
// -----------------------------


// "최근 본 메뉴" 버튼 클릭 이벤트
document.getElementById('recent-menu').addEventListener('click', () => {
    showPopup("최근 본 메뉴", (container) => {
        const recentMenu = JSON.parse(localStorage.getItem('recentMenu')) || [];
        recentMenu.forEach(foodName => {
            const food = foods.find(item => item.name === foodName);
            if (food) addFoodCard(container, food);
        });
    });
});

// 페이지 로드 시 URL에서 음식 이름 처리
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const foodName = urlParams.get('name');
    if (foodName) {
        saveToRecentMenu(foodName); // 메뉴 저장
    }
});

// URL에서 음식 이름(name 파라미터) 추출 및 최근 본 메뉴에 저장
function handleFoodNameFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const foodName = urlParams.get('name');
    if (foodName) saveToRecentMenu(foodName);
}

// 페이지가 처음 로드될 때 URL에서 음식 이름 처리
document.addEventListener('DOMContentLoaded', handleFoodNameFromURL);

// 브라우저 히스토리에서 상태(popstate) 변경 시 URL에서 음식 이름 처리
window.addEventListener('popstate', handleFoodNameFromURL);


// -----------------------------
//메뉴 추가하기 관련 코드
// -----------------------------


// "메뉴추가" 버튼 클릭 이벤트
document.getElementById('add-menu').addEventListener('click', () => {
    const popup = document.getElementById('add-menu-popup');
    popup.style.display = 'flex';

    document.body.classList.add('no-scroll');

    // 폼 초기화 (이전에 작성한 내용 지우기)
    const foodForm = document.getElementById('food-form');
    foodForm.reset();  // 폼 내용 초기화
});

// 팝업 외부 영역을 클릭했을 때 팝업 닫기
document.getElementById('add-menu-popup').addEventListener('click', (event) => {
    // 팝업 외부 영역(음영)을 클릭한 경우만 팝업을 닫도록 설정
    if (event.target === event.currentTarget) {
        document.getElementById('add-menu-popup').style.display= 'none';
        document.body.classList.remove('no-scroll');
    }
});

// 팝업 닫기 버튼 클릭 시 팝업 닫기
document.getElementById('add-close-popup').addEventListener('click', () => {
    document.getElementById('add-menu-popup').style.display= 'none';
    document.body.classList.remove('no-scroll');
});

// 폼 제출 이벤트 처리
document.getElementById('food-form').addEventListener('submit', function (event) {
    event.preventDefault(); // 폼 제출 막기

    // 폼 데이터 가져오기
    const menuName = document.getElementById('menu-name').value;
    const ingredients = document.getElementById('ingredients').value;
    instructions = document.getElementById('recipe').value; // 레시피 내용
    const foodImage = document.getElementById('food-image').value;
    const videoUrl = document.getElementById('video-url').value;
    const tags = Array.from(document.querySelectorAll('input[name="tags"]:checked')).map(tag => tag.value);

    // 줄바꿈 문자를 <br>로 교체
    instructions = instructions.replace(/\n/g, '<br>');

    // 재료를 쉼표로 나누어 배열로 만들기
    const ingredientList = ingredients.split(',').map(ingredient => ingredient.trim());

    // 음식 데이터 객체 만들기
    const menuData = {
        name: menuName,
        ingredients: tags,
        recipeingredients: ingredientList, // 레시피 재료 리스트
        instructions: instructions,
        image: foodImage, // 음식 이미지 파일 이름 저장
        video: videoUrl
    };

    // 로컬스토리지에 저장
    let menus = JSON.parse(localStorage.getItem('menus')) || [];
    menus.push(menuData);
    localStorage.setItem('menus', JSON.stringify(menus));

    // 메인 화면 음식 목록 업데이트
    displayFoods([...foods, ...menus]);

    document.getElementById('add-menu-popup').style.display= 'none';
    document.body.classList.remove('no-scroll');
});

