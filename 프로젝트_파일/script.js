// ingredients.json 파일에서 식재료 데이터를 가져옴
fetch('ingredients.json')
    .then(response => response.json())  // JSON 데이터를 파싱
    .then(data => {
        const ingredientsList = document.getElementById('ingredients-list');

        // 각 재료에 대해 div를 만들어서 추가
        data.forEach(ingredient => {
            const ingredientDiv = document.createElement('div');
            ingredientDiv.classList.add('ingredient');  // 스타일링을 위한 클래스 추가

            // 이미지와 이름을 담을 div 생성
            const img = document.createElement('img');
            img.src = ingredient.image;  // 이미지 경로
            img.alt = ingredient.name;
            img.classList.add('ingredient-img');  // 스타일링을 위한 클래스 추가

            const name = document.createElement('p');
            name.textContent = ingredient.name;

            // 이미지를 div에 넣고, 다시 ingredients-list에 추가
            ingredientDiv.appendChild(img);
            ingredientDiv.appendChild(name);
            ingredientsList.appendChild(ingredientDiv);
        });
    })
    .catch(error => console.error('Error loading ingredients:', error));

// foods.json 파일에서 메뉴 데이터를 가져옴
fetch('foods.json')  // foods.json 파일을 가져옵니다
    .then(response => response.json())  // JSON 데이터를 파싱
    .then(data => {
        const menuList = document.getElementById('foods-list');  // 메뉴를 추가할 영역

        // 각 음식에 대해 div를 만들어서 추가
        data.forEach(food => {
            const foodDiv = document.createElement('div');
            foodDiv.classList.add('food');  // 스타일링을 위한 클래스 추가

            // 음식 이름을 담을 p 태그 생성
            const name = document.createElement('p');
            name.textContent = food.name;  // 음식 이름

            // 음식 이름을 div에 넣고, 다시 menu-list에 추가
            foodDiv.appendChild(name);
            menuList.appendChild(foodDiv);
        });
    })
    .catch(error => console.error('Error loading menu:', error));
