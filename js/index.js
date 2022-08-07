// элементы в DOM можно получить при помощи функции querySelector
const fruitsList = document.querySelector('.fruits__list'); // список карточек
const shuffleButton = document.querySelector('.shuffle__btn'); // кнопка перемешивания
const filterButton = document.querySelector('.filter__btn'); // кнопка фильтрации
const sortKindLabel = document.querySelector('.sort__kind'); // поле с названием сортировки
const sortTimeLabel = document.querySelector('.sort__time'); // поле с временем сортировки
const sortChangeButton = document.querySelector('.sort__change__btn'); // кнопка смены сортировки
const sortActionButton = document.querySelector('.sort__action__btn'); // кнопка сортировки
const kindInput = document.querySelector('.kind__input'); // поле с названием вида
const colorInput = document.querySelector('.color__input'); // поле с названием цвета
const weightInput = document.querySelector('.weight__input'); // поле с весом
const minWeightInput = document.querySelector('.minweight__input'); // поле с весом
const maxWeightInput = document.querySelector('.maxweight__input'); // поле с весом
const addActionButton = document.querySelector('.add__action__btn'); // кнопка добавления

let colorEngArray = ["purple", "green", "crimson", "yellow", "sandybrown", "olive", "orangered", "plum", "rosybrown", 
"tomato", "wheat", "yellowgreen", "red", "peachpuff", "orange", "lime"];
let colorRusArray = ["фиолетовый", "зеленый", "розово-красный", "желтый", "светло-коричневый", "оливковый", "оранжево-красный", "сливовый", 
"розово-коричневый", "томатный", "пшеничный", "желто-зеленый", "красный", "темно-персиковый", "оранжевый", "лайм"];

// список фруктов в JSON формате
let fruitsJSON = `[
  {"kind": "Мангустин", "color": "фиолетовый", "weight": 13},
  {"kind": "Дуриан", "color": "зеленый", "weight": 35},
  {"kind": "Личи", "color": "розово-красный", "weight": 17},
  {"kind": "Карамбола", "color": "желтый", "weight": 28},
  {"kind": "Тамаринд", "color": "светло-коричневый", "weight": 22}
]`;


// преобразование JSON в объект JavaScript
let fruits = JSON.parse(fruitsJSON);

//создание массива объектов, содержащих названия цветов на русском и английском языках
const colorRusEng = colorEngArray.map ((engFruit, index) => ({
  colorRus: colorRusArray[index],
  colorEng: engFruit

}));


//получение английского цвета из русского
function engColorFromRus (color) {
  return colorRusEng[colorRusEng.findIndex(el => el.colorRus == color)].colorEng
}

//получение русского цвета из английского
function rusColorFromEng (color) {
  return colorRusEng[colorRusEng.findIndex(el => el.colorEng == color)].colorRus
}


/*** ОТОБРАЖЕНИЕ ***/

// отрисовка карточек
const display = () => {
  // очищаем fruitsList от вложенных элементов,
  // чтобы заполнить актуальными данными из fruits
  fruitsList.innerHTML = "";
  
  
  
  for (let i = 0; i < fruits.length; i++) {
    // TODO: формируем новый элемент <li> при помощи document.createElement,
    // и добавляем в конец списка fruitsList при помощи document.appendChild
    let newLi = document.createElement("li");
    
    newLi.innerHTML = 
    `<div class="fruit__info">
      <div>index: ${i}</div>
      <div>kind: ${fruits[i].kind}</div>
      <div>color: ${fruits[i].color}</div>
      <div>weight (кг): ${fruits[i].weight}</div>
    </div>`;
   
    //newLi.className = `fruit__item fruit_${engColorFromRus(fruits[i].color)}`;
    newLi.className = `fruit__item`;
    //рисуем рамку соответствующего цвета
    newLi.style.background = engColorFromRus(fruits[i].color);
    fruitsList.appendChild(newLi);
  }
};

// первая отрисовка карточек
display();

/*** ПЕРЕМЕШИВАНИЕ ***/

// генерация случайного числа в заданном диапазоне
const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// перемешивание массива
const shuffleFruits = () => {
  let result = [];
  
  let initFruits = [];
  fruits.forEach(elem => initFruits.push(elem));
  
  
  let marker = true; //по умолчанию массив после перемешивания совпадает с изначальным
 
  while (fruits.length > 0) {
    // функция перемешивания массива
    //
    // находим случайный элемент из fruits, используя getRandomInt
    // вырезаем его из fruits и вставляем в result.
    // ex.: [1, 2, 3], [] => [1, 3], [2] => [3], [2, 1] => [], [2, 1, 3]
    // (массив fruits будет уменьшатся, а result заполняться)
    let randomIndex = getRandomInt(0, fruits.length - 1);
    result.push(fruits[randomIndex]);
    fruits.splice(randomIndex, 1);
    
  }

    //initFruits.forEach (elem => console.log(elem));
  result.forEach((element, index) => {if (element !== initFruits[index]) marker = false});
  
  if (marker) alert ("Массив совпадает с изначальным!");
  
  fruits = result;    
  
};

shuffleButton.addEventListener('click', () => {
  shuffleFruits();
  display();
});

/*** ФИЛЬТРАЦИЯ ***/

