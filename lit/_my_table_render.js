// fff.js
export async function my_table_render(T) {
    if(!T.old_candidates || !T.old_candidates.length) return;

    // Получаем уникальные значения из this.old_candidates
    var mirror_ids = [...new Set(T.old_candidates.map(x => x.mirror_id))];
    if(!mirror_ids || !mirror_ids.length) return;

    // Оставляем только те, которых нет в mirrors
    var need = mirror_ids.filter(x => !KUVI.mirrors[x]);
    if(need.length) { // подгрузим недостающие
            var new_mirrors = await KUVIO.API('get_mirrors',{mirror_ids:need});
            if(new_mirrors) KUVI.mirrors = { ...KUVI.mirrors, ...new_mirrors.mirrors };
    }

    console.log("T.old_candidates.find",T.old_candidates);

    mirror_ids.forEach(audit_id => {

	// Найдем все данные аудита
	const audit = Object.values(KUVI.mirrors).find(item => item._id === audit_id);

	// Разметим место под таблицу
	var e = T.shadowRoot.querySelector(`#table_${audit_id}`);
	// e.style.width='100%';
	e.innerHTML = `
    <h2>${h(audit.name)}</h2>
    <div class="r">${h(audit.about)}</div>
    <div style='width:100%;' id='tb_${audit_id}'></div>
`;

	// выбираем всех кандидатов для этого аудита
	const candidates = T.old_candidates.filter(item => item.mirror_id === audit_id);

	// Создадим дату
	var data = candidates.map(r => [
		r.login,
		...(r.values?r.values:[]),
		r.result
	    ]);

	// Функция-фабрика для создания форматтера с сохранённым номером
	const createFormatter = (i) => {
	    return function(cell) {
		if(!cell) cell='null';
		// if(!i) return i+': '+cell; // ghtml(`Formatted: ${cell}`); // ghtml(`<b>${cell}</b>`);
		const type = audit.rules[i].type;
		if(type=='yn') return 1*cell ? 'Yes' : 'No';
		if(type=='scale') return 1*cell +'%';
		if(type=='select') {
		    var key = cell.indexOf(1);
		    if(key<0) return '';
		    return `${audit.rules[i].names[key]}`;
		}
		if(type=='multi') {
		    var res = [];
		    if(cell.forEach) cell.forEach((v, key) => {
			if(v) res.push(audit.rules[i].names[key]);
		    });
		    return res.join(', ');
		}
    		return 'err'; // ghtml(`Column [${audit_id}] ${i+1}: ${cell}`); // Пример использования индекса
	    };
	};

	var columns = audit.rules.map((r, i) => {
	    const n = h( r.name.split(' ')[0] );
	    return {
		// id: n,
		name: n,
		formatter: createFormatter(i), // Используем фабрику форматтера
	    }
	  }
	);
	columns = [
		{
		    name: 'Name',
        	    formatter: (cell) => {
        		return ghtml(`<div class='mv0' onclick="alert('c')"><u>${h(cell)}</u></div>`);
    		    },
		},
		...columns,
		{
		    name: 'Result',
        	    formatter: (cell) => {
			var n='';
			// if(!cell) n='Rejected';
			// else if(cell==1) n='Evaluated';
        		return ghtml(`<div class='mv0' onclick="alert('c')"><u>${n}</u></div>`);
    		    },
		},
	];

	var elem = T.shadowRoot.querySelector('#tb_'+audit_id);
        const grid = new window.Grid({
                search: { selector: (cell, rowIndex, cellIndex) => cellIndex === 0 ? cell.firstName : cell },
                pagination: { limit: 20 },
                sort: true,
                resizable: true,
                fixedHeader: true,
		// height: '400px',
		// "max-height": '40px',
                columns: columns,
        	data: data,
    	});
        grid.render(elem);

    // grid.on('rowClick', (...args) => console.log('row: ' + JSON.stringify(args), args));
    grid.on('cellClick', (...args) => {
	    if(args[2].id != 'name') return;
	    console.log('cell: ' + JSON.stringify(args), args);
	}
    );


    });

}

/*
{
  "time": 1731542911,
  "unic": "a3IZTNyJ2cPD2A9G",
  "audit_id": "w9NrFJWTPJ7VyZuV",
  "rules": [  ],
  "asks": [  ],
  "blake3": "b25cb65f4adfacdc69f95d3faab6ae20bbb29753e9908ff362c7cb307357a027",
  "name": "Некрасивые люди",
  "about": "Киностудия ищет некрасивых и уродливых актеров. Мы снимаем кино, которое повышает самооценку зрителя. Для этого нам нужны максимально уродливые актеры.",
  "_id": "k8F2daBRlgVXi0Du",

  "XXX": {
    "unic": "a3IZTNyJ2cPD2A9G",
    // "auditor_unic": "a3IZTNyJ2cPD2A9G",
    "audit_blake3": "b25cb65f4adfacdc69f95d3faab6ae20bbb29753e9908ff362c7cb307357a027",
    "mirror_id": "k8F2daBRlgVXi0Du",
    "asks": [],
    "time": 1731542911,
    "_id": "pXQ7D897eqH7H3Xy",
    "values": [],
    "result": 0,
    "result_time": 1731544748,
    "login": "lleo"
  }
}
    // grid.on('rowClick', (...args) => console.log('row: ' + JSON.stringify(args), args));
    // grid.on('cellClick', (...args) => console.log('cell: ' + JSON.stringify(args), args));
*/

