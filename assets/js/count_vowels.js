const countVowels = function() {
    const str = document.getElementById('input').value;
    const numVowels = (str !== '') ? str.match(/[aeiou]/gi).length : 0;
    document.getElementById('output').textContent = 'vowels: '+numVowels;
}

document.getElementById('input').addEventListener('input', countVowels);

countVowels();