// фильтрация массива
const filterFruits = () => {
  //ввод данных по умолчанию при нечисловых значениях и отрицательном значении веса
  let minWeight = minWeightInput.value / 1 || 0;
  let maxWeight = maxWeightInput.value / 1 || 50;
  minWeight = minWeight < 0 ? 0 : minWeight;
  maxWeight = maxWeight < 0 ? 50 : maxWeight;

  const filteredFruits = fruits.filter(item => item.weight >= minWeight && item.weight <= maxWeight);
  minWeightInput.value = minWeight;
  maxWeightInput.value = maxWeight;
  return filteredFruits;    
  
};

filterButton.addEventListener('click', () => {
  fruits = filterFruits();
  
  display();
});

/*** СОРТИРОВКА ***/

let sortKind = 'bubbleSort'; // инициализация состояния вида сортировки
let sortTime = '-'; // инициализация состояния времени сортировки

const comparationColor = (fruit1, fruit2) => {
  //массив по цветам радуги
  const priority = ['красный', 'оранжево-красный', 'томатный', 'розово-красный', 'розово-коричневый', 'оранжевый', 'светло-коричневый', 
  'темно-персиковый', 'пшеничный', 'желтый',  'лайм', 'желто-зеленый', 'оливковый', 'зеленый',  'сливовый', 'фиолетовый'];
  const priority1 = priority.indexOf(fruit1.color);
  const priority2 = priority.indexOf(fruit2.color);
  return priority1 > priority2;
};

const sortAPI = {
  bubbleSort(arr, comparation) {
    // TODO: допишите функцию сортировки пузырьком
    const n = arr.length;
    // внешняя итерация по элементам
    for (let i = 0; i < n-1; i++) { 
        // внутренняя итерация для перестановки элемента в конец массива
        for (let j = 0; j < n-1-i; j++) { 
            // сравниваем элементы
            if (comparation(arr[j], arr[j+1])) { 
                
                [arr[j + 1], arr[j]] = [arr[j], arr[j + 1]];
            }
        }
    } 
  },

 
  quickSort(arr, comparation) {
    // TODO: допишите функцию быстрой сортировки
   // функция разделитель
    function partition(items, left, right) {
      var pivot = items[Math.floor((right + left) / 2)],
        i = left,
        j = right;
      while (i <= j) {
        while (comparation (pivot, items[i])) {
          i++;
        }

        while (comparation (items[j], pivot)) {
          j--;
        }

        if (i <= j) {
          [items[i], items[j]] = [items[j], items[i]];
          i++;
          j--;
        }
      }
      return i;
    }

    function quickSortAlgorithm (items, left, right) {
      var index;
  
      if (items.length > 1) {
      
        left = typeof left != "number" ? 0 : left;
        right = typeof right != "number" ? items.length - 1 : right;
        index = partition(items, left, right);
      
        if (left < index - 1) {
          quickSortAlgorithm(items, left, index - 1);
        }
      
        if (index < right) {
          quickSortAlgorithm(items, index, right);
        }
      }
  
      return items;
    }
   
    return quickSortAlgorithm (arr);
 
  }, //end quickSort

  // выполняет сортировку и производит замер времени
  startSort(sort, arr, comparation) {
    const start = new Date().getTime();
    sort(arr, comparation);
    const end = new Date().getTime();
    sortTime = `${end - start} ms`;
  },
};

// инициализация полей
sortKindLabel.textContent = sortKind;
sortTimeLabel.textContent = sortTime;

sortChangeButton.addEventListener('click', () => {
  // TODO: переключать значение sortKind между 'bubbleSort' / 'quickSort'
  sortKind = sortKind == 'bubbleSort' ? 'quickSort' : 'bubbleSort';
  sortKindLabel.textContent = sortKind;
});

sortActionButton.addEventListener('click', () => {
  // TODO: вывести в sortTimeLabel значение 'sorting...'
  sortTimeLabel.textContent = 'sorting...';
  const sort = sortAPI[sortKind];
  sortAPI.startSort(sort, fruits, comparationColor);
  display();
  // TODO: вывести в sortTimeLabel значение sortTime
  sortTimeLabel.textContent = sortTime;
});

/*** ДОБАВИТЬ ФРУКТ ***/

addActionButton.addEventListener('click', () => {
  // TODO: создание и добавление нового фрукта в массив fruits
  // необходимые значения берем из kindInput, colorInput, weightInput
  //добавлены условия на правильный ввод
  if (kindInput.value == '') {
    alert ('Не все поля заполнены!');
    kindInput.focus();
  } else if (weightInput.value == '') {
    alert ('Не все поля заполнены!');
    weightInput.focus();
  } else if (isNaN (weightInput.value / 1)) {
    alert ('В поле weight введено нечисловое значение!');
    weightInput.focus();
  } else if (weightInput.value < 0) {
    alert ('Вес не может быть отрицательным числом!');
    weightInput.focus();
  } else {
  let newFruit = {};
  //console.log(kindInput.value);
  newFruit.kind = kindInput.value;
  newFruit.color = rusColorFromEng(colorInput.value);
  newFruit.weight = weightInput.value / 1;
  
  fruits.push(newFruit);
  console.log(fruits);
  display();
  }
});
