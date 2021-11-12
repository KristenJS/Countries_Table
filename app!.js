
const appRoot = document.getElementById('app-root');
const divTitle = document.createElement('div');
    divTitle.className = 'title';
    divTitle.innerHTML = 'Countries Search';
    appRoot.append(divTitle);

const contentBlock = document.createElement('div');
    contentBlock.classList.add('content');
    appRoot.append(contentBlock);

const form1 = document.createElement('form');
    form1.className = 'form1';
    divTitle.after(form1);

const titleRadioBtn = document.createElement('titleRadioBtn');
    titleRadioBtn.innerHTML = 'Please choose the type of search:';
    form1.append(titleRadioBtn);

const fieldRadioBtn = document.createElement('fieldRadioBtn');
    fieldRadioBtn.className = 'field';
    form1.append(fieldRadioBtn);

const radiobox1 = document.createElement('input');
    radiobox1.type = 'radio';
    radiobox1.value = 'regions';
    radiobox1.className = 'radioinput';
    radiobox1.name = 'check';
const label1 = document.createElement('label')
    label1.htmlFor = 'region';
const description1 = document.createTextNode('By Region');
    label1.appendChild(description1);
const newline = document.createElement('br');
    fieldRadioBtn.appendChild(radiobox1);
    fieldRadioBtn.appendChild(label1);
    label1.appendChild(newline);

const radiobox2 = document.createElement('input');
    radiobox2.type = 'radio';
    radiobox2.value = 'lang';
    radiobox2.className = 'radioinput';
    radiobox2.name = 'check';
const label2 = document.createElement('label');
    label2.htmlFor = 'language';
const description2 = document.createTextNode('By Language');
    label2.appendChild(description2);
    fieldRadioBtn.appendChild(radiobox2);
    fieldRadioBtn.appendChild(label2);

const form2 = document.createElement('form');
    form2.className = 'form2';
    form1.after(form2);

const titleSelect = document.createElement('titleSelect');
    titleSelect.innerHTML = 'Please choose search query:';
    form2.append(titleSelect);

const selectList = document.createElement('select');
    selectList.className = 'selectList';
    form2.append(selectList);
const optionT = document.createElement('option');
    optionT.value = 'Select value';
    optionT.text = 'Select value';
    selectList.appendChild(optionT);
    selectList.disabled = true;


const state = {
    search: false,
    query: false,
    textStartSearchQuery: 'No items, please choose search query',
    regions: externalService.getRegionsList(),
    lang: externalService.getLanguagesList(),
    content: '',
    sortMethods: {
        regions: externalService.getCountryListByRegion,
        lang: externalService.getCountryListByLanguage
    },
    sortColumns: [
        'name',
        'capital',
        'region',
        'languages',
        'area',
        'flagURL'
    ],
    sort: false,
    sortByColumn: false,
};

state.content = `<p align='center'>${state.textStartSearchQuery}</p>`;

[radiobox1, radiobox2].forEach(
    function(element){
        element.addEventListener('click', function(e) {
            const item = e.currentTarget;
            state.search = item.value;

            contentBlock.innerHTML = state.content;

            selectList.disabled = false;

            const listData = state[state.search];
           
            let option = '';
            listData.forEach((itm) => {
                option += `<option value="${itm}">${itm}</option>`;
            });
            selectList.innerHTML = `<option>${optionT.value}</option> ${option}`;
        }, false)
    }
);

selectList.onchange = function(item) {
    const select = item.currentTarget;
    state.query = select.value;
   
    contentBlock.innerHTML = generateTableData();
};


const generateTableData = function() {
    const columnsNames = [
        {name: 'Column name'},
        {capital: 'Capital'},
        {region: 'World region'},
        {languages: 'Languages'},
        {area: 'Area'},
        {flagURL: 'Flag'}
    ];

    const headerRows = generateTheadRow(columnsNames, 'th');

    let bodyData = state.sortMethods[state.search](state.query);

    if (state.sort) {
        bodyData = sortByColumnName(bodyData)
    }

    const bodyRows = generateBodyRow(bodyData);

    return ` <table class='table'>
            <thead>
                <tr>
                    ${headerRows}
                <tr>
            </thead>
            <tbody>
                <tr>
                    ${bodyRows}
                </tr>
            </tbody>
        </table>
    `;
};

const generateTheadRow = function(data, tag = 'tr') {
    let row = '';
    const sortColumns = ['name', 'area'];
    let arrow = '&#x279D;';

    data.forEach(function(item) {
    
        let _arrow = '';
        const [_key, _value] = Object.entries(item)[0];

        if (sortColumns.includes(_key)) {
            let className = '';
            switch (state.sort) {
                case 'asc':
                    className = 'sort-arrow--asc';
                    break;
                case 'desc':
                    className = 'sort-arrow--desc';
                    break;
            }

            _arrow = `<span class='sort-arrow ${className}'>
            <span data-sort-by='${_key}' class='arrow'>${arrow}</span>
            </span>`;
        }

        row += `<${tag}>${_value} ${_arrow}</${tag}>`;
    });

    return row;
}

const generateBodyRow = function(data) {
    let row = '';
    
    data.forEach(function(item) {
        let content = '';
        Object.entries(sortFn(item)).forEach(function([key, value]){
            content += `<td>${getValueFromObj(key, value)}</td>`
        });
            row += `<tr>${content}</tr>`;
    });

    return row;
}

const getValueFromObj = function(key, value) {
    switch(key) {
        case 'flagURL':
            return `<img src='${value}' width='50px'>`;
        case 'languages':
            return getLanguages(value);
        default:
            return value;
    }
}

const getLanguages = function(value) {
    let lang = '';
    Object.values(value).forEach(function(_lang){
        lang += _lang + ' '
    });
    return lang;
}

const sortFn = function(data) {
    const sortObj = {};
    state.sortColumns.forEach(function(sortKey) {
        sortObj[sortKey] = data[sortKey]
    });
    return sortObj;
}

const sortByColumnName = function(bodyData) {
    const sortArray = [];
    bodyData.forEach(function(item) {
        sortArray.push(item[state.sortByColumn]);
    });

    if (state.sortByColumn === 'area') {
        sortArray.sort(function(a, b) {
            return a - b;
        })   
    } else {
        sortArray.sort();
    }

    if (state.sort === 'desc') {
        sortArray.reverse();
    }

    let _bodyData = [];
    sortArray.forEach(function(nameValue) {
        bodyData.forEach(function(item) {
            if (item[state.sortByColumn] === nameValue) {
                _bodyData.push(item);
            }
        });
    });
    return _bodyData;
};

appRoot.addEventListener('click', function(item) {
    const arrow = item.target;
    if (arrow.classList.contains('arrow')) {
        switch (state.sort) {
            case false:
                state.sort = 'desc';
                break;
            case 'desc':
                state.sort = 'asc';
                break;
            case 'asc':
                state.sort = 'desc';
                break;
        }
        state.sortByColumn = arrow.getAttribute('data-sort-by');
        contentBlock.innerHTML = generateTableData();
    }
});
