// JavaScript for The Flailing Baker

// ======= DISPLAY IN DIVS =======

function display_recipe(steps, substeps, variables, metrics) {
    // Inputs: Each parameter is an array of objects
    // each object is a row in the db with columns as keys
    // The whole recipe container is defined in the html
    const recipeBox = document.getElementById('recipeBox');
    recipeBox.className = 'collectionBox';
    for (step of steps) {
        // Create and display the "box" the step lives in
        const stepBox = document.createElement('div');
        stepBox.className = 'itemBox';
        stepBox.innerHTML = `Step ${step.step}. ${step.name}`;
        recipeBox.appendChild(stepBox);
        // Inside the step box, make a new box for the description
        const stepdesc = document.createElement('div');
        stepdesc.className = 'itemDesc';
        stepdesc.innerHTML = convertUserMarkup(step.description);
        stepBox.appendChild(stepdesc);
        // Under the description, insert a box for substeps
        for (substep of substeps) {
            if (substep.step_id === step.step_id) {
                const subBox = document.createElement('div');
                subBox.className = 'subBox';
                subBox.innerHTML = 
                    `${step.step}.` +
                    `${substep.substep} - ` +
                    `${substep.description}`;
                stepBox.appendChild(subBox);
            }
        }
        // DIV for box containing all notes for the item
        // In this case the notesBox is a wrapper for
        // the three kinds of notes: step, metric, variable
        // so it is not constructed with createNotesBox()
        const notesBox = document.createElement('div');
        notesBox.className = 'notesBox';
        notesBox.setAttribute('hidden', true);
        // DIV with button for toggling visibility of notes
        const btnBar = createShowHideBtnBar(notesBox)
        // Appears above notesBox itself
        stepBox.appendChild(btnBar);
        stepBox.appendChild(notesBox);
        // DIV for notes on the step itself
        // Note createNotesBox does too much
        // Create title bar
        let notesBar = document.createElement('div');
        notesBar.className = 'notesBar';
        notesBar.innerHTML = 'Notes'
        notesBox.appendChild(notesBar);
        // Create box for notes on the step
        const stepNotesBox = document.createElement('div');
        stepNotesBox.className = 'itemNotes';
        let stepNoteText = convertUserMarkup(step.notes);
        stepNoteText = markup_multiline_notes(stepNoteText);
        stepNotesBox.innerHTML = `<ul>${stepNoteText}</ul>`;
        notesBox.appendChild(stepNotesBox);
        // Display Metrics if there are any
        let hasMetric = false;
        const metricsBox = document.createElement('div');
        metricsBox.className = 'metricsBox';
        // Metrics DIV has children for both title and body
        const metricsListBody = document.createElement('div');
        metricsListBody.className = 'notesListBody';
        // Body is composed of ULs (can be nested)
        const metricslist = document.createElement('ul');
        for (metric of metrics) {
            if (metric.step_id === step.step_id) {
                // Found the first metric, so create box for it
                // including title bar
                if (hasMetric === false) {
                    const metricsTitleBar = document.createElement('div');
                    metricsTitleBar.className = 'notesBar';
                    metricsTitleBar.innerHTML = 'What to Look For';
                    metricsBox.appendChild(metricsTitleBar);
                    metricsBox.appendChild(metricsListBody);
                    metricsListBody.appendChild(metricslist);
                    // Toggle flag so header is written just once
                    hasMetric = true;
                }
                const onemetric = document.createElement('li');
                let listStr = `<strong>${metric.name}</strong>`;
                if (metric.description) {
                    listStr += `<ul>`;
                    listStr +=
                    `<li>${metric.description}`;
                    if (metric.notes) {
                        listStr += markup_multiline_notes(metric.notes);
                    }
                    listStr += `</ul>`;
                }
                onemetric.innerHTML = listStr;
                metricslist.appendChild(onemetric);
            }
        }
        // If there are metrics, write their box inside notesBox
        if (hasMetric === true) {
            notesBox.appendChild(metricsBox);
        }
        // Create box for variables just like for metrics
        let hasVar = false;
        const varBox = document.createElement('div');
        varBox.className = 'varBox';
        const varListBody = document.createElement('div');
        varListBody.className = 'notesListBody';
        const varlist = document.createElement('ul');
        for (variable of variables) {
            if (variable.step_id === step.step_id) {
                // Found the first variable, so write header
                if (hasVar === false) {
                    // Add a title bar
                    const variablesTitleBar = document.createElement('div');
                    variablesTitleBar.className = 'notesBar';
                    variablesTitleBar.innerHTML = 'Variables';
                    varBox.appendChild(variablesTitleBar);
                    varBox.appendChild(varListBody);
                    varListBody.appendChild(varlist);
                    // Toggle flag so header is written just once
                    hasVar = true;
                }
                const onevar = document.createElement('li');
                let listStr = `<strong>${variable.name}</strong>`;
                if (variable.description) {
                    listStr += `<ul>`;
                    listStr +=
                        `<li>${variable.description}`;
                    if (variable.notes) {
                        listStr += markup_multiline_notes(variable.notes);
                    }
                    listStr += `</ul>`;
                }
                onevar.innerHTML = listStr;
                varlist.appendChild(onevar);
            }
        }
        // If there are variables, write their box inside notesBox
        if (hasVar === true) {
            notesBox.appendChild(varBox);
        }
    }
}

