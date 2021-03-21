
// todo: block ie, because es6 is used

const write_speed_ms = 27;
// todo: switch to css animation - around 3000 ms
const show_options_delay_ms = 500;

var show_dialog = document.querySelector('#show-dialog');
var timer = document.querySelector('#dialog .timer-container .timer')
var options_container = dialog.querySelector('.options');
var is_page_typed_done = false;

var page_idx = 0;

function write_page(page_idx) {
    page_json_data = scenario_json_data[page_idx];

    var reader_view = document.querySelector('#app .reader .view');
    if (reader_view.innerText !== '') {
        var reader_history = document.querySelector('#app .reader .history');
        reader_history.innerText += reader_view.innerText;
        reader_view.innerText = '';
    }

    reader_view.classList.remove('finished');
    show_dialog.checked = false;
    options_container.innerHTML = '';
    timer.classList.remove('show');
    
    var chr_idx = 0;
    for (let paragraph of page_json_data.paragraphs) {
        for (let line of paragraph) {
            let chrs = line.split('');
            var being_written = '';
            for (let chr of chrs) {
                being_written += chr;
                if (chr === ' ') {
                    chr_idx++;
                    continue;
                }
                let written = being_written;
                setTimeout(() => {
                    reader_view.innerText += written;
                }, (chr_idx++) * write_speed_ms);
                being_written = '';
            }
            setTimeout(() => {
                reader_view.innerText += '\n';
            }, (chr_idx++) * write_speed_ms);
        }
        setTimeout(function() {
            reader_view.innerText += '\n\n';
        }, (chr_idx++) * write_speed_ms);
    }

    let options = page_json_data.options;
    if (options && 0 < options.length) {
        var options_title = document.createElement('h3')
        options_title.classList.add('title');
        options_title.innerText = page_json_data.options_title;
        options_container.appendChild(options_title);
        options.forEach((option, i) => {
            var chk = document.createElement('INPUT');
            chk.setAttribute('type', 'radio');
            chk.setAttribute('name', 'options');
            chk.setAttribute('id', 'opt-' + (i + 1).toString());
            chk.onclick = () => {
                // todo
                console.log('Oh!');
                is_page_typed_done = true;
            };
            
            var lbl = document.createElement('LABEL');
            lbl.innerText = option;
            lbl.classList.add('option');
            lbl.setAttribute('for', chk.getAttribute('id'));

            var option_container = document.createElement('div');
            option_container.appendChild(chk);
            option_container.appendChild(lbl);
            
            options_container.appendChild(option_container);
        });

        setTimeout(function() {
            show_dialog.checked = true;
            timer.classList.add('show');
        }, (chr_idx++) * write_speed_ms + show_options_delay_ms);
    } else {
        setTimeout(() => {
            reader_view.classList.add('finished');
            is_page_typed_done = true;
        }, (chr_idx++) * write_speed_ms);
    }

    const img = scenario_json_data[page_idx].background;
    document.querySelector('#app .background').style.backgroundImage = 'url(\'./img/' + img + '\')';
};

function curl_page() {
    if (!is_page_typed_done) {
        return false;
    }
    
    is_page_typed_done = false;
    show_dialog.checked = true;

    page_idx++;
    write_page(page_idx);
}
function keydown(e) {
    if (e.keyCode === 13) {
        if (e.target.classList.contains('toggle')) {
            return false;
        }

        curl_page();
    }
}
document.addEventListener('keydown', keydown);
document.querySelector('.go-to-next').addEventListener('click', curl_page);

function ready() {
    write_page(page_idx);
}
document.addEventListener('DOMContentLoaded', ready);
