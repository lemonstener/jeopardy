const button = document.querySelector('button');
button.addEventListener('click', function (e) {
    showLoadingView();
    setupAndStart();
    e.target.setAttribute('id', 'aside');
    e.target.innerText = 'RESTART';
})


const categories = [];


async function getCategoryIds() {
    const idArray = [];
    while (idArray.length <= 5) {
        const random = Math.floor((Math.random() * 18418) + 1);
        if (!idArray.includes(random)) {
            idArray.push(random);
        }
    }
    for (let num of idArray) {
        await getCategory(num);
    }
    fillTable(categories);
}


async function getCategory(catId) {
    const res = await axios.get(`https://jservice.io/api/category?id=${catId}`);
    const questions = [];
    const category = {
        title: res.data.title
    };
    const clues = res.data.clues;

    for (let i = 0; i < 5; i++) {
        const question = {
            question: clues[i].question,
            answer: clues[i].answer
        }
        questions.push(question);
    }
    category.clues = questions;
    categories.push(category);

}


function fillTable(arr) {
    for (let i = 0; i < categories.length; i++) {
        const th = document.getElementById(i);
        th.innerText = categories[i].title;
    }

    for (let j = 0; j < 6; j++) {
        for (let i = 0; i < 5; i++) {
            const tr = document.getElementById('tr-' + i);
            const td = document.getElementById(`${j}-${i}`);
            td.innerText = '?';
        }
    }
}


function handleClick(e) {
    const arr = [];
    const value = e.target.id;
    for (let sym of value) {
        arr.push(sym);
    };
    if (e.target.innerText === '?') {
        e.target.innerText = categories[arr[0]].clues[arr[2]].question;
    } else {
        e.target.innerHTML = categories[arr[0]].clues[arr[2]].answer;
        e.target.style.backgroundColor = '#28a200';
    };
}

/** Wipe the current Jeopardy board, show the loading spinner,
 * and update the button used to fetch data.
 */

function showLoadingView() {
    for (let i = 0; i < 6; i++) {
        categories.pop();
    }

    try {
        document.querySelector('table').remove();
    } catch (error) {
        console.log('No table to remove');
    }
}

/** Remove the loading spinner and update the button used to fetch data. */

function hideLoadingView() {
}

function setupAndStart() {
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');
    const topRow = document.createElement('tr');


    for (let i = 0; i < 6; i++) {
        const th = document.createElement('th');
        th.setAttribute('id', i);
        topRow.append(th);
    }


    for (let i = 0; i < 5; i++) {
        const tr = document.createElement('tr');
        tr.setAttribute('id', 'tr-' + i);
        tbody.append(tr);
    }


    table.append(thead)
    thead.append(topRow);
    table.append(tbody);
    document.body.prepend(table);
    for (let j = 0; j < 6; j++) {
        for (let i = 0; i < 5; i++) {
            const tr = document.getElementById('tr-' + i);
            const td = document.createElement('td');
            td.addEventListener('click', handleClick);
            td.setAttribute('id', `${j}-${i}`);
            tr.append(td)
        }
    }
    getCategoryIds();
}