function display_tools(tools) {
    // Input: Array of objects; each object is a row in the db
    // With keys id, name, and description
    // The whole tools container is defined in the html
    const toolBox = document.getElementById('toolBox');
    toolBox.className = 'collectionBox';
    for (tool of tools) {
        // DIV for tool with name at top
        const tbox = document.createElement('div');
        tbox.className = 'itemBox';
        tbox.innerHTML = `${tool.id}. ${tool.name}`;
        toolBox.appendChild(tbox);
        // DIV for description appended to name
        const tdesc = document.createElement('div');
        tdesc.className = 'itemDesc';
        tdesc.innerHTML = convertUserMarkup(tool.description);
        tbox.appendChild(tdesc);
        // DIV for notes appended to tool
        // Construct notesBox by sending text to be inside
        let noteText = tool.notes;
        const notesBox = createNotesBox(noteText);
        notesBox.setAttribute('hidden', true);
        // DIV with button for toggling visibility of notes
        const btnBar = createShowHideBtnBar(notesBox)
        tbox.appendChild(btnBar)
        tbox.appendChild(notesBox);
    }
}

function createShowHideBtnBar(ele) {
    // Input: element whose visibility is to be toggled on/off
    // Output: DIV wrapping toggle button on its right
    const btnBar = document.createElement('div');
    btnBar.className = 'showHideBtnBar';
    const showHideBtn = document.createElement('button');
    showHideBtn.className = 'showHideButton';
    // Event for handling clicks on the visibility toggle
    showHideBtn.addEventListener('click', 
    ev => {
        toggleVisibility(ele);
        if (showHideBtn.innerText == 'Show Notes') {
            showHideBtn.innerText = 'Hide';
        } else {
            showHideBtn.innerText = 'Show Notes';
        }
    })
    showHideBtn.innerText = 'Show Notes';
    btnBar.appendChild(showHideBtn);
    return btnBar;
}

function createNotesBox(txt) {
    // Input: text to be displayed
    // Output: DIV with two children, title bar and note text
    let nb = document.createElement('div');
    nb.className = 'notesBox';
    // DIV for title bar at top of notes
    let notesBar = document.createElement('div');
    notesBar.className = 'notesBar';
    notesBar.innerHTML = 'Notes'
    nb.appendChild(notesBar);
    // DIV for text of notes
    let noteTextBox = document.createElement('div');
    noteTextBox.className = 'itemNotes';
    // Format the notes
    let noteText = convertUserMarkup(txt);
    noteText = markup_multiline_notes(noteText);
    noteTextBox.innerHTML = `<ul>${noteText}</ul>`;
    nb.appendChild(noteTextBox);
    return nb;
}

function toggleVisibility(ele) {
    if (ele.getAttribute('hidden')) {
        ele.removeAttribute('hidden');
    } else {
        ele.setAttribute('hidden', true);
    }
}

// ======= DISPLAY IN TABLE FOR EDITING =======

// COPIED FROM SCRIPTS_ATL, MUCH DIVERGED
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
	// Write each row of data into the table body
	let tbody = table.createTBody();
	for (d of data) {
		row = tbody.insertRow(-1);
		for (col of cols) {
			let cell = row.insertCell(-1);
			cell.innerHTML = d[col];
			// Add attribute to track column header
			cell.setAttribute('col_head', col);
		}
	}
    // Create a footer for control buttons like Add Row
    let tfoot = document.createElement('tfoot');
    table.appendChild(tfoot);
}

