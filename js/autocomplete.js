// Resuable func - can use this on any other project
// Will pass in config object, will have custom functions how autocomplete should work 

const createAutoComplete = ({
    rootWidget,
    renderOption,
    onOptionSelect,
    inputValue,
    fetchData
}) => {
    rootWidget.innerHTML = `

    <div class="row">
        <div class="col s12 m12 l12">
            <div class="results card transparent"></div>
        </div>
    </div>
    `;

    const input = document.querySelector('.input');
    const resultsWrapper = rootWidget.querySelector('.results');
    const tutorial = document.querySelector('.tutorial');

    // onInput(event...) will all be passed into function debounce(func)
    const onInput = async (event) => {
        const items = await fetchData(event.target.value); // fetchData is now asynchronous and wait for fetchData to get data
        if (!items.length) {
            return;
        }

        resultsWrapper.innerHTML = ''; // clears the existing list
        tutorial.remove('.subtitle');

        for (let item of items) {
            const movieDiv = document.createElement('div');
            movieDiv.classList.add('movieDiv');
            movieDiv.innerHTML = renderOption(item);


            /* When user clicks on anchor tag (option) - changes input value to correct title of movie
               Also removes the dropdown menu
            */
            movieDiv.addEventListener('click', () => {

                input.value = inputValue(item);
                onOptionSelect(item);
            });

            resultsWrapper.appendChild(movieDiv);
        }
    };

    input.addEventListener('input', debounce(onInput, 500));

    document.addEventListener('click', (event) => {
        if (input.contains(event.target)) {
            input.value = '';
        } else if (!input.contains(event.target)) {
            input.value = 'Enter Movie Title';
        }
    });
};


const debounce = (func, delay = 1000) => {
    let timeoutID;
    return (...args) => { // returns a new function and guards how often func can be invoked
        if (timeoutID) {
            clearTimeout(timeoutID);
        }
        timeoutID = setTimeout(() => {
            func.apply(null, args); // apply - calls func which is (onInput func) and takes all the args and pass them in arguments as an array.
        }, delay)
    };
};