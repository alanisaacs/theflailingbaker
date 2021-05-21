// JavaScript for The Flailing Baker

// Generic Table Functions

// COPIED FROM SCRIPTS_ATL, DIVERGED
function set_table(table, data, ...cols) {
    // Generate a table element
	// Parameters: table reference, array_of_objects, column names
	// Create header row with column names inside
	let thead = table.createTHead();
	let row = thead.insertRow(-1);
	for (col of cols) {
		let th = document.createElement('th');
		let text = document.createTextNode(col.toUpperCase());
		th.appendChild(text);
		row.appendChild(th);
	}
	// TODO FIX THIS so column index isn't hard coded
	row.cells[3].setAttribute('hidden', true);
	// Write each row of data into the table body
	let tbody = table.createTBody();
	for (d of data) {
		row = tbody.insertRow(-1);
		for (col of cols) {
			let cell = row.insertCell(-1);
			cell.innerHTML = d[col];
			// Add attribute to track column header
			cell.setAttribute('col_head', col);
			if (col === 'notes') {
				cell.setAttribute('hidden', true);
			}
		}
	}
}

function toggleShowAllNotes() {
	// See if notes column in header is visible
	// TODO un-hardcode the column index
	let notesHeader = document.getElementById('tools').rows[0].cells[3]
	let isHidden = notesHeader.getAttribute('hidden');
	let tds = document.querySelectorAll('td');
	if (isHidden) { 
		// Unhide the notes column
		notesHeader.removeAttribute('hidden');
		for (td of tds) td.removeAttribute('hidden');
	} else {
		// Hide the notes column
		notesHeader.setAttribute('hidden', true);
		for (td of tds) {
			if (td.getAttribute('col_head') === 'notes') {
				td.setAttribute('hidden', true);
			}
		}
	}
}

// Cell editing procedure based on The Codeholic
// https://www.youtube.com/watch?v=K6IH25Vf8ZA

function init_editing(tbl) {
    // Create class instance to handle editing cells and initialize
    const edit_tools = new TableCellEditing(
		document.getElementById(tbl));
    edit_tools.init();
} 

class TableCellEditing {
    // Constructor for class; assumes one table on the page
    // which has already been propagated
    constructor(table) {
        this.tbody = table.querySelector('tbody');
    }

    init() {
        // Initialize instance; make all cells editable
        // and listen for clicks
        this.tds = this.tbody.querySelectorAll('td');
        this.tds.forEach(td => {
            td.setAttribute('contentEditable', true);
            td.addEventListener('click', (ev) => {
                // Check if cell is already being edited
                // If not, then start
                if (!this.inEditing(td)) {
                    this.startEditing(td);
                }
            });
        });
    }
    
    startEditing(td){
        // Find any cells now being edited and cancel editing
        const active_td = this.findEditing();
        if (active_td) {
            this.cancelEditing(active_td);
        }
        // Flag as in editing set in td class
        td.classList.add('in-editing');
        // Original content stored in attribute
        td.setAttribute('block-orig', td.innerHTML);
        // Process for editing
        td.innerHTML = markup_for_editing(td.innerHTML);
        // Show the Save and Cancel buttons
        this.createButtonToolbar(td);
    }

    cancelEditing(td){
        // Cancel function: discard any changes
        td.innerHTML = td.getAttribute('block-orig');
        td.classList.remove('in-editing');
    }

    finishEditing(td){
        // Save function: remove buttons and save to DB
        td.classList.remove('in-editing');
        this.removeToolbar(td);
        // Markup text for display and also storage
        let tagged_text = markup_for_display(td.innerHTML);
        // Get id for record from the row cell
        let record_id = td.parentNode.children[0].innerText;
        // Get column header (key) from td attribute
        let col_head = td.getAttribute('col_head');
        // Format POST as json to keep formatting
        let postjson = {'id': record_id};
        postjson[col_head] = tagged_text;
        // ISSUE: when col_head is 'id' it overwrites--albeit
        // with the same data--the record_id 'id'
        // Post to server
        fetch('/update_cell', {
            method: 'POST',
            headers: new Headers({"Content-Type": "application/json"}),
            body: JSON.stringify(postjson)
        })
        .then(response => {
            // First response is headers
            // for (let [k, v] of response.headers) {
            //     console.log(`${k}: ${v}`)
            // };
            // Not sure why response has to be returned
            return response.json();
        }
        )
        .then(message => {
            // Next response is returned by server function
            if (message.status === 'ok') {
                td.innerHTML = tagged_text;
            } else {
                td.innerHTML = tagged_text;
                alert("Sorry, an error may have occured while saving." +
                    " Try refreshing the page")
            }
        })
        .catch(err => {
            // This will catch 404s etc.
            let err_message = err;
            alert(`Error: ${err}`);
        });
        // Display properly
    }

    inEditing(td){
        // True if the cell is flagged as in editing
        return td.classList.contains('in-editing');
    }

    createButtonToolbar(td){
        // Add Save and Cancel buttons to the cell
        const toolbar = document.createElement('div');
        toolbar.className = 'button-toolbar';
        // Override cell's editable attribute so buttons aren't editable
        toolbar.setAttribute('contentEditable', false);
        toolbar.innerHTML = `
        <button class="btn btn-save">Save</button>
        <button class="btn btn-cancel">Cancel</button>
        `
        td.appendChild(toolbar);
        // Add listeners to the buttons
        const btn_save = toolbar.querySelector('.btn-save');
        const btn_cancel = toolbar.querySelector('.btn-cancel');
        btn_save.addEventListener('click', (ev) => {
            // Don't pass click event on to td listener
            ev.stopPropagation();
            this.finishEditing(td);
        })
        btn_cancel.addEventListener('click', (ev) => {
            ev.stopPropagation();
            this.cancelEditing(td);
        })
    }

    removeToolbar(td){
        // Remove buttons from cell
        const toolbar = td.querySelector('.button-toolbar');
        toolbar.remove();
    }

    findEditing(){
        // Search all tds and return an array of those being edited
        return Array.prototype.find.call(this.tds, td => this.inEditing(td));
    }
}

function markup_for_display(str) {
    // Convert double hyphens to em dashes
    let s = str.replace(/--/g, '&mdash;');
    // Allow tags to work without showing
    s = s.replace(/&lt;/g, '<');
    s = s.replace(/&gt;/g, '>');
    return s;
}

function markup_for_editing(str) {
    // Keep <br> tags by temporarily replacing < and >
    let s = str.replace(/<br>/g, '=br=')
    // Show tags
    s = s.replace(/</g, '&lt;');
    s = s.replace(/>/g, '&gt;');
    // Now bring back <br>
    s = s.replace(/=br=/g, '<br>')
    return s;
}