function toggleShowAllNotes() {
    const notes = document.querySelectorAll('.notesBox');
    let isHidden = notes[0].getAttribute('hidden');
    for (let n of notes) {
        let showHideBtn = n.previousElementSibling.children[0];
        if (isHidden) {
            showHideBtn.innerText = 'Hide';
            n.removeAttribute('hidden');
        } else {
            showHideBtn.innerText = 'Show Notes';
            n.setAttribute('hidden', true);
        }
    }
}

// Cell editing procedure based on The Codeholic
// https://www.youtube.com/watch?v=K6IH25Vf8ZA

function init_editing(tableid) {
    // Create class instance to handle editing cells and initialize
    const edit_table = new TableCellEditing(
		document.getElementById(tableid));
    edit_table.init();
} 

class TableCellEditing {
    // Constructor for class; parameter is table element
    constructor(table) {
        this.thead = table.querySelector('thead');
        this.tbody = table.querySelector('tbody');
        this.tfoot = table.querySelector('tfoot');
        this.tableid = table.id;
    }

    init() {
        // Initialize instance; make all cells editable
        // and listen for clicks
        this.tds = this.tbody.querySelectorAll('td');
        this.tds.forEach(td => {
            td.setAttribute('contentEditable', true);
            td.addEventListener('click', (ev) => {
                this.prepForEditing(td);
            });
        });
        // Add a button for inserting a new row to the table footer
        let addRowBtn = document.createElement('button');
        addRowBtn.className = 'add-row-button';
        addRowBtn.innerHTML = 'ADD ROW';
        addRowBtn.addEventListener('click', (ev) => this.addRow());
        this.tfoot.appendChild(addRowBtn);
    }

    prepForEditing(td) {
        // Check if the cell is already in editing mode
        // if it is, do nothing
        if (!this.inEditing(td)) {
            // Warn if another cell hasn't been saved
            const active_td = this.findEditing();
            if (active_td) {
                if (confirm('Save?')) {
                    this.finishEditing(active_td);
                } else {
                    this.cancelEditing(active_td);
                };
            }
            this.startEditing(td);
        }
    }

    addRow() {
        // Add a row to the end of the table
        let postjson = {'tableid': this.tableid};
        // Post table id to server
        fetch('/addrow', {
            method: 'POST',
            headers: new Headers({"Content-Type": "application/json"}),
            body: JSON.stringify(postjson)
        })
        .then(response => {
            // First response is headers
            return response.json();
        }
        )
        .then(message => {
            // Next response is returned by server function
            if (message.status === 'ok') {
                // Get array of column headers
                let ths = this.thead.rows[0].children;
                let col_heads = [];
                for (let th of ths) {
                    col_heads.push(th.innerText.toLowerCase());
                }
                // Create a new row at the bottom of the table
                let newrow = this.tbody.insertRow(-1);
                for (let i=0; i<col_heads.length; i++) {
                    newrow.insertCell(-1);
                }
                // Put the new row primary key id in leftmost cell
                newrow.cells[0].innerHTML = message.newid;
                // Make new cells editable
                let tds = newrow.cells;
                for (let td of tds) {
                    // Make editable (in this.init for other cells)
                    td.setAttribute('contentEditable', true);
                    // Track the column header (in set_table)
                    td.setAttribute('col_head', col_heads.shift());
                    // Listen for clicks (also in this.init)
                    td.addEventListener('click', (ev) => {
                        this.prepForEditing(td);
                    });
                }
             } else {
                alert("Sorry, an error may have occured")
            }
        })
        .catch(err => {
            // This will catch 404s etc.
            let err_message = err;
            alert(`Error: ${err}`);
        });
    }
    
