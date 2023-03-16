
//(function () {
 
    function resetForm() {
        document.getElementById("wordList").innerHTML = "";

        const input = document.getElementById('combinationLetters');

        input.addEventListener('input', function (e) {
            const currentValue = e.target.value;
            const newValue = currentValue.replace(/,/g, '').split('').join(',');
            // Update the input value with the new value
            e.target.value = newValue;
        });
    }

    resetForm();

    function generateWords() {
        document.getElementById("wordList").innerHTML = "";

        const startLetter = (document.getElementById("startLetter").value).trim().toLowerCase();
        const combinationLetters = (document.getElementById("combinationLetters").value).trim().toLowerCase().split(",");
        const minLength = parseInt(document.getElementById("minLetter").value);
        const maxLength = parseInt(document.getElementById("maxLetter").value);
        const isStartLetter = document.getElementById("isStartLetterCheck").checked;
        const words = [];

        // Load the dictionary of valid English words
        const dictionary = new Set();
        const request = new XMLHttpRequest();
        const filePath = '../data/words_alpha.txt';
        request.open('GET', filePath , false);
        request.send();
        const dictionaryText = request.responseText;
        dictionaryText.split('\n').forEach(word => {
            dictionary.add(word.trim().toLowerCase());
        });

        function generate(prefix, remainingLength, availableLetters) {
            if (remainingLength === 0 && isStartLetter && dictionary.has(prefix)) {
                words.push(prefix);
                return;
            }

            for (let i = 0; i < availableLetters.length; i++) {
                const nextLetter = availableLetters[i];
                if (isStartLetter) {
                    if ((nextLetter !== startLetter) && (nextLetter !== prefix[prefix.length - 2])) {
                        const nextPrefix = prefix + nextLetter;
                        if (nextPrefix.length <= maxLength) {
                            const nextAvailableLetters = availableLetters.slice(0, i).concat(availableLetters.slice(i + 1));
                            generate(nextPrefix, remainingLength - 1, nextAvailableLetters);
                        }
                    }
                } else {
                    const nextPrefix = prefix + nextLetter;
                    if (nextPrefix.includes(startLetter) && nextPrefix.length >= minLength && nextPrefix.length <= maxLength && dictionary.has(nextPrefix)) {
                        words.push(nextPrefix);
                    }
                    if (nextPrefix.length < maxLength && dictionary.has(nextPrefix)) {
                        const nextAvailableLetters = availableLetters.slice(0, i).concat(availableLetters.slice(i + 1));
                        generate(nextPrefix, remainingLength - 1, nextAvailableLetters);
                    }
                }
            }
        }

        for (let length = minLength; length <= maxLength; length++) {
            if (isStartLetter) {
                generate(startLetter, length - 1, combinationLetters.filter(l => l !== startLetter));
            } else {
                combinationLetters.push(startLetter);
                generate('', length, combinationLetters);
            }

        }

        // Generate a dynamic list of words
        const newWords = [...new Set(words)];

        const ul = document.getElementById('wordList');
        newWords.forEach(word => {
            const li = document.createElement('li');
            const text = document.createTextNode(word);
            li.appendChild(text);
            ul.appendChild(li);

            // Read the word aloud when it is clicked
            li.addEventListener('click', () => {
                const utterance = new SpeechSynthesisUtterance(word);
                utterance.rate = 0.3;
                window.speechSynthesis.speak(utterance);
            });
        });

        document.body.appendChild(ul);
        //return words;
    }
//})();