    startEditing(td){
        // Record where user clicked (node and offset within td)
        const sel = window.getSelection();
        const _rng = sel.getRangeAt(0);
        // Get offset from start of node
        const nodeOffset = _rng.startOffset;
        // Get offset from start of td element
        // including all chars in innerHTML
        // This counts <br> tags as characters
        // TODO: but doesn't count other tags like <a>
        // NOTE: only do this with <br> tags?
        let rng = _rng.cloneRange();
        rng.selectNodeContents(td);
        rng.setEnd(_rng.endContainer, _rng.endOffset);
        const tdOffset = rng.toString().length;
        // If user has selected some chars, save the length
        const lenOfSelection = _rng.endOffset - _rng.startOffset;
        //console.log('=== NODES AT START: ', td.childNodes.length);
        //logNodes(td);
        // Get index of the node as a child of td
        let nodeIndex = 0;
        if (td.childNodes.length > 1) {
            // If there is only one node, no need to identify
            // which one was clicked
            nodeIndex = getNodeCount(td, tdOffset);
        }
        //console.log(`nodeIndex: ${nodeIndex}, ` +
        //    `nodeOffset: ${nodeOffset}, tdOffset: ${tdOffset}`);
        // Flag cell as being edited
        td.classList.add('in-editing');
        // Store original content in attribute in case of cancel/revert
        td.setAttribute('block-orig', td.innerHTML);
        // Markup for editing
        td.innerHTML = markup_for_editing(td.innerHTML);
        // Put a string in a blank cell to make a text node to be edited
        if (td.innerHTML === "") {
            td.innerHTML = 'TYPE';
        }
        // Show the Save and Cancel buttons
        // The buttons add a new div node to the cell
        this.createButtonToolbar(td);
        // Set the cursor back to where the user clicked
        // (adding the toolbar moves cursor to start of cell)
        // For a new cell with just 'TYPE' in it, select the word
        let zeronode = td.childNodes[0];
        if (zeronode.nodeValue === 'TYPE') {
            rng.setStart(zeronode, 0);
            rng.setEnd(zeronode, 4);
        } else {
            // Otherwise, set the cursor to the former position
            try {
                rng.setStart(td.childNodes[nodeIndex], nodeOffset);
                rng.setEnd(td.childNodes[nodeIndex], 
                    nodeOffset + lenOfSelection);
            }
            catch(err) {
                // TEMP FIX: TODO: Keep cursor position in string
                // Remove error when you start with >1 node 
                // like with <a> tags, but adding the <div> node
                // collapses the original nodes into a single node
                // Cursor is positioned under where the user clicked
                // even though the text beneath has changed
                rng.setStart(zeronode, tdOffset);
            }
        }
        sel.removeAllRanges();
        sel.addRange(rng);  
        //console.log('=== NODES AT END: ', td.childNodes.length);
        //logNodes(td);
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
        let postjson = {'tableid': this.tableid};
        postjson['record_id'] = record_id;
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
        return Array.prototype.find.call(
            this.tds, td => this.inEditing(td));
    }
}

function markup_for_display(str) {
    // Convert special markup entered by user
    let s = convertUserMarkup(str);
    // Make any html tags work invisibly (again)
    s = s.replace(/&lt;/g, '<');
    s = s.replace(/&gt;/g, '>');
    return s;
}

function markup_for_editing(str) {
    // Keep <br> tags by temporarily replacing < and >
    let s = str.replace(/<br>/g, '=br=')
    // Show other tags with <> characters for editing
    s = s.replace(/</g, '&lt;');
    s = s.replace(/>/g, '&gt;');
    // Now bring back <br> so those you don't see
    s = s.replace(/=br=/g, '<br>')
    return s;
}

function markup_multiline_notes(str) {
    // Remove initial hyphens
    let noteStr = str.replace(/^- /, '')
    // Prefix whole string with a <LI> node
    noteStr = "<li>".concat(noteStr);
    // Some notes have <BR> tags in them
    // (followed by hyphen+space)
    // Make these into additional <LI> nodes
    noteStr = noteStr.replace(/<br>- /g, '<li>');
    // Remove any trailing <LI> nodes
    noteStr = noteStr.replace(/<li>$/g, '');
    return noteStr;
}

function getNodeCount(ele, index) {
    // Page through element's contents as a string
    // until index (click point) is reached, counting tags
    // in order to return the node of the index
    // Assumes all '<' are start tags though, which they might not be
    // WORKS when tags are all <br>
    // TODO: don't count end tags
    const s = ele.innerHTML;
    let charCount = 1;
    let nodeCount = 0;
    let suspendCounting = false;
    for (char of s) {
        //console.log(`Checking char ${char} at count ${charCount}`)
        if (char === '<') { 
            suspendCounting = true;
            nodeCount ++; 
            //console.log(`Found tag open, node count now ${nodeCount}`);
        } else if (char === '>') {
            suspendCounting = false;
            nodeCount++;
            //console.log(`Found tag close, node count now ${nodeCount}`);
        } else if (suspendCounting) {
            // get next letter without counting
            continue;
        } else if (charCount >= index) {
            break;
        } else {
            charCount++;
        };
    };
    //console.log('Returning nodeCount: ', nodeCount)
    return nodeCount;
}

// For debugging
function logNodes(ele) {
    // Log child nodes of element to the console
    let index = 0;
    console.log(`=== LOG NODES (${ele.childNodes.length} total) ===`)
    ele.childNodes.forEach(node => {
        console.log(`Node ${index} = ${node.nodeName}, ${node.nodeValue}`);
        index++;
    });
    console.log(`=== ===`);
}